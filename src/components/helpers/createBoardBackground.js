import { Graphics, Container } from "pixi.js";

export function createBoardBackground(app, centerOffset) {
  const container = new Container();

  // Outer glow layers
  const glowLayers = [];
  const numLayers = 6;

  for (let i = 0; i < numLayers; i++) {
    const layer = new Graphics();
    const radius = 220 + (i * 8);
    layer.circle(centerOffset, centerOffset, radius);

    // Gradient effect
    const alpha = 0.2 * (1 - i / numLayers);
    layer.fill({ color: 0x8b5cf6, alpha });

    container.addChild(layer);
    glowLayers.push(layer);
  }

  // Main outer ring
  const outer = new Graphics();
  outer.circle(centerOffset, centerOffset, 220);
  outer.fill({ color: 0x8b5cf6, alpha: 0.15 });
  container.addChild(outer);

  // Inner board area
  const inner = new Graphics();
  inner.circle(centerOffset, centerOffset, 210);
  inner.fill({ color: 0x1e293b, alpha: 0.5 });
  inner.stroke({ color: 0x60a5fa, width: 2, alpha: 0.6 });
  container.addChild(inner);

  // Inner glow ring
  const innerGlow = new Graphics();
  innerGlow.circle(centerOffset, centerOffset, 200);
  innerGlow.fill({ color: 0xa78bfa, alpha: 0.2 });
  container.addChild(innerGlow);

  // Center bright glow
  const centerGlow = new Graphics();
  centerGlow.circle(centerOffset, centerOffset, 180);
  centerGlow.fill({ color: 0xc4b5fd, alpha: 0.15 });
  container.addChild(centerGlow);

  app.stage.addChild(container);

  // Animation with same style as diamond
  let elapsed = 0;
  const animateFn = (delta) => {
    elapsed += delta.deltaTime * 0.05;
    const pulse = (Math.sin(elapsed) + 1) / 2;

    // Animate each outer glow layer with staggered effect
    glowLayers.forEach((layer, i) => {
      const layerPulse = (Math.sin(elapsed + i * 0.3) + 1) / 2;
      const baseAlpha = 0.2 * (1 - i / numLayers);
      layer.alpha = baseAlpha * (0.6 + layerPulse * 0.4);
    });

    // Main outer ring pulse
    outer.alpha = 0.15 + pulse * 0.2;

    // Inner glow pulse
    innerGlow.alpha = 0.15 + pulse * 0.15;

    // Center glow - brighter pulse
    centerGlow.alpha = 0.05 + pulse * 0.3;

    // Border stroke pulse
    inner.alpha = 0.5 + pulse * 0.1;

  };

  app.ticker.add(animateFn);

  // Return cleanup function
  return () => {
    app.ticker.remove(animateFn);
    container.destroy({ children: true });
  };
}