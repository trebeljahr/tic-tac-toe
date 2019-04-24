import React from "react";

const Field = ({ symbol, handleClick, field, content, winning }) => {
  return (
    <div
      className={content + " tile " + (winning ? "winning" : "")}
      onClick={() => handleClick(field)}
    >
      {content ? (
        content === "X" ? (
          <i className="fas fa-times" />
        ) : (
          <i className="far fa-circle" />
        )
      ) : null}
      <style jsx>{`
        .tile {
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
        }
        i {
          font-size: 4em;
        }
        .winning {
          background: red;
        }
      `}</style>
    </div>
  );
};
/*
  let buttons = [];
  let winningCombination = getWinningCombination(board);
  for (let i = 0; i < 9; i++) {
    let classes = [];
    board[Math.floor(i / 3)][i % 3] === "X"
      ? classes.push("X")
      : board[Math.floor(i / 3)][i % 3] === "O"
      ? classes.push("O")
      : classes.push("hover" + symbol);
    if (winningCombination[0] === true) {
      classes.push("noHover");
      for (let k = 0; k < 3; k++) {
        switch (winningCombination[1]) {
          case "col":
            i === k * 3 + winningCombination[2]
              ? classes.push("winning-field")
              : null;
            break;
          case "row":
            i === 3 * winningCombination[2] + k
              ? classes.push("winning-field")
              : null;
            break;
          case "diagonal-1":
            i === 0 || i === 4 || i === 8
              ? classes.push("winning-field")
              : null;
            break;
          case "diagonal-2":
            i === 2 || i === 4 || i === 6
              ? classes.push("winning-field")
              : null;
            break;
          default:
            break;
        }
      }
    }
    buttons.push(
      <button
        id={i}
        className={classes.join(" ")}
        onClick={() => handleClick(i)}
      >
        {board[Math.floor(i / 3)][i % 3]}
      </button>
    );
  }
  return buttons;
}*/
export default Field;
