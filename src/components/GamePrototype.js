import React from 'react';

const GamePrototype = ({ content }) => (
  <div className="prototype game-prototype">
    <h3>Video Game Prototype</h3>
    <div className="prototype-content">
      <canvas id="game-canvas">{content}</canvas>
    </div>
  </div>
);

export default GamePrototype;