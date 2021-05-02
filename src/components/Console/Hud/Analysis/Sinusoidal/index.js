import React, { useEffect, useState, useRef } from 'react';
import useStore from '../../../../../store';

const msToDate = (ms) => new Date(ms);

const range = (from, to) => Array.from({ length: to - from + 1 }, (v, k) => k + from);

const sinePoint = (x, degree, diameter) =>
  `${x} ${((Math.sin(x * (Math.PI / 180) - degree * (Math.PI / 180)) * 4) / Math.PI) * diameter + diameter}`;

const Time = ({ date, ...props }) => {
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  const milliseconds = ('00' + date.getMilliseconds()).slice(-3);
  return (
    <g className="time" {...props}>
      <text className="time">{`${hours}::${minutes}::${seconds}`}</text>
      <text className="milliseconds" transform="translate(101.5 0)">{`.${milliseconds}`}</text>
    </g>
  );
};

export default (props) => {
  const metrics = useStore((state) => state.api.metrics);
  const diameter = 60;
  const [sample, setSample] = useState({ ms: Date.now(), r: 360, rpm: null });
  const [sinePoints, setSinePoints] = useState(
    range(1, 360).reduce((accumulator, x) => [...accumulator, sinePoint(x, sample.r, diameter)], [])
  );

  useEffect(() => {
    const [sample] = metrics.slice(-1);
    setSinePoints(range(1, 360).reduce((accumulator, x) => [...accumulator, sinePoint(x, sample.r, diameter)], []));
    setSample(sample);
  }, [metrics]);

  return (
    <svg className={`sinusoidal`} width="100%" height="100%" viewBox="0 0 580 200">
      <g transform="translate(70 20)">
        <g transform="translate(0 0)">
          <circle className="path" cx={diameter} cy={diameter} r={(4 / Math.PI) * diameter} />
          <line
            x1={diameter}
            y1={diameter}
            x2={((Math.cos(sample.r * (Math.PI / 180)) * 4) / Math.PI) * diameter + diameter}
            y2={((-Math.sin(sample.r * (Math.PI / 180)) * 4) / Math.PI) * diameter + diameter}
          />
        </g>
        <g transform="translate(150 0)">
          <line className="path" x1="0" y1={diameter} x2="360" y2={diameter} />
          <polyline points={sinePoints} />
          <line className="path" x1={sample.r} y1={-20} x2={sample.r} y2={150} />
        </g>
      </g>
      <g transform="translate(113 200)">
        <text x={0} y={0}>{`${sample.r}°`}</text>
      </g>
      <g transform={`translate(330 200)`}>
        <Time date={msToDate(sample.ms)} />
      </g>
    </svg>
  );
};
