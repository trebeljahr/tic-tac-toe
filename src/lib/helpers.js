const reverseCurrentSymbol = current => {
  return current === "X" ? "O" : "X";
};

const checkForWinningCondition = board => {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== "" &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      return [true, "row", i];
    }
  }
  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] !== "" &&
      board[0][j] === board[1][j] &&
      board[1][j] === board[2][j]
    ) {
      return [true, "col", j];
    }
  }
  if (
    board[0][0] !== "" &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return [true, "diagonal-1"];
  }
  if (
    board[0][2] !== "" &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return [true, "diagonal-2"];
  }
  return [false];
};

const getDefaultState = () => {
  return {
    board: [["", "", ""], ["", "", ""], ["", "", ""]],
    moves: [],
    currentSymbol: "X",
    playerNumber: 0,
    setup: true,
    gameOver: false
  };
};

export { getDefaultState, checkForWinningCondition, reverseCurrentSymbol };
