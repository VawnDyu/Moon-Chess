const GameStatus = ({ winner, isXTurn, gameMode }) => {
  const winnerName =
  gameMode === 'ai'
    ? winner === 'X'
      ? 'Aether'
      : 'The Damselette'
    : winner === 'X'
      ? 'Aether'
      : 'Lumine';
  return (
    <div className="status">
      {winner ? (
    <div className="winner-text">🎉 {winnerName} Wins! 🎉</div>
      ) : (
        <div>
          <div className="turn-text">
            Current Turn: <span className={isXTurn ? "x-piece" : "o-piece"}>
            {gameMode === 'ai'
              ? isXTurn
                ? 'Aether (You)'
                : 'The Damselette'
              : isXTurn
                ? 'Aether'
                : 'Lumine'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStatus;