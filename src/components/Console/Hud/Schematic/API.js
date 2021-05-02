import React, { useRef, useEffect } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import useStore from '../../../../store';

const range = (from, to) => Array.from({ length: to - from + 1 }, (v, k) => k + from);

export default ({ x, y, title, paragraph, img, link, ...props }) => {
  const tRefs = range(1, 6).map(() => useRef());
  const mARef = useRef();
  const dcRef = useRef();
  const rpmRef = useRef();
  const ft = (c) => ('00000' + c.t.toFixed(1)).slice(-5) + '°C';
  const fmA = (c) => ('00000' + c.mA.toFixed(1)).slice(-5) + 'mA';
  const fdc = (dc) => Math.ceil(dc * 100) + '% duty-cycle';
  const frpm = (rpm) => ('00000' + rpm.toFixed(1)).slice(-5) + 'rpm';

  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      ({ metrics, activeCoil, dc }) => {
        const [sample] = metrics.slice(-1);
        tRefs.map((ref, coilIndex) => {
          if (ref.current) {
            ref.current.innerHTML = ft(sample[`c${coilIndex + 1}`]);
            if (activeCoil === coilIndex) {
              ref.current.classList.add('svg-active');
              ref.current.classList.remove('svg-passive');
            } else {
              ref.current.classList.add('svg-passive');
              ref.current.classList.remove('svg-active');
            }
          }
        });

        if (mARef.current) {
          mARef.current.innerHTML = fmA(sample[`c${activeCoil + 1}`]);
          if (sample.rpm > 0) {
            mARef.current.classList.add('svg-active');
            mARef.current.classList.remove('svg-passive');
          } else {
            mARef.current.classList.add('svg-passive');
            mARef.current.classList.remove('svg-active');
          }
        }

        if (dcRef.current) {
          dcRef.current.innerHTML = fdc(dc);
          if (sample.rpm > 0) {
            dcRef.current.classList.add('svg-active');
            dcRef.current.classList.remove('svg-passive');
          } else {
            dcRef.current.classList.add('svg-passive');
            dcRef.current.classList.remove('svg-active');
          }
        }

        if (rpmRef.current) {
          rpmRef.current.innerHTML = frpm(sample.rpm);
          if (sample.rpm > 0) {
            rpmRef.current.classList.add('svg-active');
            rpmRef.current.classList.remove('svg-passive');
          } else {
            rpmRef.current.classList.add('svg-passive');
            rpmRef.current.classList.remove('svg-active');
          }
        }
      },
      (state) => state.api
    );
    return () => unsubscribe();
  }, []);

  return (
    <g id="api" transform={`translate(${x} ${y})`} {...props}>
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
          <path d="m 5,0 h 120 a 5,5 0 0 1 5,5 v 110 a 5,5 0 0 1 -5,5 h -120 a 5,5 0 0 1 -5,-5 v -110 a 5,5 0 0 1 5,-5 z" />
          <text className="processing" x="54" y="19">
            <tspan>API</tspan>
          </text>
          <g transform="translate(90 28)" className="multi-text">
            <text ref={tRefs[5]} x="0" y="0" className="svg-passive">
              {'000.0°C'}
            </text>
            <text ref={tRefs[4]} x="0" y="10" className="svg-passive">
              {'000.0°C'}
            </text>
            <text ref={tRefs[3]} x="0" y="20" className="svg-passive">
              {'000.0°C'}
            </text>
            <text ref={tRefs[2]} x="0" y="30" className="svg-passive">
              {'000.0°C'}
            </text>
            <text ref={tRefs[1]} x="0" y="40" className="svg-passive">
              {'000.0°C'}
            </text>
            <text ref={tRefs[0]} x="0" y="50" className="svg-passive">
              {'000.0°C'}
            </text>

            <text ref={mARef} x="0" y="70" className="svg-passive">
              {'000.0mA'}
            </text>

            <text ref={dcRef} x="-75" y="30" className="svg-passive">
              {'0% duty-cycle'}
            </text>

            <text ref={rpmRef} x="-75" y="40" className="svg-passive">
              {'000.0rpm'}
            </text>
          </g>
        </a>
      </OverlayTrigger>
    </g>
  );
};
