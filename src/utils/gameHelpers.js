export const checkWinner = (currentBoard) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
      return { winner: currentBoard[a], line };
    }
  }
  return { winner: null, line: [] };
};

export const getAvailableMoves = (currentBoard) => {
  return currentBoard.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null);
};

export const makeAIMove = (currentBoard) => {
  const available = getAvailableMoves(currentBoard);
  if (available.length === 0) return;

  const aiPlayer = 'O';
  const humanPlayer = 'X';

  // Check if AI can win
  for (let move of available) {
    const testBoard = [...currentBoard];
    testBoard[move] = aiPlayer;
    const { winner } = checkWinner(testBoard);
    if (winner === aiPlayer) {
      return move;
    }
  }

  // Check if need to block human
  for (let move of available) {
    const testBoard = [...currentBoard];
    testBoard[move] = humanPlayer;
    const { winner } = checkWinner(testBoard);
    if (winner === humanPlayer) {
      return move;
    }
  }

  // Take center if available
  if (available.includes(4)) return 4;

  // Take corners
  const corners = [0, 2, 6, 8].filter(c => available.includes(c));
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // Random move
  return available[Math.floor(Math.random() * available.length)];
};