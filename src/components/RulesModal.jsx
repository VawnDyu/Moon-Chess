import { X } from 'lucide-react';

const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="modal-title">How to Play</h2>

        <div className="modal-body">
          <div className="rule-section">
            <h3>🎯 Goal</h3>
            <p>Align 3 pieces in a row to win</p>
          </div>

          <div className="rule-section">
            <h3>♟️ The Twist</h3>
            <p>Each player can only have <strong>2 pieces</strong> on the board.</p>
            <p>When you place your 3rd piece, your <span className="highlight-yellow">oldest piece vanishes</span>.</p>
          </div>

          <div className="rule-section">
            <h3>💡 Tips</h3>
            <p>• Watch for <span className="highlight-yellow">blinking pieces</span> - they'll disappear next</p>
            <p>• Time your moves to complete a line before pieces vanish</p>
          </div>
        </div>

        <button className="modal-button" onClick={onClose}>
          Let's Play!
        </button>
      </div>
    </div>
  );
};

export default RulesModal;