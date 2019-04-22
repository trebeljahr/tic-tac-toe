import React from "react";
import { getDefaultState, checkForWinningCondition } from "./lib/helpers.js";
import { reverseCurrentSymbol } from "./lib/helpers.js";
import { MovesOutput, DeleteMove } from "./components/SmallComponents.js";
import StartingDecisions from "./components/StartingDecisions.js";
import ReplayControls from "./components/ReplayControls.js";
import Field from "./components/Field.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = getDefaultState();
  }
  handleClick = ({ x, y }) => {
    if (this.state.gameOver || this.state.board[x][y]) {
      return;
    }
    let copy = Object.assign({}, this.state);
    let symbol = copy.currentSymbol;
    copy.board[x][y] = symbol;
    copy.gameOver = checkForWinningCondition(copy.board)[0];
    copy.moves.push({ symbol, x, y });
    copy.currentSymbol = reverseCurrentSymbol(symbol);
    this.setState(copy);
  };
  decidePlayerNumber = decision => {
    this.setState({ playerNumber: decision });
    if (decision === 2) {
      this.startGame();
    }
  };
  decideSymbol = decision => {
    //this.setState({ currentSymbol: decision });
    this.startGame();
  };
  startGame = () => {
    this.setState({ setup: false });
  };
  removeLastTurn = () => {
    if (this.state.moves.length > 0) {
      let copy = Object.assign({}, this.state);
      let move = copy.moves[copy.moves.length - 1];
      copy.board[move.x][move.y] = "";
      copy.moves.pop();
      copy.currentSymbol = reverseCurrentSymbol(copy.currentSymbol);
      copy.gameOver = false;
      this.setState(copy);
    }
  };
  resetGame = () => {
    this.setState(getDefaultState());
  };
  render() {
    return (
      <div>
        {this.state.setup ? (
          <StartingDecisions
            currentSymbol={this.state.currentSymbol}
            playerNumber={this.state.playerNumber}
            decidePlayerNumber={this.decidePlayerNumber}
            decideSymbol={this.decideSymbol}
            startGame={this.startGame}
          />
        ) : (
          <div id="main-container">
            <div id="field-grid">
              {this.state.board.map((row, x) =>
                row.map((field, y) => (
                  <Field
                    key={x + "," + y}
                    handleClick={
                      this.state.board[x][y] ? x => x : this.handleClick
                    }
                    symbol={this.state.currentSymbol}
                    field={{ x, y }}
                    content={field}
                    winningPosition={checkForWinningCondition(this.state.board)}
                  />
                ))
              )}
            </div>
            <DeleteMove removeLastTurn={this.removeLastTurn} />
            <MovesOutput moves={this.state.moves} />
            <ReplayControls
              currentSymbol={this.state.currentSymbol}
              gameOver={this.state.gameOver}
              moves={this.state.moves}
              resetGame={this.resetGame}
            />
          </div>
        )}
        <style jsx global>
          {`
            button {
              margin: 1em;
              border: none;
              padding: 1em;
            }
            body {
              margin: 0;
              font-size: calc(
                14px + (26 - 14) * ((100vw - 300px) / (1600 - 300))
              );
              line-height: calc(
                1.3em + (1.5 - 1.2) * ((100vw - 300px) / (1600 - 300))
              );
            }
          `}
        </style>
        <style jsx>
          {`
            #field-grid {
              width: 80vmin;
              height: 80vmin;
              display: grid;
              grid-template-rows: 1fr 1fr 1fr;
              grid-template-columns: 1fr 1fr 1fr;
            }
            #main-container {
              text-align: center;
              align-items: center;
              display: flex;
              flex-direction: column;
            }
            #field-grid button {
              font-size: 10vh;
              border: 0.05em solid black;
              margin: 0;
              padding: 0;
            }
            #field-grid {
              border: 0.1em solid black;
            }
            #replay-controls {
              width: 30%;
              display: flex;
              justify-content: center;
            }
            .hoverButtons:hover {
              background: lightcoral;
            }
            .winning-field {
              background: crimson !important;
            }
            .noHover {
              pointer-events: none;
            }
          `}
        </style>
      </div>
    );
  }
}
export default App;
