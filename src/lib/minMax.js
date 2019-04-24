import { reverseSymbol, getWinningCombination } from "./helpers.js";
var counter = 0;
export const minMax = (symbol, board, i) => {
  let iteration = i || 1;
  for (let i = 0; i < 9; i++) {
    console.log(counter++);
    let { x, y } = getCoords(i);
    let changeBoard = JSON.parse(JSON.stringify(board));
    if (board[x][y] === "") {
      changeBoard[x][y] = symbol;
      minMax(reverseSymbol(symbol), changeBoard, iteration);
    }
    if (iteration < 8) {
      iteration = iteration + 1;
      minMax(reverseSymbol(symbol), changeBoard, iteration);
    }

    if (getWinningCombination(board).length > 0) {
      return console.log("Found a winning board", counter++);
    }
    /*if (iteration < 9) {
      iteration = iteration + 1;
      minMax(reverseSymbol(symbol), board);
    }*/

    //board = [...oldBoard];
  }
};

const getCoords = num => {
  return { x: Math.floor(num.toString() / 3), y: num.toString() % 3 };
};
/*
  let array = arr || [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let out = array.splice(random(array.length - 1), 1);
  board[Math.floor(out.toString() / 3)][out.toString() % 3] = symbol;
  if (getWinningCombination(board).length === 3) {
    return console.log(board);
  }
  if (array.length === 0) {
    console.log("No winner");
  } else {
    for (let i = 0; i < array.length; i++) {
      minMax(reverseSymbol(symbol), board, array);
    }
  }*/
