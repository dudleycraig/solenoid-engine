import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import useStore from '../../../store';

export default (props) => {
  const rangeRef = useRef();

  const status = useStore((state) => state.api.status);
  const addMessage = useStore((state) => state.api.addMessage);
  const [apiStatus, setApiStatus] = useState(status);
  useEffect(() => {
    setApiStatus(status);
    if (rangeRef.current && status !== 'connected') {
      setDc(0.0);
      addMessage({ date: new Date(), id: 'wsDutycycle', status: 'warning', text: 'Unavailable.' });
    }
  }, [status]);

  const dc = useStore((state) => state.api.dc);
  const setDc = useStore((state) => state.api.setDc);
  const send = useStore((state) => state.api.send);
  const [dutycycle, setDutycycle] = useState(dc * 100);
  useEffect(() => setDutycycle(dc * 100), [dc]);

  const messagesRef = useRef();
  const messages = useStore((state) => state.api.messages);
  const [dutycycleMessages, setDutycycleMessages] = useState(messages.filter((message) => ['wsDutycycle', 'wsDutycycleError'].includes(message.id)));
  useEffect(() => setDutycycleMessages(messages.filter((message) => ['wsDutycycle', 'wsDutycycleError'].includes(message.id))), [messages]);

  return (
    <div id="dutycycle-range" className="container d-flex" {...props}>
      <div className="range-wrapper d-flex h-100 justify-content-center align-self-left" {...props}>
        <div className="range-follower" style={{ left: `calc(${dutycycle}% - 15px)` }}>
          {`${('000' + dutycycle.toFixed()).slice(-3)}%`}
        </div>
        <Form.Control
          ref={rangeRef}
          className="justify-content-center align-self-center"
          type="range"
          min="0"
          max="100"
          size="lg"
          value={dutycycle}
          onChange={(event) => setDc(parseFloat(parseInt(event.target.value) / 100))}
          onMouseUp={(event) => {
            send({ dc: parseFloat(parseInt(event.target.value) / 100) });
            if (status !== 'connected') setDc(0.0);
          }}
          onTouchEnd={(event) => {
            send({ dc: parseFloat(parseInt(event.target.value) / 100) });
            if (status !== 'connected') setDc(0.0);
          }}
        />
      </div>
      <div ref={messagesRef} className="dutycycle-messages col auto justify-content-center align-self-right">
        {dutycycleMessages.slice(-1).map((message, index) => {
          return (
            <span className="message align-middle" key={`connection-message-${index}`}>
              <span className={`small text-left ${message.status}`}>{message.text}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
