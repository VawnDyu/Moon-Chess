import { Users, Cpu, Info } from 'lucide-react';
import { useState } from 'react';

const ModeSelection = ({ onSelectMode, onShowRules }) => {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <div className="menu-container">
      <h1 className="title">Moon Chess</h1>
      <p className="subtitle">Choose your game mode</p>

      <div className="mode-buttons">
        <button
          onClick={() => onSelectMode('2player')}
          className="mode-button two-player"
        >
          <Users size={28} />
          2 Player Mode
        </button>

        <button
          onClick={() => onSelectMode('ai')}
          className="mode-button ai-mode"
        >
          <Cpu size={28} />
          Play vs AI
        </button>
      </div>

      <button
        className="credits-button"
        onClick={() => setShowCredits(!showCredits)}
      >
        <Info size={16} />
        Credits & Disclaimer
      </button>

      {showCredits && (
        <div className="disclaimer expanded">
          <p>
            <strong>Moon Chess</strong> is a fan-made mini game inspired by Genshin Impact.
          </p>
          <p>
            All character and assets (Aether, Lumine, The Damselette) belong to <strong>HoYoverse/miHoYo</strong>.
          </p>
          <p>
            This is a non-commercial, unofficial project created by fans for fans.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModeSelection;