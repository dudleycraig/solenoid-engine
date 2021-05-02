import React from 'react';

export default ({ messages, className="" }) => {
  return (
    <ul className={`messages ${className}`} style={{display:Object.keys(messages).length > 0 ? 'inline-block' : 'none', listStyle:'none'}}>
      { 
        Object.keys(messages).map(uuid => {
          if(messages[uuid] && messages[uuid].status && messages[uuid].text) {
            return <li className={`message ${messages[uuid].status}`} key={`message-${uuid}`}>{messages[uuid].text}</li>
          }
        })
      }
    </ul>
  ); 
};

