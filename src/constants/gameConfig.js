import { getAssetPath } from '../utils/getAssetPath';

// Custom images for X and O
export const playerImages = {
    X: getAssetPath('img/player-x.webp'),
    O: getAssetPath('img/player-o.webp')
};

// Cell configuration
export const CellConfig = {
    size: 120,
    gap: 0,
};

// Canvas configuration
export const CanvasConfig = {
    size: 500,
    margin: 25,
};

// Piece configuration
export const PieceConfig = {
    scaleRatio: 0.7,  // How much of the cell the piece should fill
};

// Glow configuration (adjust these to control brightness)
export const GlowConfig = {
    borderLayers: 4,
    borderBaseAlpha: 0.25,
    borderAlphaDecay: 0.05,
    borderOffset: 3,
    borderOffsetIncrement: 3,

    cornerLayers: 3,
    cornerBaseAlpha: 0.3,
    cornerAlphaDecay: 0.08,
    cornerSize: 12,
    cornerSizeIncrement: 3,

    crosshairLayers: 3,
    crosshairBaseAlpha: 0.2,
    crosshairAlphaDecay: 0.05,
    crosshairWidth: 4,
    crosshairWidthDecay: 0.8,
};

// Color configuration
export const ColorConfig = {
    primary: 0x60a5fa,      // Blue
    secondary: 0xffffff,    // White
    warning: 0xfbbf24,      // Yellow (for blinking)
    background: 0x1e293b,   // Dark blue
    hoverTint: 0xd0e7ff,    // Light blue for hover
};