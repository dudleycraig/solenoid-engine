import React, { useRef, useEffect } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import useStore from '../../../../store';

const range = (from, to) => Array.from({ length: to - from + 1 }, (v, k) => k + from);

export default ({ x, y, title, paragraph, img, link, ...props }) => {
  const mARefs = range(1, 6).map(() => useRef());
  const fmA = (c, dc) => ('00000' + c.mA.toFixed(1)).slice(-5) + 'mA @ ' + ('00000' + (dc * 100).toFixed(1)).slice(-5) + '%';

  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      ({ metrics, activeCoil, dc }) => {
        const [sample] = metrics.slice(-1);
        mARefs.map((ref, coilIndex) => {
          if (ref.current) {
            ref.current.innerHTML = fmA(sample[`c${coilIndex + 1}`], dc);
            if (activeCoil === coilIndex) {
              ref.current.classList.add('svg-active');
              ref.current.classList.remove('svg-passive');
            } else {
              ref.current.classList.add('svg-passive');
              ref.current.classList.remove('svg-active');
            }
          }
        });
      },
      (state) => state.api
    );
    return () => unsubscribe();
  }, []);

  return (
    <g transform={`translate(${x} ${y})`} id="pwm-timing" {...props}>
      <OverlayTrigger
        placement="top"
        overlay={
          <Popover className="svg-popover">
            <Popover.Title as="h3">{title}</Popover.Title>
            <Popover.Content className="row" style={{ overflow: 'hidden' }}>
              <div className="col-3">
                <img
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '3px',
                  }}
                  width="60px"
                  height="60px"
                  src={img}
                />
              </div>
              <p className="col auto">{paragraph}</p>
            </Popover.Content>
          </Popover>
        }
      >
        <a href={link}>
          <path d="m 5,0 h 120 a 5,5 0 0 1 5,5 v 160 a 5,5 0 0 1 -5,5 h -120 a 5,5 0 0 1 -5,-5 v -160 a 5,5 0 0 1 5,-5 z" />
          <g transform="translate(25 12)" className="multi-text">
            <text ref={mARefs[0]} x="0" y="0" className="svg-passive">{`000.0mA @ 000.0%`}</text>
            <text ref={mARefs[1]} x="0" y="30" className="svg-passive">{`000.0mA @ 000.0%`}</text>
            <text ref={mARefs[2]} x="0" y="60" className="svg-passive">{`000.0mA @ 000.0%`}</text>
            <text ref={mARefs[3]} x="0" y="90" className="svg-passive">{`000.0mA @ 000.0%`}</text>
            <text ref={mARefs[4]} x="0" y="120" className="svg-passive">{`000.0mA @ 000.0%`}</text>
            <text ref={mARefs[5]} x="0" y="150" className="svg-passive">{`000.0mA @ 000.0%`}</text>
          </g>
        </a>
      </OverlayTrigger>
    </g>
  );
};
