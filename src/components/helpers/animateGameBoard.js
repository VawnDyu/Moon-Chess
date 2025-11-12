export function animateGameBoard(time, refs) {
  const { appRef, decorationsRef, cellSpritesRef, pieceSpritesRef, animationFrameRef, gameStateRef } = refs;

  if (!appRef.current) return;

  const { winningLine, winner, hoveredCell, blinkingPiece, board } = gameStateRef.current;

  const t = time / 1000;

  // Animate board decorations with glow
  decorationsRef.current.board?.forEach((decor, idx) => {
    if (decor && decor.diamond && decor.glow) {
      const pulse = 0.7 + Math.sin(t * 2 + idx) * 0.3;
      decor.diamond.alpha = pulse;
      decor.glow.alpha = pulse * 0.5;
      decor.glow.scale.set(1 + Math.sin(t * 2 + idx) * 0.1);
    }
  });

  // Animate cells
  cellSpritesRef.current.forEach((cellData, i) => {
    if (!cellData) return;
    // Add borderGlowLayers and innerBorderGlow to destructuring
    const { cell, borderGlowLayers, innerBorderGlow, corners, cornerGlows, crosshair, crosshairGlows } = cellData;

    if (!cell || !corners) return;

    // Winning line effect - High Contrast
    if (winningLine && winningLine.includes(i)) {
      cell.tint = 0x60a5fa;
      cell.alpha = 1;
      const winGlow = 0.9 + Math.sin(t * 4) * 0.1;

      if (borderGlowLayers) {
        borderGlowLayers.forEach((glow, idx) => {
          glow.alpha = (0.7 - idx * 0.15) + Math.sin(t * 4) * 0.2;
          glow.tint = 0x60a5fa;
        });
      }

      if (innerBorderGlow) {
        innerBorderGlow.alpha = 0.9;
        innerBorderGlow.tint = 0xffffff;
      }

      corners.forEach(c => {
        c.alpha = winGlow;
        c.tint = 0x60a5fa;
      });

      cornerGlows?.forEach(glowLayers => {
        glowLayers.forEach((g, idx) => {
          g.alpha = (0.7 - idx * 0.2) + Math.sin(t * 4) * 0.2;
          g.scale.set(1 + Math.sin(t * 4 + idx * 0.5) * 0.3);
          g.tint = 0x60a5fa;
        });
      });

      if (crosshair) {
        crosshair.alpha = winGlow;
        crosshair.tint = 0x60a5fa;
      }

      crosshairGlows?.forEach((g, idx) => {
        g.alpha = (0.6 - idx * 0.15) + Math.sin(t * 4) * 0.2;
        g.tint = 0x60a5fa;
      });
    }
    // // Winner flash effect
    // else if (winner) {
    //   const flashAlpha = 0.5 + Math.abs(Math.sin(t * 5)) * 0.5;
    //   cell.alpha = flashAlpha;

    //   if (borderGlowLayers) {
    //     borderGlowLayers.forEach((glow, idx) => {
    //       glow.alpha = flashAlpha * (0.5 - idx * 0.12);
    //       glow.tint = 0x60a5fa;
    //     });
    //   }

    //   if (innerBorderGlow) {
    //     innerBorderGlow.alpha = flashAlpha * 0.6;
    //     innerBorderGlow.tint = 0xffffff;
    //   }

    //   corners.forEach(c => c.alpha = flashAlpha * 0.8);

    //   cornerGlows?.forEach(glowLayers => {
    //     glowLayers.forEach((g, idx) => {
    //       g.alpha = flashAlpha * (0.5 - idx * 0.15);
    //       g.tint = 0x60a5fa;
    //     });
    //   });

    //   if (crosshair) crosshair.alpha = flashAlpha * 0.8;

    //   crosshairGlows?.forEach((g, idx) => {
    //     g.alpha = flashAlpha * (0.4 - idx * 0.12);
    //     g.tint = 0x60a5fa;
    //   });
    // }
// Hover effect - bright highlight with animation
else if (hoveredCell === i && !board[i]) {
  cell.tint = 0x60a5fa;
  cell.alpha = 0.7;
  const hoverPulse = 0.8 + Math.sin(t * 4) * 0.2;

  // Remove/hide the outer border glow layers on hover
  if (borderGlowLayers) {
    borderGlowLayers.forEach((glow, idx) => {
      glow.alpha = 0.6 - idx * 0.15;
      glow.tint = 0xd0e7ff;
    });
  }

  // Hide inner border glow too
  if (innerBorderGlow) {
      innerBorderGlow.alpha = 0.8;
      innerBorderGlow.tint = 0xffffff;
  }

  corners.forEach(c => {
    c.alpha = hoverPulse;
    c.tint = 0x60a5fa;
  });

  // Use diamond color (0x60a5fa) instead of light blue
  cornerGlows?.forEach(glowLayers => {
    glowLayers.forEach((g, idx) => {
      g.alpha = (0.5 - idx * 0.12) + Math.sin(t * 4) * 0.15;  // Increased glow
      g.scale.set(1 + Math.sin(t * 4 + idx * 0.3) * 0.2);
      g.tint = 0x60a5fa;  // Diamond blue color
    });
  });

  if (crosshair) {
    crosshair.alpha = hoverPulse;
    crosshair.tint = 0x60a5fa;
  }

  // Crosshair glows with diamond color
  crosshairGlows?.forEach((g, idx) => {
        g.alpha = (0.3 - idx * 0.1);
        g.tint = 0xd0e7ff;
  });
}
    // Blinking piece effect
    else if (i === blinkingPiece && !winner) {
      const blinkAlpha = 0.3 + Math.sin(t * 3) * 0.4;
      if (pieceSpritesRef.current[i]) {
        pieceSpritesRef.current[i].alpha = blinkAlpha;
      }

      if (borderGlowLayers) {
        borderGlowLayers.alpha = 0 // Hidden for blinking
      }

      if (innerBorderGlow) {
        innerBorderGlow.alpha = 0; // Hidden for blinking
      }
    }
    // Normal state
    else {
      cell.tint = 0xffffff;
      cell.alpha = 0.9;


      if (borderGlowLayers) {
        borderGlowLayers.forEach((glow, idx) => {
          glow.alpha = (0.06 - idx * 0.02) + Math.sin(t * 2 + idx * 0.5) * 0.01;
          glow.scale.set(1 + Math.sin(t * 2) * 0.02);
          glow.tint = 0x60a5fa;
        });
      }

      if (innerBorderGlow) {
        innerBorderGlow.alpha = 0; //Hidden in normal state
      }

      corners.forEach(c => {
        c.alpha = 0.6;
        c.tint = 0xffffff;
      });

      cornerGlows?.forEach(glowLayers => {
        glowLayers.forEach((g, idx) => {
          g.alpha = (0.08 - idx * 0.03) + Math.sin(t * 2 + idx * 0.5) * 0.02;
          g.scale.set(1 + Math.sin(t * 2) * 0.03);
          g.tint = 0x60a5fa;
        });
      });

      if (crosshair) {
        crosshair.alpha = 0.6;
        crosshair.tint = 0xffffff;
      }

      crosshairGlows?.forEach((g, idx) => {
        g.alpha = (0.06 - idx * 0.02) + Math.sin(t * 2) * 0.02;
        g.tint = 0x60a5fa;
      });

      if (pieceSpritesRef.current[i]) {
        pieceSpritesRef.current[i].alpha = 1;
      }
    }
  });

  animationFrameRef.current = requestAnimationFrame((nextTime) =>
    animateGameBoard(nextTime, refs)
  );
}

export function stopAnimation(animationFrameRef) {
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }
}