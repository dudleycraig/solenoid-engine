import React, { useEffect, useRef, useState } from 'react';
import { Button, Row, Container } from 'react-bootstrap';
import useStore from '../../store';

const Icon = (props) => {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <path
        className="connection-toggle-icon-socket"
        d="m 495,17 c-8-8-20.9-8-28.9,0 l-39.9,39.9 c-16.8-11.2-36.4-17.2-57-17.2-27.5,0-53.4,10.7-72.9,30.2 l-58.4,58.4 c-8,8-8,20.9 0,28.9 l116.9,116.9 c12.5,11.3 25,3.8 28.9,0 l58.4-58.4 c35.2-35.2 39.6-89.9 13-129.9 l39.9-39.9c8-8 8-20.9 0-28.9z m-81.8,169.8 l-44,44-88-88 44-44 c11.8-11.8 27.4-18.2 44-18.2 16.6,0 32.3,6.5 44,18.2 24.3,24.2 24.3,63.7 0,88z"
      />
      <path
        className="connection-toggle-icon-plug"
        d="m 268.9,274.5 l-37.6,37.5-31.3-31.4 37.5-37.5 c8-8 8-20.9 0-28.9-8-8-20.9-8-28.9,0 l-37.5,37.5-13.9-13.9 c-3.8-3.8-16.1-11.2-28.9,0 l-58.4,58.4 c-35.2,35.2-39.6,89.9-13,129.9 l-39.9,40 c-8,8-8,20.9 0,28.9 8,8 20.9,8 28.9,0 l39.9-39.9 c16.8,11.2 36.4,17.2 57,17.2 27.5,0 53.4-10.7 72.9-30.2 l58.4-58.4 c8-8 8-20.9 0-28.9 l-13.9-13.9 37.5-37.5 c8-8 8-20.9 0-28.9-7.9-8-20.9-8-28.8-1.13687e-13z m-82.1,138.7 c-11.8,11.8-27.4,18.2-44,18.2s-32.3-6.5-44-18.2 c-24.3-24.3-24.3-63.8 0-88 l44-44 88,88-44,44z"
      />
    </svg>
  );
};

export default (props) => {
  const status = useStore((state) => state.api.status);
  const connect = useStore((state) => state.api.connect);
  const close = useStore((state) => state.api.close);
  const buttonRef = useRef();

  const messagesRef = useRef();
  const messages = useStore((state) => state.api.messages);
  const addMessage = useStore((state) => state.api.addMessage);
  const [connectionMessages, setConnectionMessages] = useState(
    messages.filter((message) => ['wsConnection', 'wsConnectionError'].includes(message.id))
  );
  useEffect(() => setConnectionMessages(messages.filter((message) => ['wsConnection', 'wsConnectionError'].includes(message.id))), [messages]);

  const toggleConnection = () => {
    switch (status) {
      case 'disconnected':
        connect().catch((event) => console.log('reject:', event));
        break;
      case 'connected':
        close();
        break;
      default:
        addMessage({ id: 'wsConnection', date: new Date(), status: 'warning', text: 'Busy.' });
        break;
    }
  };

  useEffect(() => {
    if (buttonRef.current) {
      switch (status) {
        case 'connected':
          buttonRef.current.classList.add('connected', 'active');
          buttonRef.current.classList.remove('disconnected', 'disconnecting', 'connecting', 'disabled');
          break;
        case 'disconnected':
          buttonRef.current.classList.add('disconnected');
          buttonRef.current.classList.remove('connected', 'disconnecting', 'connecting', 'disabled', 'active');
          break;
        case 'connecting':
          buttonRef.current.classList.add('connecting', 'disabled', 'active');
          buttonRef.current.classList.remove('disconnected', 'disconnecting', 'connected');
          break;
        case 'disconnecting':
          buttonRef.current.classList.add('disconnecing', 'disabled', 'active');
          buttonRef.current.classList.remove('disconnected', 'connecting', 'connected');
          break;
        case 'success':
          buttonRef.current.classList.add('success');
          buttonRef.current.classList.remove('warning', 'error');
          break;
        case 'warning':
          buttonRef.current.classList.add('warning');
          buttonRef.current.classList.remove('success', 'error');
          break;
        case 'error':
        default:
          buttonRef.current.classList.add('error');
          buttonRef.current.classList.remove('success', 'warning');
          break;
      }
    }
  }, [status]);

  return (
    <div id="connection" className="container d-flex h-100">
      <Button
        ref={buttonRef}
        className="connection-toggle disconnected btn btn-primary btn-md justify-content-center align-self-center"
        // onTouchStart={toggleConnection}
        onClick={toggleConnection}
        {...props}
      >
        <Icon className="connection-toggle-icon" width="20px" height="20px" />
      </Button>
      <div ref={messagesRef} className="connection-messages col auto justify-content-center align-self-center">
        {connectionMessages.slice(-1).map((message, index) => {
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
