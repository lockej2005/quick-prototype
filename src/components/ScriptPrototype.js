import React from 'react';

const ScriptPrototype = ({ content }) => (
  <div className="prototype script-prototype">
    <h3>Script/Utilities Prototype</h3>
    <div className="prototype-content">
      <pre>{content}</pre>
    </div>
  </div>
);

export default ScriptPrototype;