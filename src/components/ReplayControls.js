import React from "react";
import { reverseSymbol } from "../lib/helpers.js";

const ReplayControls = ({ gameOver, moves, symbol, resetGame, ai }) => {
  return (
    <div
      className={
        gameOver.length === 3 || moves.length === 9 ? "container" : "hidden"
      }
    >
      {gameOver.length !== 3 ? (
        <div className="replay-controls">
          <div className="white">
            <h2>It was a tie!</h2>
            <button className="hoverButtons" onClick={resetGame}>
              Replay
            </button>
          </div>
        </div>
      ) : (
        <div className="replay-controls">
          <div className="white">
            {ai ? (
              <h2>
                {symbol !== reverseSymbol(ai) ? "You win" : "The AI wins"}
              </h2>
            ) : (
              <h2>Player {reverseSymbol(symbol)} has won</h2>
            )}
            <button className="hoverButtons" onClick={resetGame}>
              Start a new game?
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
        button:hover {
          background: lightcoral;
        }
        h2 {
          margin: 0px;
        }
        .white {
          padding: 20px;
          background: white;
          text-align: center;
          -webkit-box-shadow: -2px 3px 58px 2px rgba(0, 0, 0, 0.57);
          -moz-box-shadow: -2px 3px 58px 2px rgba(0, 0, 0, 0.57);
          box-shadow: -2px 3px 58px 2px rgba(0, 0, 0, 0.57);
        }
        .container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 3;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .replay-controls {
          width: 90vmin;
          height: 90vmin;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .hidden {
          display: none;
        }
      `}</style>
    </div>
  );
};
export default ReplayControls;
