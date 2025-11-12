import { Sprite } from 'pixi.js';
import { PieceConfig } from '../../constants/gameConfig';

export function createPiece(texture, cellSize, animate = false) {
  const piece = new Sprite(texture);
  piece.anchor.set(0.5);
  piece.x = cellSize / 2;
  piece.y = cellSize / 2;

  // Scale to fit within cell (with some padding)
  const maxSize = cellSize * PieceConfig.scaleRatio;
  const targetScale = Math.min(maxSize / piece.width, maxSize / piece.height);

  if (animate) {
    // Start small and animate to full size
    piece.scale.set(0);

    // Pop animation using requestAnimationFrame
    const startTime = performance.now();
    const duration = 300; // 300ms animation

    const animatePop = (currentTime) => {
      // Check if piece still exists
      if (!piece || piece.destroyed) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Elastic easing for bounce effect
      let scale;
      if (progress < 1) {
        // Overshoot slightly then settle
        const overshoot = 1.2;
        if (progress < 0.7) {
          scale = (progress / 0.7) * overshoot * targetScale;
        } else {
          const settleProgress = (progress - 0.7) / 0.3;
          scale = (overshoot - (overshoot - 1) * settleProgress) * targetScale;
        }
        piece.scale.set(scale);
        requestAnimationFrame(animatePop);
      } else {
        piece.scale.set(targetScale);
      }
    };

    requestAnimationFrame(animatePop);
  } else {
    piece.scale.set(targetScale);
  }

  return piece;
}

export function animateHoverPiece(piece, targetScale) {
  // Check if piece exists
  if (!piece || piece.destroyed) return;

  // Start slightly smaller
  piece.scale.set(targetScale * 0.8);

  const startTime = performance.now();
  const duration = 200; // 200ms animation

  const animate = (currentTime) => {
    // Check if piece still exists during animation
    if (!piece || piece.destroyed) return;

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const scale = (0.8 + 0.2 * easeProgress) * targetScale;

    piece.scale.set(scale);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}