import { getXAndYofAIMove, reverseSymbol, random } from "./helpers.js";
export const generateMove = (board, symbol) => {
  return (
    checks(board, symbol) ||
    checks(board, reverseSymbol(symbol)) ||
    middleOrCorner(board, reverseSymbol(symbol)) ||
    getXAndYofAIMove(board, symbol)
  );
};

const checks = (board, symbol) => {
  for (let y = 0; y < 3; y++) {
    let x = y;
    //Columns
    if (
      board[0][y] === symbol &&
      board[1][y] === symbol &&
      board[2][y] === ""
    ) {
      return { x: 2, y };
    }
    if (
      board[0][y] === symbol &&
      board[2][y] === symbol &&
      board[1][y] === ""
    ) {
      return { x: 1, y };
    }
    if (
      board[1][y] === symbol &&
      board[2][y] === symbol &&
      board[0][y] === ""
    ) {
      return { x: 0, y };
    }
    //Rows
    if (
      board[x][0] === symbol &&
      board[x][1] === symbol &&
      board[x][2] === ""
    ) {
      return { x, y: 2 };
    }
    if (
      board[x][0] === symbol &&
      board[x][2] === symbol &&
      board[x][1] === ""
    ) {
      return { x, y: 1 };
    }
    if (
      board[x][1] === symbol &&
      board[x][2] === symbol &&
      board[x][0] === ""
    ) {
      return { x, y: 0 };
    }

    //First diagonal
    if (
      board[0][0] === symbol &&
      board[1][1] === symbol &&
      board[2][2] === ""
    ) {
      return { x: 2, y: 2 };
    }
    if (
      board[0][0] === symbol &&
      board[2][2] === symbol &&
      board[1][1] === ""
    ) {
      return { x: 1, y: 1 };
    }
    if (
      board[2][2] === symbol &&
      board[1][1] === symbol &&
      board[0][0] === ""
    ) {
      return { x: 0, y: 0 };
    }
    //Second diagonal
    if (
      board[0][2] === symbol &&
      board[1][1] === symbol &&
      board[2][0] === ""
    ) {
      return { x: 2, y: 0 };
    }
    if (
      board[0][2] === symbol &&
      board[2][0] === symbol &&
      board[1][1] === ""
    ) {
      return { x: 1, y: 1 };
    }
    if (
      board[2][0] === symbol &&
      board[1][1] === symbol &&
      board[0][2] === ""
    ) {
      return { x: 0, y: 2 };
    }
  }
};
const middleOrCorner = (board, symbol) => {
  if (
    (board[0][0] === symbol ||
      board[0][2] === symbol ||
      board[2][2] === symbol ||
      board[2][0] === symbol) &&
    board[1][1] === ""
  ) {
    return { x: 1, y: 1 };
  }
  if (board[1][1] === symbol) {
    switch (random(4)) {
      case 1:
        return { x: 2, y: 2 };
      case 2:
        return { x: 0, y: 2 };
      case 3:
        return { x: 2, y: 0 };
      case 4:
        return { x: 0, y: 0 };
      default:
        break;
    }
  }
};
