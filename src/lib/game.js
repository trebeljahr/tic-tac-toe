import { getDefaultState, getWinningCombination, reverseSymbol } from "./helpers.js";
import { generateMove } from "./generateMove.js";

const isFinished = (state) => state.gameOver.length > 0 || state.moves.length === 9;

function move(state, { x, y }) {
  if (isFinished(state) || state.board[x]?.[y] !== "") return state;

  const board = state.board.map((row) => [...row]);
  board[x][y] = state.symbol;
  return {
    ...state,
    board,
    moves: [...state.moves, { symbol: state.symbol, x, y }],
    gameOver: getWinningCombination(board),
    symbol: reverseSymbol(state.symbol),
  };
}

function aiTurn(state, random) {
  if (!state.ai || state.symbol !== state.ai || isFinished(state)) return state;
  const field = generateMove(state.board, state.ai, random);
  return field ? move(state, field) : state;
}

// A complete human/AI turn is one update, independent of React's batching.
// Randomness arrives with the action so replaying a reducer call is deterministic.
export function gameReducer(state, action) {
  switch (action.type) {
    case "players":
      if (!state.setup || state.playerNumber !== 0 || ![1, 2].includes(action.players)) return state;
      return { ...state, playerNumber: action.players, setup: action.players === 1 };
    case "symbol":
      if (!state.setup || state.playerNumber !== 1 || !["X", "O"].includes(action.symbol)) return state;
      return aiTurn({ ...state, setup: false, ai: reverseSymbol(action.symbol) }, action.random);
    case "play": {
      if (state.setup || isFinished(state) || state.symbol === state.ai) return state;
      const next = move(state, action.field);
      return next === state ? state : aiTurn(next, action.random);
    }
    case "reset":
      return getDefaultState();
    default:
      return state;
  }
}
