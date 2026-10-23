import { useReducer } from "react";
import { getDefaultState } from "./lib/helpers.js";
import { gameReducer } from "./lib/game.js";
import StartingDecisions from "./components/StartingDecisions.js";
import ReplayControls from "./components/ReplayControls.js";
import Field from "./components/Field.js";

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, getDefaultState);
  const play = (field) => dispatch({ type: "play", field, random: Math.random() });

  return (
    <div>
      {state.setup ? (
        <StartingDecisions
          playerNumber={state.playerNumber}
          decidePlayerNumber={(players) => dispatch({ type: "players", players })}
          decideSymbol={(symbol) => dispatch({ type: "symbol", symbol, random: Math.random() })}
        />
      ) : (
        <div id="container">
          <ReplayControls
            gameOver={state.gameOver}
            moves={state.moves}
            resetGame={() => dispatch({ type: "reset" })}
            ai={state.ai}
          />
          <div id="field-grid-background">
            <div id="field-grid" aria-label="Tic-Tac-Toe board">
              {state.board.map((row, x) => row.map((content, y) => (
                <Field
                  key={`${x},${y}`}
                  handleClick={play}
                  field={{ x, y }}
                  content={content}
                  disabled={Boolean(content) || state.gameOver.length > 0 || state.moves.length === 9}
                  winning={state.gameOver.includes(`${x}${y}`)}
                />
              )))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
