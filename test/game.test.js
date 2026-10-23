import assert from "node:assert/strict";
import test from "node:test";
import { gameReducer } from "../src/lib/game.js";
import { generateMove } from "../src/lib/generateMove.js";
import { getDefaultState, getWinningCombination } from "../src/lib/helpers.js";

const play = (state, x, y, random = 0.5) => gameReducer(state, { type: "play", field: { x, y }, random });
const start = (players, symbol = "X", random = 0.5) => {
  const state = gameReducer(getDefaultState(), { type: "players", players });
  return players === 1 ? gameReducer(state, { type: "symbol", symbol, random }) : state;
};
const fixture = (board, symbol, ai = false) => ({
  ...getDefaultState(), setup: false, playerNumber: ai ? 1 : 2, ai, symbol, board,
  moves: board.flatMap((row, x) => row.flatMap((symbol, y) => symbol ? [{ symbol, x, y }] : [])),
  gameOver: getWinningCombination(board),
});

test("two players alternate without mutating earlier board or move history", () => {
  const initial = start(2);
  const first = play(initial, 0, 0);
  const second = play(first, 1, 1);
  assert.deepEqual(second.moves, [{ symbol: "X", x: 0, y: 0 }, { symbol: "O", x: 1, y: 1 }]);
  assert.equal(second.symbol, "X");
  assert.equal(initial.board[0][0], "");
  assert.equal(initial.moves.length, 0);
  assert.equal(first.board[1][1], "");
  assert.equal(first.moves.length, 1);
});

test("choosing X makes one human move and one AI reply atomically", () => {
  const initial = start(1, "X");
  assert.equal(initial.moves.length, 0);
  const result = play(initial, 0, 0);
  assert.deepEqual(result.moves, [{ symbol: "X", x: 0, y: 0 }, { symbol: "O", x: 1, y: 1 }]);
  assert.equal(result.symbol, "X");
});

test("choosing O lets X open, then returns each complete turn to O", () => {
  const initial = start(1, "O");
  assert.deepEqual(initial.moves, [{ symbol: "X", x: 1, y: 1 }]);
  assert.equal(initial.symbol, "O");
  const result = play(initial, 0, 0);
  assert.deepEqual(result.moves.map(({ symbol }) => symbol), ["X", "O", "X"]);
  assert.equal(result.symbol, "O");
  assert.equal(result.board[0][0], "O");
});

test("occupied cells, invalid cells, and setup cannot consume a turn", () => {
  const setup = getDefaultState();
  assert.equal(play(setup, 0, 0), setup);
  const state = play(start(1), 0, 0);
  assert.equal(play(state, 0, 0), state);
  assert.equal(play(state, -1, 3), state);
  assert.equal(play(state, 3, 3), state);
});

test("a two-player win keeps the winning cells and rejects later moves", () => {
  let state = start(2);
  for (const [x, y] of [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]]) state = play(state, x, y);
  assert.deepEqual(state.gameOver, ["00", "01", "02"]);
  assert.equal(state.moves.at(-1).symbol, "X");
  assert.equal(play(state, 2, 2), state);
});

test("a tie ends after nine moves", () => {
  let state = start(2);
  for (const [x, y] of [[0, 0], [0, 1], [0, 2], [1, 1], [1, 0], [1, 2], [2, 1], [2, 0], [2, 2]]) {
    state = play(state, x, y);
  }
  assert.equal(state.moves.length, 9);
  assert.deepEqual(state.gameOver, []);
  assert.equal(play(state, 0, 0), state);
});

test("the AI does not play after a human win or the final tied square", () => {
  const won = play(fixture([["X", "X", ""], ["O", "", ""], ["O", "", ""]], "X", "O"), 0, 2);
  assert.equal(won.moves.length, 5);
  assert.equal(won.moves.at(-1).symbol, "X");
  assert.deepEqual(won.gameOver, ["00", "01", "02"]);
  const tied = play(fixture([["X", "O", "X"], ["X", "O", "O"], ["O", "X", ""]], "X", "O"), 2, 2);
  assert.equal(tied.moves.length, 9);
  assert.deepEqual(tied.gameOver, []);
});

test("an AI winning reply ends the game on its symbol", () => {
  const result = play(fixture([["O", "O", ""], ["X", "", ""], ["X", "", ""]], "X", "O"), 1, 1);
  assert.equal(result.moves.length, 6);
  assert.deepEqual(result.gameOver, ["00", "01", "02"]);
  assert.equal(result.moves.at(-1).symbol, "O");
  assert.equal(play(result, 2, 2), result);
});

test("replay clears player choice, AI, winning cells, and move history", () => {
  const finished = play(fixture([["X", "X", ""], ["O", "", ""], ["O", "", ""]], "X", "O"), 0, 2);
  const reset = gameReducer(finished, { type: "reset" });
  assert.deepEqual(reset, getDefaultState());
  const next = gameReducer(reset, { type: "players", players: 2 });
  assert.equal(next.ai, false);
  assert.equal(next.symbol, "X");
  assert.equal(play(next, 2, 2).moves.length, 1);
  assert.equal(finished.board[2][2], "");
});

test("AI completes its win before blocking the opponent", () => {
  const board = [["O", "O", ""], ["X", "X", ""], ["", "", ""]];
  assert.deepEqual(generateMove(board, "O", 0.9), { x: 0, y: 2 });
});

test("AI blocks rows, columns, and both diagonals", () => {
  const lines = [
    [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]],
  ];
  for (const [first, second, [x, y]] of lines) {
    const board = getDefaultState().board;
    board[first[0]][first[1]] = "X";
    board[second[0]][second[1]] = "X";
    assert.deepEqual(generateMove(board, "O", 0.5), { x, y });
  }
});

test("AI corner selection never overwrites marks; full boards have no move", () => {
  const board = [["O", "", ""], ["", "X", ""], ["", "", ""]];
  const before = structuredClone(board);
  for (const random of [0, 0.2, 0.4, 0.6, 0.8, 0.999999]) {
    const { x, y } = generateMove(board, "O", random);
    assert.equal(board[x][y], "");
    assert.ok(x !== 1 && y !== 1);
  }
  assert.deepEqual(board, before);
  assert.equal(generateMove([["X", "O", "X"], ["X", "O", "O"], ["O", "X", "X"]], "O", 0.5), undefined);
});
