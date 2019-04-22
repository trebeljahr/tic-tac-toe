import React from "react";
const DeleteMove = ({ removeLastTurn }) => (
  <button className="hoverButtons" onClick={removeLastTurn}>
    Delete last move!
  </button>
);

const MovesOutput = ({ moves }) => <p>Moves: {moves.join(",")}</p>;

export { MovesOutput, DeleteMove };
