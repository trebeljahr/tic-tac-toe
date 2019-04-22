import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

function getDefaultState() {
  return {
    board: [[[], [], []], [[], [], []], [[], [], []]],
    moves: [],
    currentSymbol: "",
    gameOver: false,
    playerNumber: 0
  };
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = getDefaultState();
    this.handleClick = this.handleClick.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.removeLastTurn = this.removeLastTurn.bind(this);
    this.handleStartDecision = this.handleStartDecision.bind(this);
  }
  handleClick(pressedButtonIdentifier) {
    if (this.state.gameOver) {
      return;
    }
    let stateCopy = Object.assign({}, this.state);
    if (
      stateCopy.board[Math.floor(pressedButtonIdentifier / 3)][
        pressedButtonIdentifier % 3
      ] === "X" ||
      stateCopy.board[Math.floor(pressedButtonIdentifier / 3)][
        pressedButtonIdentifier % 3
      ] === "O"
    ) {
    } else {
      stateCopy.moves.push([pressedButtonIdentifier, stateCopy.currentSymbol]);
      stateCopy.board[Math.floor(pressedButtonIdentifier / 3)][
        pressedButtonIdentifier % 3
      ] = stateCopy.currentSymbol;
      if (checkForWinningCondition(stateCopy.board)[0]) {
        stateCopy.gameOver = true;
      }
      stateCopy.currentSymbol = reverseCurrentSymbol(stateCopy.currentSymbol);
      this.setState(stateCopy);
    }
  }
  handleStartDecision(decision) {
    if (typeof decision === "string") {
      this.setState({ currentSymbol: decision });
    } else {
      this.setState({ playerNumber: decision });
    }
  }
  removeLastTurn() {
    if (this.state.moves.length > 0) {
      let stateCopy = Object.assign({}, this.state);
      let row = Math.floor(stateCopy.moves[stateCopy.moves.length - 1][0] / 3);
      let col = Math.floor(stateCopy.moves[stateCopy.moves.length - 1][0] % 3);
      stateCopy.board[row][col] = [];
      stateCopy.moves.pop();
      stateCopy.currentSymbol = reverseCurrentSymbol(stateCopy.currentSymbol);
      stateCopy.gameOver = false;
      this.setState(stateCopy);
    }
  }
  resetGame() {
    this.setState(getDefaultState());
  }
  render() {
    return this.state.currentSymbol === "" || this.state.playerNumber === 0 ? (
      <StartingDecisions
        currentSymbol={this.state.currentSymbol}
        playerNumber={this.state.playerNumber}
        makeDecision={this.handleStartDecision}
      />
    ) : (
      <div id="main-container">
        <RemoveTurnControls removeLastTurn={this.removeLastTurn} />
        <div id="field-grid">
          <Fields
            handleClick={this.handleClick}
            board={this.state.board}
            gameOver={this.state.gameOver}
            currentSymbol={this.state.currentSymbol}
          />
        </div>
        <MovesOutput moves={this.state.moves} />
        <ReplayControls
          currentSymbol={this.state.currentSymbol}
          gameOver={this.state.gameOver}
          moves={this.state.moves}
          resetGame={this.resetGame}
        />
      </div>
    );
  }
}
function reverseCurrentSymbol(currentSymbol) {
  currentSymbol === "X" ? (currentSymbol = "O") : (currentSymbol = "X");
  return currentSymbol;
}
function checkForWinningCondition(board) {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      return [true, "row", i];
    }
  }
  for (let j = 0; j < 3; j++) {
    if (board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
      return [true, "col", j];
    }
  }
  if (board[0][0] === board[1][1] && board[1][1] == board[2][2]) {
    return [true, "diagonal-1"];
  }
  if (board[0][2] === board[1][1] && board[1][1] == board[2][0]) {
    return [true, "diagonal-2"];
  }
  return [false];
}

function StartingDecisions(props) {
  if (props.currentSymbol === "") {
    return (
      <div id="decision-button-container">
        Do you want to play{" "}
        <button className="X" onClick={() => props.makeDecision("X")}>
          X
        </button>{" "}
        or{" "}
        <button className="O" onClick={() => props.makeDecision("O")}>
          O
        </button>{" "}
        ?
      </div>
    );
  }
  if (props.playerNumber === 0) {
    return (
      <div id="decision-button-container">
        How many players?{" "}
        <button className="O" onClick={() => props.makeDecision(1)}>
          1
        </button>{" "}
        or{" "}
        <button className="X" onClick={() => props.makeDecision(2)}>
          2
        </button>{" "}
        ?
      </div>
    );
  }
}
function RemoveTurnControls(props) {
  return (
    <button className="hoverButtons" onClick={props.removeLastTurn}>
      Delete last move!
    </button>
  );
}
function ReplayControls(props) {
  return (
    <div id="replay-controls">
      {props.gameOver ? (
        <div>
          <div>Player {props.currentSymbol === "X" ? "O" : "X"} won</div>
          <button className="hoverButtons" onClick={() => props.resetGame()}>
            Start a new game?
          </button>
        </div>
      ) : props.moves.length === 9 ? (
        <div>
          <div>It was a tie!</div>
          <button className="hoverButtons" onClick={() => props.resetGame()}>
            Replay
          </button>
        </div>
      ) : (
        <div>Player {props.currentSymbol} is moving</div>
      )}{" "}
    </div>
  );
}
function MovesOutput(props) {
  return <p>Moves: {props.moves.map(e => e.join("")).join(", ")}</p>;
}
function Fields(props) {
  let buttons = [];
  let winningCondition = checkForWinningCondition(props.board);
  for (let i = 0; i < 9; i++) {
    let classes = [];
    props.board[Math.floor(i / 3)][i % 3] === "X"
      ? classes.push("X")
      : props.board[Math.floor(i / 3)][i % 3] === "O"
      ? classes.push("O")
      : classes.push("hover" + props.currentSymbol);
    if (winningCondition[0] === true) {
      classes.push("noHover");
      for (let k = 0; k < 3; k++) {
        switch (winningCondition[1]) {
          case "col":
            i === k * 3 + winningCondition[2]
              ? classes.push("winning-field")
              : null;
            break;
          case "row":
            i === 3 * winningCondition[2] + k
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
        onClick={() => props.handleClick(i)}
      >
        {props.board[Math.floor(i / 3)][i % 3]}
      </button>
    );
  }
  return buttons;
}
ReactDOM.render(<App />, document.getElementById("root"));

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
