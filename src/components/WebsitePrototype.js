import React from 'react';

const WebsitePrototype = ({ content }) => (
  <div className="prototype website-prototype">
    <h3>Website Prototype</h3>
    <div className="prototype-content">
      <iframe srcDoc={content} title="Website Prototype" />
    </div>
  </div>
);

export default WebsitePrototype;