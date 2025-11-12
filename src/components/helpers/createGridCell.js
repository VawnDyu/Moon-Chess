import { Container, Graphics } from 'pixi.js';

export function createGridCell({
  index,
  cellSize,
  gap,
  startX,
  startY,
  onCellClick,
  onCellHover,
}) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const x = startX + col * (cellSize + gap);
  const y = startY + row * (cellSize + gap);

  const cellContainer = new Container();
  cellContainer.x = x;
  cellContainer.y = y;

  // Multiple border glow layers for stronger effect (like image 2)
  const borderGlowLayers = [];
  for (let i = 0; i < 4; i++) {
    const offset = 3 + i * 3;
    const alpha = 0.25 - i * 0.05
    const glow = new Graphics();
    glow.roundRect(-offset, -offset, cellSize + offset * 2, cellSize + offset * 2, 2);
    glow.fill({ color: 0x60a5fa, alpha: alpha });
    cellContainer.addChild(glow);
    borderGlowLayers.push(glow);
  }

  // Cell background with better contrast
  const cell = new Graphics();
  cell.roundRect(0, 0, cellSize, cellSize, 2);
  cell.fill({ color: 0x1e293b, alpha: 0.9 });
  cell.stroke({ color: 0x60a5fa, width: 1, alpha: 0.7 });
  cellContainer.addChild(cell);

  // Bright inner border stroke
  const innerBorderGlow = new Graphics();
  innerBorderGlow.roundRect(1, 1, cellSize - 2, cellSize - 2, 2);
  innerBorderGlow.stroke({ color: 0xffffff, width: 2, alpha: 0 });
  cellContainer.addChild(innerBorderGlow);

  // Enhanced glass highlight
  const highlight = new Graphics();
  highlight.rect(cellSize * 0.1, 0, cellSize * 0.8, cellSize * 0.3);
  highlight.fill({ color: 0xffffff, alpha: 0.15 });
  cellContainer.addChild(highlight);

  // Brighter crosshair glow layers
  const crosshairGlows = [];
  for (let i = 0; i < 3; i++) {
    const glowLayer = new Graphics();
    const width = 4 - i * 0.8;
    const alpha = 0.2 - i * 0.05;

    glowLayer.moveTo(0, cellSize / 2);
    glowLayer.lineTo(cellSize * 0.3, cellSize / 2);
    glowLayer.moveTo(cellSize * 0.7, cellSize / 2);
    glowLayer.lineTo(cellSize, cellSize / 2);
    glowLayer.moveTo(cellSize / 2, 0);
    glowLayer.lineTo(cellSize / 2, cellSize * 0.3);
    glowLayer.moveTo(cellSize / 2, cellSize * 0.7);
    glowLayer.lineTo(cellSize / 2, cellSize);
    glowLayer.stroke({ color: 0x60a5fa, width: width, alpha: alpha });
    cellContainer.addChild(glowLayer);
    crosshairGlows.push(glowLayer);
  }

  // Brighter crosshair (on top)
  const crosshair = new Graphics();
  crosshair.moveTo(0, cellSize / 2);
  crosshair.lineTo(cellSize * 0.3, cellSize / 2);
  crosshair.moveTo(cellSize * 0.7, cellSize / 2);
  crosshair.lineTo(cellSize, cellSize / 2);
  crosshair.moveTo(cellSize / 2, 0);
  crosshair.lineTo(cellSize / 2, cellSize * 0.3);
  crosshair.moveTo(cellSize / 2, cellSize * 0.7);
  crosshair.lineTo(cellSize / 2, cellSize);
  crosshair.stroke({ color: 0x60a5fa, width: 2, alpha: 0.8 });
  cellContainer.addChild(crosshair);

  // Brighter corner diamonds with glow
  const corners = [];
  const cornerGlows = [];
  const cornerPositions = [
    { x: 6, y: 6, r: -Math.PI / 4 },
    { x: cellSize - 6, y: 6, r: Math.PI / 4 },
    { x: 6, y: cellSize - 6, r: -3 * Math.PI / 4 },
    { x: cellSize - 6, y: cellSize - 6, r: 3 * Math.PI / 4 }
  ];

  cornerPositions.forEach(pos => {
    const glowLayers = [];
    for (let i = 0; i < 3; i++) {
      const glowSize = 12 + i * 3;
      const glowAlpha = 0.3 - i * 0.08;

      const glow = new Graphics();
      glow.poly([
        { x: 0, y: -glowSize },
        { x: glowSize * 0.5, y: 0 },
        { x: 0, y: glowSize },
        { x: -glowSize * 0.5, y: 0 }
      ]);
      glow.fill({ color: 0x60a5fa, alpha: glowAlpha });
      glow.x = pos.x;
      glow.y = pos.y;
      glow.rotation = pos.r;
      cellContainer.addChild(glow);
      glowLayers.push(glow);
    }
    cornerGlows.push(glowLayers);

    const corner = new Graphics();
    corner.poly([
      { x: 0, y: -8 },
      { x: 4, y: 0 },
      { x: 0, y: 8 },
      { x: -4, y: 0 }
    ]);
    corner.fill({ color: 0x60a5fa, alpha: 0.9 });
    corner.x = pos.x;
    corner.y = pos.y;
    corner.rotation = pos.r;
    cellContainer.addChild(corner);
    corners.push(corner);
  });

  // Interactive area
  const hitArea = new Graphics();
  hitArea.rect(0, 0, cellSize, cellSize);
  hitArea.fill({ color: 0x000000, alpha: 0.01 });
  hitArea.eventMode = 'static';
  hitArea.cursor = 'pointer';

  hitArea.on('pointerdown', () => {
    onCellClick(index);
  });

  hitArea.on('pointerenter', () => {
    onCellHover(index);
  });

  hitArea.on('pointerleave', () => {
    onCellHover(null);
  });

  cellContainer.addChild(hitArea);

  return {
    container: cellContainer,
    cell,
    borderGlowLayers,
    innerBorderGlow,
    corners,
    cornerGlows,
    crosshair,
    crosshairGlows,
    highlight,
    hitArea
  };
}