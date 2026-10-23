export default function ReplayControls({ gameOver, moves, resetGame, ai }) {
  if (gameOver.length === 0 && moves.length < 9) return null;

  const winner = moves.at(-1)?.symbol;
  const message = gameOver.length === 0
    ? "It was a tie!"
    : ai
      ? winner === ai ? "The AI wins" : "You win"
      : `Player ${winner} has won`;

  return (
    <div className="result-container">
      <div className="replay-controls">
        <div className="result-panel">
          <h2 role="status">{message}</h2>
          <button type="button" onClick={resetGame}>
            {gameOver.length === 0 ? "Replay" : "Start a new game?"}
          </button>
        </div>
      </div>
    </div>
  );
}
