import { useState, useMemo } from 'react';
import ModeSelection from './components/ModeSelection';
import GameStatus from './components/GameStatus';
import PixiGameBoard from './components/PixiGameBoard';
import RulesModal from './components/RulesModal';
import { RotateCcw, BookOpen } from 'lucide-react';
import { useGameLogic } from './hooks/useGameLogic';
import './App.css';
import { playerImages } from './constants/gameConfig';

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [showRules, setShowRules] = useState(false);

  // ✅ Memoize playerImages to prevent recreation
  const stablePlayerImages = useMemo(() => playerImages, []);

  const {
    board,
    isXTurn,
    winner,
    winningLine,
    hoveredCell,
    blinkingPiece,
    handleClick,
    setHoveredCell,
    resetGame,
  } = useGameLogic(gameMode);  // ✅ Remove playerImages from here

  const backToMenu = () => {
    resetGame();
    setGameMode(null);
  };

  // Mode Selection Screen
  if (!gameMode) {
    return (
      <>
        <div className="app">
          <ModeSelection onSelectMode={setGameMode} onShowRules={() => setShowRules(true)} />
        </div>
        <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      </>
    );
  }

  // Game Screen with PixiJS
  return (
    <>
      <div className="app">
        <div className="game-container">
          <button className="rules-button" onClick={() => setShowRules(true)}>
            <BookOpen size={22} />
          </button>

          <GameStatus
            winner={winner}
            isXTurn={isXTurn}
            gameMode={gameMode}
            blinkingPiece={blinkingPiece}
          />

          <PixiGameBoard
            board={board}
            winningLine={winningLine}
            blinkingPiece={blinkingPiece}
            hoveredCell={hoveredCell}
            isXTurn={isXTurn}
            winner={winner}
            gameMode={gameMode}
            playerImages={stablePlayerImages}  // ✅ Use stable reference
            onCellClick={handleClick}
            onCellHover={setHoveredCell}
          />

          <div className="action-buttons">
            <button onClick={resetGame} className="button reset-button">
              <RotateCcw size={20} />
              New Game
            </button>
            <button onClick={backToMenu} className="button menu-button">
              Main Menu
            </button>
          </div>
        </div>
      </div>
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </>
  );
}

export default App;