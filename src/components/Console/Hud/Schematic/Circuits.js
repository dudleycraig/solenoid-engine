import React, { useRef, useEffect } from 'react';
import useStore from '../../../../store';
import Arrow from './Arrow';
import Circuit1 from './Circuit1';
import Circuit2 from './Circuit2';
import Circuit3 from './Circuit3';
import Circuit4 from './Circuit4';
import Circuit5 from './Circuit5';
import Circuit6 from './Circuit6';

const range = (from, to) => Array.from({ length: to - from + 1 }, (v, k) => k + from);

const toggleSVGActive = (ref, condition = false) => {
  if (ref && ref.current) {
    if (condition) {
      ref.current.classList.add('svg-active');
      ref.current.classList.remove('svg-passive');
    } else {
      ref.current.classList.remove('svg-active');
      ref.current.classList.add('svg-passive');
    }
  }
};

const Log = (props) => (console.log(props.children), true);

export default ({ x, y, activeIndex = 0, ...props }) => {
  const thermistorSensorBusToAPIRefs = range(1, 6).map(() => useRef());
  const circuitRefs = range(1, 6).map(() => useRef());

  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      ({ metrics, activeCoil }) => {
        const [sample] = metrics.slice(-1);

        if (sample.rpm > 0) {
          range(1, 6).map(({}, circuitIndex) => {
            toggleSVGActive(circuitRefs[circuitIndex], activeCoil === circuitIndex);
            toggleSVGActive(thermistorSensorBusToAPIRefs[circuitIndex], activeCoil === circuitIndex);
          });
        } else {
          range(1, 6).map(({}, circuitIndex) => {
            toggleSVGActive(circuitRefs[circuitIndex], false);
            toggleSVGActive(thermistorSensorBusToAPIRefs[circuitIndex], false);
          });
        }
      },
      (state) => state.api
    );
    return () => unsubscribe();
  }, []);

  return (
    <g transform={`translate(${x} ${y})`} {...props}>
      <Circuit1 ref={circuitRefs[0]} id="circuit1" className="circuit svg-passive" />
      <Circuit2 ref={circuitRefs[1]} id="circuit2" className="circuit svg-passive" />
      <Circuit3 ref={circuitRefs[2]} id="circuit3" className="circuit svg-passive" />
      <Circuit4 ref={circuitRefs[3]} id="circuit4" className="circuit svg-passive" />
      <Circuit5 ref={circuitRefs[4]} id="circuit5" className="circuit svg-passive" />
      <Circuit6 ref={circuitRefs[5]} id="circuit5" className="circuit svg-passive" />

      <g className="supply-24v" transform="translate(140 175)">
        <text className="annotation" x="3" y="20">
          <tspan>24V</tspan>
        </text>
      </g>

      <g className="supply-5v" transform="translate(80 175)">
        <text className="annotation" x="3" y="20">
          <tspan>5V</tspan>
        </text>
      </g>

      <g className="supply-common" transform="translate(70 190)">
        <path d="m -5,0 h 10" />
        <path d="m -3,3 h 6" />
        <path d="m -1,6 h 2" />
      </g>

      <g className="current-sensors-to-api">
        <path d={`m 210,190 v 110 h -204`} className="svg-active" />
        <Arrow x="4" y="300" r="180" />
      </g>

      <g ref={thermistorSensorBusToAPIRefs[5]} className="thermistor-sensor-bus-to-api svg-passive">
        <path d={'m 120,190 v 40 h -116'} />
        <Arrow x="4" y="230" r="180" />
      </g>

      <g ref={thermistorSensorBusToAPIRefs[4]} className="thermistor-sensor-bus-to-api svg-passive">
        <path d={'m 122,190 v 50 h -118'} />
        <Arrow x="4" y="240" r="180" />
      </g>

      <g ref={thermistorSensorBusToAPIRefs[3]} className="thermistor-sensor-bus-to-api svg-passive">
        <path d={'m 124,190 v 60 h -120'} />
        <Arrow x="4" y="250" r="180" />
      </g>

      <g ref={thermistorSensorBusToAPIRefs[2]} className="thermistor-sensor-bus-to-api svg-passive">
        <path d={`m 126,190 v 70 h -122`} />
        <Arrow x="4" y="260" r="180" />
      </g>

      <g ref={thermistorSensorBusToAPIRefs[1]} className="thermistor-sensor-bus-to-api svg-passive">
        <path d={`m 128,190 v 80 h -124`} />
        <Arrow x="4" y="270" r="180" />
      </g>

      <g ref={thermistorSensorBusToAPIRefs[0]} className="thermistor-sensor-bus-to-api svg-passive">
        <path d={`m 130,190 v 90 h -126`} />
        <Arrow x="4" y="280" r="180" />
      </g>
    </g>
  );
};

{
  /**
      {range(1, 6).reduce((accumulator, {}, circuitIndex) => {
        const hIncrement = circuitIndex * 30;
        const vIncrement = circuitIndex * 2;
        return [
          ...accumulator,
          <g ref={circuitRefs[circuitIndex]} key={`circuit${circuitIndex}`} id={`circuit${circuitIndex}`} className="circuit svg-passive">
            <g className="mosfet-pwm">
              <circle cx="0" cy={10 + hIncrement} r="1" className="dot" />
              <path d={`m 0,${10 + hIncrement} h 5`} />
              <Pulse x="5" y={10 + hIncrement} major={false} id={`pulse-minor.circuit${circuitIndex}`} />
            </g>
            <Mosfet x="15" y={5 + hIncrement} />
            <g className="coil-pwm">
              <Pulse x="55" y={0 + hIncrement} major={true} id={`pulse-major.circuit${circuitIndex}`} />
              <Coil x="65" y={0 + hIncrement} />
              <circle cx="150" cy={hIncrement} r="1" className="dot" />
            </g>
            <g ref={supply24vBusVerticalRefs[circuitIndex]} className="supply-24v-bus-vertical">
              <circle cx="150" cy={10 + hIncrement} r="1" className={'dot'} />
              {(circuitIndex !== 5 && [
                <Bridge key={`supply-24v-bus-vertical.bridge.circuit${circuitIndex}`} x="140" y={25 + hIncrement} r="90" />,
                <path key={`supply-24v-bus-vertical.wire1.circuit${circuitIndex}`} d={`m 140,${10 + hIncrement} v 15`} />,
                <path key={`supply-24v-bus-vertical.wire2.circuit${circuitIndex}`} d={`m 140,${35 + hIncrement} v 5`} />,
              ]) || (
                <g transform="translate(140 160)">
                  <path d={`m 0,0 v 15`} />
                  <text className="annotation" x="3" y="20">
                    <tspan>24V</tspan>
                  </text>
                </g>
              )}
            </g>
            <g className="supply-24v-bus-horizontal">
              {circuitIndex !== 0 && <circle cx="140" cy={10 + hIncrement} r="1" className={'dot'} />}
              <circle cx="150" cy={0 + hIncrement} r="1" />
              <path d={`m 140,${10 + hIncrement} h 10`} />
            </g>
            <CurrentSensor x="150" y={0 + hIncrement} />
            <g className="current-sensor-bus-horizontal">
              <path d={`m 200,${10 + hIncrement} h 10`} />
            </g>
            <g ref={currentSensorBusVerticalRefs[circuitIndex]} className="current-sensor-bus-vertical">
              <circle cx="200" cy={10 + hIncrement} r="1" className="dot" />
              <path d={`m 210,${10 + hIncrement} v 30`} />
              {circuitIndex !== 0 && <circle cx="210" cy={10 + hIncrement} r="1" className="dot" />}
            </g>
            <g className="supply-5v-bus-horizontal">
              <path d={`m 80,${10 + hIncrement} h 17`} />
            </g>
            <Thermistor x="97.5" y={10 + hIncrement} id={`thermistor.circuit${circuitIndex}`} />
            {range(1, circuitIndex).map(({}, columnIndex) => (
              <g
                ref={thermistorBusHorizontalRefs[circuitIndex][columnIndex]}
                key={`thermistor-bus-horizontal.circuit${circuitIndex}.column${columnIndex}`}
                className="thermistor-bus-horizontal"
              >
                <path d={`m ${130 - columnIndex * 2},${10 + hIncrement} v 15`} />
                {(circuitIndex !== 5 && [
                  <Bridge key={`thermistor-bus-horizontal.bridge.circuit${circuitIndex}`} x={130 - columnIndex * 2} y={25 + hIncrement} r="90" />,
                  <path key={`thermistor-bus-horizontal.wire.circuit${circuitIndex}`} d={`m ${130 - columnIndex * 2},${35 + hIncrement} v 5`} />,
                ]) || <path d={`m ${130 - columnIndex * 2},${25 + hIncrement} v 15`} />}
              </g>
            ))}
            <g className="thermistor-bus-vertical">
              <path d={`m 112,${10 + hIncrement} h ${18 - vIncrement}`} />
              <path d={`m ${130 - vIncrement},${10 + hIncrement} v 15`} />
              {(circuitIndex !== 5 && [
                <Bridge key={`thermistor-bus-vertical.bridge.circuit${circuitIndex}`} x={130 - vIncrement} y={25 + hIncrement} r="90" />,
                <path key={`thermistor-bus-vertical.wire.circuit${circuitIndex}`} d={`m ${130 - vIncrement},${35 + hIncrement} v 5`} />,
              ]) || <path d={`m ${130 - vIncrement},${25 + hIncrement} v 15`} />}
            </g>
            <g ref={supply5vBusVerticalRefs[circuitIndex]} className="supply-5v-bus-vertical">
              {circuitIndex !== 0 && <circle cx="80" cy={10 + hIncrement} r="1" />}
              <path d={`m 80,${10 + hIncrement} v 15`} />
              {(circuitIndex !== 5 && [
                <Bridge key={`supply-5v-bus-vertical.bridge.circuit${circuitIndex}`} x="80" y={25 + hIncrement} r="90" />,
                <path key={`supply-5v-bus-vertical.wire.circuit${circuitIndex}`} d={`m 80,${35 + hIncrement} v 5`} />,
              ]) || (
                <g transform="translate(80 160)">
                  <text className="annotation" x="3" y="20">
                    <tspan>5V</tspan>
                  </text>
                </g>
              )}
            </g>
            <g ref={supplyCommonBusRefs[circuitIndex]} className="supply-common-bus">
              {circuitIndex !== 0 && <circle cx="70" cy={10 + hIncrement} r="1" />}
              <path d={`m 70,${10 + hIncrement} v 15`} />
              {(circuitIndex !== 5 && [
                <Bridge key={`supply-common-bus.bridge.circuit${circuitIndex}`} x="70" y={25 + hIncrement} r="90" />,
                <path key={`supply-common-bus.wire.circuit${circuitIndex}`} d={`m 70,${35 + hIncrement} v 5`} />,
              ]) || (
                <g transform="translate(70 175)">
                  <path d="m -5,0 h 10" />
                  <path d="m -3,3 h 6" />
                  <path d="m -1,6 h 2" />
                </g>
              )}
            </g>
          </g>,
        ];
      }, [])}
       **/
}
