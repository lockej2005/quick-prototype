import React from 'react';

const AIPrototype = ({ content }) => (
  <div className="prototype ai-prototype">
    <h3>AI Application Prototype</h3>
    <div className="prototype-content">
      <pre>{content}</pre>
    </div>
  </div>
);

export default AIPrototype;