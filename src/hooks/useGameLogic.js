import { useState, useEffect, useRef } from 'react';
import { checkWinner, getAvailableMoves, makeAIMove } from '../utils/gameHelpers';

export const useGameLogic = (gameMode) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [moveHistory, setMoveHistory] = useState({ X: [], O: [] });
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Use refs to track the latest values
  const moveHistoryRef = useRef(moveHistory);
  const boardRef = useRef(board);
  const isXTurnRef = useRef(isXTurn);

  // Keep refs in sync
  useEffect(() => {
    moveHistoryRef.current = moveHistory;
    boardRef.current = board;
    isXTurnRef.current = isXTurn;
  }, [moveHistory, board, isXTurn]);

  const makeMove = (index) => {
    console.log('🎯 Making move at index:', index);

    // Read current state from refs
    const currentIsXTurn = isXTurnRef.current;
    const currentHistory = moveHistoryRef.current;
    const currentBoard = boardRef.current;

    const currentPlayer = currentIsXTurn ? 'X' : 'O';
    const opponent = currentIsXTurn ? 'O' : 'X';

    console.log('📍 isXTurn:', currentIsXTurn);
    console.log('👤 Current player:', currentPlayer);

    // Create new state objects
    const newBoard = [...currentBoard];
    const newHistory = {
      X: [...currentHistory.X],
      O: [...currentHistory.O]
    };

    console.log('Before move - History:', newHistory);

    // Remove OPPONENT's oldest piece if OPPONENT already has 3 pieces
    if (newHistory[opponent].length >= 3) {
      const oldestMove = newHistory[opponent].shift();
      console.log(`🗑️ Removing ${opponent}'s oldest piece at index:`, oldestMove);
      newBoard[oldestMove] = null;
    }

    // Place the new piece
    newBoard[index] = currentPlayer;
    newHistory[currentPlayer].push(index);

    console.log('After move - New history:', newHistory);
    console.log('After move - New board:', newBoard);

    // Check for winner
    const { winner: gameWinner, line } = checkWinner(newBoard);

    // Update all states at once
    setBoard(newBoard);
    setMoveHistory(newHistory);
    setIsXTurn(!currentIsXTurn);

    if (gameWinner) {
      console.log('🏆 Winner found:', gameWinner);
      setWinner(gameWinner);
      setWinningLine(line);
    }
  };

  const handleClick = (index) => {
    console.log('🖱️ Click on cell:', index);

    // Check using refs for latest state
    if (boardRef.current[index]) {
      console.log('❌ Cell already occupied');
      return;
    }
    if (winner) {
      console.log('❌ Game already won');
      return;
    }
    if (gameMode === 'ai' && !isXTurnRef.current) {
      console.log('❌ AI turn, ignoring click');
      return;
    }

    makeMove(index);
  };

  // AI hovering and move logic
  useEffect(() => {
    if (gameMode === 'ai' && !isXTurn && !winner) {
      console.log('🤖 AI thinking...');
      const available = getAvailableMoves(boardRef.current);
      if (available.length === 0) return;

      const thinkingDelay = setTimeout(() => {
        const aiMove = makeAIMove(boardRef.current);
        if (aiMove === undefined) return;

        console.log('🤖 AI decided to move to:', aiMove);

        const availableForHover = available.filter(cell => cell !== aiMove);
        const randomCell = availableForHover.length > 0
          ? availableForHover[Math.floor(Math.random() * availableForHover.length)]
          : available[Math.floor(Math.random() * available.length)];

        setHoveredCell(randomCell);

        const timer = setTimeout(() => {
          setHoveredCell(aiMove);
          setTimeout(() => {
            makeMove(aiMove);
            setHoveredCell(null);
          }, 1000);
        }, 1000);

        return () => {
          clearTimeout(timer);
          setHoveredCell(null);
        };
      }, 800);

      return () => {
        clearTimeout(thinkingDelay);
        setHoveredCell(null);
      };
    }
  }, [isXTurn, gameMode, winner]);

  const getBlinkingPiece = () => {
    if (winner) return null;
    const opponent = isXTurn ? 'O' : 'X';
    const opponentHistory = moveHistory[opponent];

    if (opponentHistory.length >= 3) {
      return opponentHistory[0];
    }
    return null;
  };

  const resetGame = () => {
    console.log('🔄 Resetting game');
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setMoveHistory({ X: [], O: [] });
    setWinner(null);
    setWinningLine([]);
    setHoveredCell(null);
  };

  return {
    board,
    isXTurn,
    moveHistory,
    winner,
    winningLine,
    hoveredCell,
    blinkingPiece: getBlinkingPiece(),
    handleClick,
    setHoveredCell,
    resetGame,
  };
};