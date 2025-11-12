import { Container, Graphics, Sprite, Texture } from "pixi.js";

export function createDiamond(x, y, rotation, ticker) {
  const container = new Container();
  container.x = x;
  container.y = y;
  container.rotation = rotation;

  const width = 21;
  const height = 48;

  // Helper function to create diamond polygon points
  const getDiamondPoints = (inset = 0) => [
    { x: width / 2, y: inset },
    { x: width - inset, y: height * 0.35 },
    { x: width / 2, y: height - inset },
    { x: inset, y: height * 0.35 },
  ];

  // Create diamond-shaped glow (multiple layers for gradient effect)
  const outerGlowLayers = [];
  const glowLayers = 8; // Number of glow layers

  for (let i = 0; i < glowLayers; i++) {
    const layer = new Graphics();
    const expansion = -3 - (i * 2.5);
    layer.poly(getDiamondPoints(expansion));

    // Gradient effect
    const alpha = 0.3 * (1 - i / glowLayers);
    layer.fill({ color: 0x60a5fa, alpha });
    layer.x = -width / 2;
    layer.y = -height / 2;

    container.addChild(layer);
    outerGlowLayers.push(layer);
  }

  // Diamond main shape
  const diamond = new Graphics();
  diamond.poly(getDiamondPoints(0));
  diamond.fill({ color: 0x4f46e5, alpha: 0.9 });
  diamond.x = -width / 2;
  diamond.y = -height / 2;
  container.addChild(diamond);

  // Inner glow
  const innerGlow = new Graphics();
  innerGlow.poly(getDiamondPoints(3));
  innerGlow.fill({ color: 0x7dd3fc, alpha: 0.5 });
  innerGlow.x = -width / 2;
  innerGlow.y = -height / 2;
  container.addChild(innerGlow);

  // Center bright core
  const centerGlow = new Graphics();
  centerGlow.poly(getDiamondPoints(7));
  centerGlow.fill({ color: 0xe0f2fe, alpha: 0.7 });
  centerGlow.x = -width / 2;
  centerGlow.y = -height / 2;
  container.addChild(centerGlow);

  // Top highlight
  const topHighlight = new Graphics();
  topHighlight.poly(getDiamondPoints(0));
  topHighlight.fill({ color: 0xffffff, alpha: 0.4 });
  topHighlight.x = -width / 2;
  topHighlight.y = -height / 2;
  container.addChild(topHighlight);

  // Animate with brighter pulse
  let elapsed = 0;
  const animateFn = (delta) => {
    elapsed += delta.deltaTime * 0.05;
    const pulse = (Math.sin(elapsed) + 1) / 2;

    // Animate each outer glow layer with staggered effect
    outerGlowLayers.forEach((layer, i) => {
      const layerPulse = (Math.sin(elapsed + i * 0.3) + 1) / 2;
      const baseAlpha = 0.3 * (1 - i / glowLayers);
      layer.alpha = baseAlpha * (0.6 + layerPulse * 0.4);
    });

    // Inner Glow Pulse
    innerGlow.alpha = 0.4 + pulse * 0.3;

    // Center Glow
    centerGlow.alpha = 0.6 + pulse * 0.4;

    // Highlight Shimmer
    topHighlight.alpha = 0.3 + pulse * 0.4;

  };

  ticker.add(animateFn);
  container.userData = { animateFn, ticker };

  return container;
}

export function destroyDiamond(container) {
  if (container.userData) {
    container.userData.ticker.remove(container.userData.animateFn);
  }
  container.destroy({ children: true });
}