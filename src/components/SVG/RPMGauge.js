import React, { useEffect, useRef } from 'react';
import useStore from '../../store';

const range = (from, to) => Array.from({ length: to - from + 1 }, (v, k) => k + from);

export default (props) => {
  const viewport = { w: 100, h: 25 };
  const padding = 2;
  const tangent = 3;
  const outerRadius = 100;
  const center = {
    x: viewport.w / 2,
    y: Math.sqrt(Math.pow(outerRadius, 2) - Math.pow(viewport.w / 2 - padding, 2)) + (viewport.h - (padding + tangent)), // y = adj + padding = sqrt(sqr(hyp) - sqr(adj)) + padding
  };
  const first = Math.asin((center.y - (viewport.h - (padding + tangent))) / outerRadius); // initial angle, sin(radians) = opp / hyp
  const arcAngle = Math.PI - first * 2; // visible angle, 180 degrees - start angle on each side
  const majorIncrement = arcAngle / 9;
  const minorIncrement = arcAngle / 90;

  const MajorScale = () => {
    const majorRadius = 95;
    return range(1, 10).map((key) => {
      const r = Math.asin((center.y - (viewport.h - (padding + tangent))) / outerRadius) + majorIncrement * (key - 1);
      const outer = { x: center.x - Math.cos(r) * outerRadius, y: center.y - Math.sin(r) * outerRadius };
      const major = { x: center.x - Math.cos(r) * majorRadius, y: center.y - Math.sin(r) * majorRadius };
      return <path key={`rpm-major-gradation-${key}`} style={{ strokeWidth: 0.8 }} d={`M ${outer.x} ${outer.y} L ${major.x} ${major.y}`} />;
    });
  };

  const MinorScale = () => {
    const minorRadius = 98;
    return range(1, 90).map((key) => {
      const r = Math.asin((center.y - (viewport.h - (padding + tangent))) / outerRadius) + minorIncrement * (key - 1);
      const outer = { x: center.x - Math.cos(r) * outerRadius, y: center.y - Math.sin(r) * outerRadius };
      const minor = { x: center.x - Math.cos(r) * minorRadius, y: center.y - Math.sin(r) * minorRadius };
      return <path key={`rpm-minor-gradation-${key}`} style={{ strokeWidth: 0.1 }} d={`M ${outer.x} ${outer.y} L ${minor.x} ${minor.y}`} />;
    });
  };

  // the greater the rpm, the greater the needle will oscillate
  const oscillate = (rpm, maxRpm) => {
    const ratioOfMaxRpm = rpm / maxRpm;
    const max = rpm * (1 + 0.02 * ratioOfMaxRpm); // + 1%
    const min = rpm * (1 - 0.02 * ratioOfMaxRpm); // - 1%
    return Math.random() * (max - min + 1) + min;
  };

  const needleRef = useRef();
  const rpmRef = useRef();
  const needleOuterRadius = 102;
  const needleInnerRadius = 92;
  const maxDutyCycle = 1;
  const speedFactor = maxDutyCycle * 2;
  const radiansPerMillisecond = (2 * Math.PI * speedFactor) / 1000;
  const maxRpm = ((radiansPerMillisecond * 1000 * 60) / (2 * Math.PI)) * (1 + 0.1); // add 10 percent to max speed
  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      ({ metrics, status }) => {
        if (status === 'connected') {
          const [sample] = metrics.slice(-1);
          const rpm = sample.rpm > 0 ? oscillate(sample.rpm, maxRpm) : 0;
          const r = first + (arcAngle * rpm) / maxRpm;
          const inner = { x: center.x - Math.cos(r) * needleInnerRadius, y: center.y - Math.sin(r) * needleInnerRadius };
          const outer = { x: center.x - Math.cos(r) * needleOuterRadius, y: center.y - Math.sin(r) * needleOuterRadius };
          if (needleRef.current) needleRef.current.setAttribute('d', `M ${inner.x} ${inner.y} L ${outer.x} ${outer.y}`);
          if (rpmRef.current) rpmRef.current.innerHTML = ('000' + rpm.toFixed()).slice(-3) + ' rpm';
        } else {
          // TODO: don't use frame cycles for this
          const r = first;
          const outer = { x: center.x - Math.cos(r) * needleOuterRadius, y: center.y - Math.sin(r) * needleOuterRadius };
          const inner = { x: center.x - Math.cos(r) * needleInnerRadius, y: center.y - Math.sin(r) * needleInnerRadius };
          if (needleRef.current) needleRef.current.setAttribute('d', `M ${inner.x} ${inner.y} L ${outer.x} ${outer.y}`);
          if (rpmRef.current) rpmRef.current.innerHTML = '000 rpm';
        }
      },
      (state) => state.api
    );
    return () => unsubscribe();
  }, []);

  const r = first;
  const outer = { x: center.x - Math.cos(r) * needleOuterRadius, y: center.y - Math.sin(r) * needleOuterRadius };
  const inner = { x: center.x - Math.cos(r) * needleInnerRadius, y: center.y - Math.sin(r) * needleInnerRadius };
  return (
    <svg className={'rpm-gauge'} style={{ marginBottom: '10px' }} viewBox="0 0 100 30" {...props}>
      <MajorScale />
      <MinorScale />
      <path
        className="rpm-needle"
        ref={needleRef}
        key="rpm-needle"
        style={{ strokeWidth: 1.5 }}
        d={`M ${inner.x} ${inner.y} L ${outer.x} ${outer.y}`}
      />
      <text className="rpm" x="35.5" y="28" space="preserve">
        <tspan ref={rpmRef} style={{ strokeWidth: 0.2, fontSize: '7px' }}>
          {'000 rpm'}
        </tspan>
      </text>
    </svg>
  );
};
