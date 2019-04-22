import React from "react";

const StartingDecisions = ({
  playerNumber,
  decidePlayerNumber,
  decideSymbol,
  startGame
}) => (
  <div>
    {playerNumber === 0 ? (
      <div id="decision-button-container">
        How many players?
        <button className="O" onClick={() => decidePlayerNumber(1)}>
          1
        </button>
        or
        <button className="X" onClick={() => decidePlayerNumber(2)}>
          2
        </button>
        ?
      </div>
    ) : (
      <div id="decision-button-container">
        Do you want to play
        <button className="X" onClick={() => decideSymbol("X")}>
          X
        </button>
        or
        <button className="O" onClick={() => decideSymbol("O")}>
          O
        </button>
        ?
      </div>
    )}
    <style jsx>
      {`
        .X {
          background: lightgreen;
        }
        .O {
          background: lightblue;
        }
        .hoverX:hover {
          background: lightgreen;
        }
        .hoverO:hover {
          background: lightblue;
        }
        #decision-button-container {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 20%;
              font-size: 1.2em;
            }
      @media only screen and (min-width: 768px) {
        #decision-button-container {
          font-size: 2.5em;
        }
      }
      #decision-button-container button {
        font-size: 1em;
        width: 2em;
        height: 2em;
        border-radius: 100%;
        border: none;
        margin: 0.5em;
        padding: 0;`}
    </style>
  </div>
);

export default StartingDecisions;
