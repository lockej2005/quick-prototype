import React from 'react';

const MobilePrototype = ({ content }) => (
  <div className="prototype mobile-prototype">
    <h3>Mobile Application Prototype</h3>
    <div className="prototype-content mobile-frame">
      <div className="mobile-screen">
        {content}
      </div>
    </div>
  </div>
);

export default MobilePrototype;