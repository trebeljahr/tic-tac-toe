export default function StartingDecisions({ playerNumber, decidePlayerNumber, decideSymbol }) {
  return (
    <div id="decision-button-container">
      {playerNumber === 0 ? (
        <>
          How many players?
          <button type="button" className="O" onClick={() => decidePlayerNumber(1)}>1</button>
          or
          <button type="button" className="X" onClick={() => decidePlayerNumber(2)}>2</button>
          ?
        </>
      ) : (
        <>
          Do you want to play
          <button type="button" className="X" onClick={() => decideSymbol("X")}>X</button>
          or
          <button type="button" className="O" onClick={() => decideSymbol("O")}>O</button>
          ?
        </>
      )}
    </div>
  );
}
