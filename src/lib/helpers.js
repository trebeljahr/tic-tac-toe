const reverseSymbol = current => {
  return current === "X" ? "O" : "X";
};

const getWinningCombination = board => {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== "" &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      return ["" + i + 0, "" + i + 1, "" + i + 2];
    }
  }
  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] !== "" &&
      board[0][j] === board[1][j] &&
      board[1][j] === board[2][j]
    ) {
      return ["" + 0 + j, "" + 1 + j, "" + 2 + j];
    }
  }
  if (
    board[0][0] !== "" &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return ["" + 0 + 0, "" + 1 + 1, "" + 2 + 2];
  }
  if (
    board[0][2] !== "" &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return ["" + 0 + 2, "" + 1 + 1, "" + 2 + 0];
  }
  return [];
};

const getDefaultState = () => {
  return {
    board: [["", "", ""], ["", "", ""], ["", "", ""]],
    moves: [],
    symbol: "X",
    ai: false,
    playerNumber: 0,
    setup: true,
    gameOver: false
  };
};
var b = [];
export const minMax = (board, symbol, originalSymbol, a) => {
  board.forEach((tile, x) => {
    tile.forEach((content, y) => {
      a = a + 1;
      //console.log(a);
      if (content === "") {
        board[x][y] = symbol;
      }
      if (getWinningCombination(board).length > 0) {
        b.push(getWinningCombination(board));
      }
      if (a < 9) {
        minMax(board, reverseSymbol(symbol), symbol, a);
      }
    });
  });
  console.log(b);
};
const getXAndYofAIMove = (board, symbol) => {
  if (random(1)) {
    console.log("Hello");
  } else {
  }
  let x = random(2);
  let y = random(2);
  if (board[x][y] !== "") {
    return getXAndYofAIMove(board, symbol);
  } else {
    return { x, y };
  }
};

/*const chance = c => {
  return random(100) >= c;
};*/

export const random = n => {
  return Math.floor(Math.random() * (n + 1));
};

export {
  getDefaultState,
  getWinningCombination,
  reverseSymbol,
  getXAndYofAIMove
};
