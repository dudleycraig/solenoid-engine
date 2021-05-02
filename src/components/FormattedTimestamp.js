import React from 'react';

export default ({date, ...props}) => {
  const year = date.getFullYear();
  const month = ('0' + date.getMonth() + 1).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  const milliseconds = ('00' + date.getMilliseconds()).slice(-3);

  return (
    <span className="formatted-timestamp" {...props}>
      <span className="hours">{hours}</span>
      <span className="minutes">{minutes}</span>
      <span className="seconds">{seconds}</span>
      <span className="milliseconds">{milliseconds}</span>
    </span>
  );
};
