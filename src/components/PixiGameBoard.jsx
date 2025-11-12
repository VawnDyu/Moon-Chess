import { useEffect, useRef } from "react";
import { Application, Assets, Sprite } from "pixi.js";
import { createDiamond } from "./helpers/createDiamond";
import { createGridCell } from "./helpers/createGridCell";
import { createBoardBackground } from "./helpers/createBoardBackground";
import { animateGameBoard, stopAnimation } from "./helpers/animateGameBoard";
import { createPiece, animateHoverPiece } from "./helpers/createPiece";
import { CellConfig, CanvasConfig, PieceConfig } from "../constants/gameConfig";

const PixiGameBoard = ({
  board,
  playerImages,
  onCellClick,
  onCellHover,
  winner,
  gameMode,
  isXTurn,
  winningLine,
  blinkingPiece,
  hoveredCell
}) => {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const initializedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const texturesRef = useRef({ X: null, O: null });

  const cellSpritesRef = useRef([]);
  const pieceSpritesRef = useRef([]);
  const hoverPieceRef = useRef(null);
  const hitAreasRef = useRef([]);
  const decorationsRef = useRef({ corners: [], centers: [], board: [] });

  const gameStateRef = useRef({
    winningLine,
    winner,
    hoveredCell,
    blinkingPiece,
    board,
    isXTurn
  });

  useEffect(() => {
    console.log('🎮 PixiGameBoard received board update:', board);
  }, [board]);

  useEffect(() => {
    gameStateRef.current = {
      winningLine,
      winner,
      hoveredCell,
      blinkingPiece,
      board,
      isXTurn
    };
  }, [winningLine, winner, hoveredCell, blinkingPiece, board, isXTurn]);

  // Handle rendering pieces when board changes
  useEffect(() => {
    if (!appRef.current || !texturesRef.current.X) return;

    board.forEach((cell, i) => {
      if (cell && !pieceSpritesRef.current[i]) {
        const texture = cell === 'X' ? texturesRef.current.X : texturesRef.current.O;
        const piece = createPiece(texture, CellConfig.size, true);

        cellSpritesRef.current[i].container.addChild(piece);
        pieceSpritesRef.current[i] = piece;
      } else if (!cell && pieceSpritesRef.current[i]) {
        pieceSpritesRef.current[i].destroy();
        pieceSpritesRef.current[i] = null;
      }
    });
  }, [board]);

  // Handle hover preview
  useEffect(() => {
    if (!appRef.current || !texturesRef.current.X) return;

    if (hoverPieceRef.current) {
      hoverPieceRef.current.destroy();
      hoverPieceRef.current = null;
    }

    if (hoveredCell !== null && !board[hoveredCell] && !winner) {
      const texture = isXTurn ? texturesRef.current.X : texturesRef.current.O;
      const hoverPiece = new Sprite(texture);
      hoverPiece.anchor.set(0.5);
      hoverPiece.x = CellConfig.size / 2;
      hoverPiece.y = CellConfig.size / 2;
      hoverPiece.alpha = 0.5;

      const maxSize = CellConfig.size * PieceConfig.scaleRatio;
      const targetScale = Math.min(maxSize / hoverPiece.width, maxSize / hoverPiece.height);

      cellSpritesRef.current[hoveredCell].container.addChild(hoverPiece);
      hoverPieceRef.current = hoverPiece;

      animateHoverPiece(hoverPiece, targetScale);
    }
  }, [hoveredCell, board, isXTurn, winner]);

  // Update cursors based on game state
  useEffect(() => {
    if (!hitAreasRef.current.length) return;

    hitAreasRef.current.forEach((hitArea, i) => {
      if (!hitArea) return;

      const isOccupied = board[i] !== null;
      const isAITurn = gameMode === 'ai' && !isXTurn;
      const isGameOver = winner !== null;

      if (isOccupied || isAITurn || isGameOver) {
        hitArea.cursor = 'default';
      } else {
        hitArea.cursor = 'pointer';
      }
    });
  }, [board, isXTurn, winner, gameMode]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initPixi = async () => {
      console.log("🎨 Pixi initialized once");

      const app = new Application();
      await app.init({
        width: CanvasConfig.size,
        height: CanvasConfig.size,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      });

      containerRef.current.appendChild(app.canvas);
      appRef.current = app;

      const centerOffset = CanvasConfig.size / 2;

      // Load textures
      const xTexture = await Assets.load(playerImages.X);
      const oTexture = await Assets.load(playerImages.O);
      texturesRef.current = { X: xTexture, O: oTexture };

      // Background
      createBoardBackground(app, centerOffset);

      // Diamonds
      const diamonds = [
        createDiamond(centerOffset, CanvasConfig.margin, 0, app.ticker),
        createDiamond(centerOffset, CanvasConfig.size - CanvasConfig.margin, Math.PI, app.ticker),
        createDiamond(CanvasConfig.margin, centerOffset, -Math.PI / 2, app.ticker),
        createDiamond(CanvasConfig.size - CanvasConfig.margin, centerOffset, Math.PI / 2, app.ticker),
      ];
      diamonds.forEach((d) => app.stage.addChild(d));

      // Grid Calculations
      const gridWidth = CellConfig.size * 3 + CellConfig.gap * 2;
      const gridHeight = CellConfig.size * 3 + CellConfig.gap * 2;
      const startX = (CanvasConfig.size - gridWidth) / 2;
      const startY = (CanvasConfig.size - gridHeight) / 2;

      const handleCellClick = (index) => {
        const currentState = gameStateRef.current;

        if (currentState.board[index]) {
          console.log('❌ Cell occupied');
          return;
        }

        if (currentState.winner) {
          console.log('❌ Game over');
          return;
        }

        if (gameMode === 'ai' && !currentState.isXTurn) {
          console.log('❌ AI is thinking, please wait');
          return;
        }

        onCellClick(index);
      };

      const handleCellHover = (index) => {
        const currentState = gameStateRef.current;

        if (!currentState.board[index] && !currentState.winner) {
          if (gameMode === 'ai' && !currentState.isXTurn) {
            onCellHover(null);
            return;
          }
          onCellHover(index);
        } else {
          onCellHover(null);
        }
      };

      // Grid
      for (let i = 0; i < 9; i++) {
        const cellData = createGridCell({
          index: i,
          cellSize: CellConfig.size,
          gap: CellConfig.gap,
          startX,
          startY,
          onCellClick: handleCellClick,
          onCellHover: handleCellHover,
          winner,
          gameMode,
          isXTurn
        });

        app.stage.addChild(cellData.container);

        cellSpritesRef.current[i] = {
          container: cellData.container,
          cell: cellData.cell,
          borderGlowLayers: cellData.borderGlowLayers,
          innerBorderGlow: cellData.innerBorderGlow,
          corners: cellData.corners,
          cornerGlows: cellData.cornerGlows,
          crosshair: cellData.crosshair,
          crosshairGlows: cellData.crosshairGlows,
          highlight: cellData.highlight,
        };

        hitAreasRef.current[i] = cellData.hitArea;

        pieceSpritesRef.current[i] = null;
        decorationsRef.current.corners.push(...cellData.corners);
        decorationsRef.current.centers.push(cellData.crosshair);
      }

      // Start animation loop
      const refs = {
        appRef,
        decorationsRef,
        cellSpritesRef,
        pieceSpritesRef,
        animationFrameRef,
        gameStateRef
      };

      animationFrameRef.current = requestAnimationFrame((time) =>
        animateGameBoard(time, refs)
      );
    };

    initPixi();

    return () => {
      stopAnimation(animationFrameRef);

      if (hoverPieceRef.current) {
        hoverPieceRef.current.destroy();
      }

      if (appRef.current) {
        appRef.current.destroy(true, true);
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        appRef.current = null;
        console.log("🧹 Pixi cleaned up");
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: `${CanvasConfig.size}px`,
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    />
  );
};

export default PixiGameBoard;