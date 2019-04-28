//Tic Tac Toe Game!
import React from "react";
import { getDefaultState, getWinningCombination } from "./lib/helpers.js";
import { reverseSymbol } from "./lib/helpers.js";
import StartingDecisions from "./components/StartingDecisions.js";
import ReplayControls from "./components/ReplayControls.js";
import Field from "./components/Field.js";
import { generateMove } from "./lib/generateMove.js";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = getDefaultState();
  }
  handleClick = ({ x, y }) => {
    if (this.state.gameOver.length > 0 || this.state.board[x][y]) {
      return;
    }
    if (this.state.ai) {
      this.aiMove(x, y);
    } else {
      this.move({ x, y }, this.state.symbol);
      this.changeTurns();
    }
  };
  async aiMove(x, y) {
    if (this.state.symbol === reverseSymbol(this.state.ai)) {
      await this.move({ x, y }, this.state.symbol);
      await this.changeTurns();
    }
    if (
      this.state.moves.length < 9 &&
      getWinningCombination(this.state.board).length === 0
    ) {
      await this.move(
        generateMove(this.state.board, this.state.ai),
        this.state.symbol
      );
      await this.changeTurns();
    }
  }
  changeTurns = () => {
    this.setState({
      symbol: reverseSymbol(this.state.symbol)
    });
  };
  move = ({ x, y }, symbol) => {
    let copy = Object.assign({}, this.state);
    copy.board[x][y] = symbol;
    copy.gameOver = getWinningCombination(copy.board);
    copy.moves.push({ symbol, x, y });
    this.setState(() => copy);
  };
  decidePlayerNumber = decision => {
    this.setState({ playerNumber: decision });
    if (decision === 2) {
      this.startGame();
    }
  };
  decideSymbol = decision => {
    this.startGame();
    this.setState(
      () => ({
        ai: reverseSymbol(decision)
      }),
      () => {
        if (decision === "O") {
          this.aiMove();
        }
      }
    );
  };
  startGame = () => {
    this.setState({ setup: false });
  };
  resetGame = () => {
    this.setState(getDefaultState());
  };
  render() {
    let winning = getWinningCombination(this.state.board);
    return (
      <div>
        {this.state.setup ? (
          <StartingDecisions
            symbol={this.state.symbol}
            playerNumber={this.state.playerNumber}
            decidePlayerNumber={this.decidePlayerNumber}
            decideSymbol={this.decideSymbol}
            startGame={this.startGame}
          />
        ) : (
          <div id="container">
            <ReplayControls
              symbol={this.state.symbol}
              gameOver={this.state.gameOver}
              moves={this.state.moves}
              resetGame={this.resetGame}
              ai={this.state.ai}
            />
            <div id="field-grid-background">
              <div id="field-grid">
                {this.state.board.map((row, x) =>
                  row.map((field, y) => {
                    return (
                      <Field
                        key={x + "," + y}
                        handleClick={
                          this.state.board[x][y] ? x => x : this.handleClick
                        }
                        symbol={this.state.symbol}
                        field={{ x, y }}
                        content={field}
                        winning={winning.includes("" + x + y)}
                      />
                    );
                  })
                )}
              </div>
            </div>
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
        <style jsx>{`
          #container {
            width: 100vw;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 0;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          #field-grid-background {
            width: 80vmin;
            height: 80vmin;
            background: black;
          }
          #field-grid {
            width: 80vmin;
            height: 80vmin;
            display: grid;
            grid-template-rows: 1fr 1fr 1fr;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 2px;
          }
        `}</style>
      </div>
    );
  }
}
export default App;
