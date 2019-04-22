import React from "react";

const ReplayControls = ({ gameOver, moves, currentSymbol, resetGame }) => (
  <div id="replay-controls">
    {gameOver ? (
      <div>
        <div>Player {currentSymbol === "X" ? "O" : "X"} won</div>
        <button className="hoverButtons" onClick={() => resetGame()}>
          Start a new game?
        </button>
      </div>
    ) : moves.length === 9 ? (
      <div>
        <div>It was a tie!</div>
        <button className="hoverButtons" onClick={() => resetGame()}>
          Replay
        </button>
      </div>
    ) : (
      <div>Player {currentSymbol} is moving</div>
    )}
  </div>
);

export default ReplayControls;
