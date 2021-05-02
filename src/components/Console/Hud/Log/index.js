import React, { useRef, useEffect } from 'react';
import Hud from '../../../Hud';
import useStore from '../../../../store';

const Time = ({ date, ...props }) => {
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  const milliseconds = ('00' + date.getMilliseconds()).slice(-3);
  return (
    <span className="date-time" {...props}>
      <span className="time">{`${hours}:${minutes}:${seconds}`}</span>
      <span className="milliseconds" transform="translate(101.5 0)">{`.${milliseconds}`}</span>
    </span>
  );
};

export default ({ maxRows = 20, ...props }) => {
  const hud = useStore((state) => state.hud.log);
  const { messages } = useStore((state) => state.log);

  return (
    <Hud id="log" title={'Log'} hud={hud}>
      <div className="messages">
        {messages
          .slice(maxRows * -1)
          .reverse() // TODO: rather prepend messages and drop reverse sort
          .map((message) => {
            return (
              <div className="row small message" key={`message-${message.date.getTime()}-${message.id}`}>
                <div className="col-xl-2 col-md-2 text-right">
                  <Time date={message.date} />
                </div>
                <div className={`col-xl-10 col-md-10 text-left ${message.status}`}>{message.text}</div>
              </div>
            );
          })}
      </div>
    </Hud>
  );
};
