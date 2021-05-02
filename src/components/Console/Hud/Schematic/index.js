import React, { useRef, useEffect } from 'react';
import useStore from '../../../../store';
import Hud from '../../../Hud';
import Circuit from './Circuits';
import OpticalEncoder from './OpticalEncoder';
import ReflectiveEncoder from './ReflectiveEncoder';
import SignalProcessing from './SignalProcessing';
import PWMTiming from './PWMTiming';
import Arrow from './Arrow';
import API from './API';

const Log = (props) => (console.log(props.children), true);

export default ({ ...props }) => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;
  const hud = useStore((state) => state.hud.schematic);

  const encoder360Ref = useRef();
  const encoder60Ref = useRef();
  const encoder3Ref = useRef();
  const encoderTimingSPIRef = useRef();
  const timingApiSPIRef = useRef();

  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      ({ metrics, activeCoil }) => {
        const [sample] = metrics.slice(-1);
        if (encoder360Ref.current) encoder360Ref.current.innerHTML = `${['360', '  0', '  0', '  0', '  0', '  0'][activeCoil]}°`;
        if (encoder60Ref.current) encoder60Ref.current.innerHTML = `${['360', ' 60', '120', '180', '240', '300'][activeCoil]}°`;

        const spiComms = `${('00000' + (sample.r * (180 / Math.PI)).toFixed(1)).slice(-5)}°`;
        if (encoder3Ref.current) encoder3Ref.current.innerHTML = spiComms;
        if (encoderTimingSPIRef.current) encoderTimingSPIRef.current.innerHTML = spiComms;
        if (timingApiSPIRef.current) timingApiSPIRef.current.innerHTML = spiComms;
      },
      (state) => state.api
    );
    return () => unsubscribe();
  }, []);

  return (
    <Hud id="schematic" title="Schematic" hud={hud}>
      <svg className={'schematic'} width="100%" height="100%" viewBox="0 0 350 470" {...props}>
        <text className="annotation" x="10" y="66" space="preserve">
          <tspan ref={encoder360Ref}>{'000.0°'}</tspan>
        </text>
        <text className="annotation" x="55" y="66" space="preserve">
          <tspan ref={encoder60Ref}>{'000.0°'}</tspan>
        </text>
        <text className="annotation" x="100" y="66" space="preserve">
          <tspan ref={encoder3Ref}>{'000.0°'}</tspan>
        </text>

        <text className="annotation" x="55" y="131" space="preserve">
          <tspan ref={encoderTimingSPIRef}>{'000.0°'}</tspan>
        </text>
        <text className="annotation" x="55" y="336" space="preserve">
          <tspan ref={timingApiSPIRef}>{'000.0°'}</tspan>
        </text>

        <Circuit x="130" y="145" />

        <API
          title="Micro Controller and Wifi Connection"
          paragraph="Process client requests and push engine metrics."
          img={`${assets}/images/NodeMcu-Lua-ESP8266.webp`}
          link={`${http}/about#electronics-api`}
          x="0"
          y="350"
        />

        <PWMTiming
          title="Micro Controller"
          paragraph="Process rotational angle, duty-cycle, and outputs timed PWM signal for solenoids."
          img={`${assets}/images/ATmega328P-Nano-V3.webp`}
          link={`${http}/about#electronics-pwm-processing`}
          x="0"
          y="145"
        />

        <OpticalEncoder
          title="Opto Endstop as 360° Encoder"
          paragraph="Determines when the axle has travelled 360°."
          img={`${assets}/images/Optical-Endstop-Switch.webp`}
          link={`${http}/about#electronics-encoder-optical-360`}
          x="0"
          y="22"
        />
        <OpticalEncoder
          title="Opto Endstop as 60° Encoder"
          paragraph="Determines when the axle has travelled 60°."
          img={`${assets}/images/Optical-Endstop-Switch.webp`}
          link={`${http}/about#electronics-encoder-optical-60`}
          x="45"
          y="22"
        />
        <ReflectiveEncoder
          title="Quadrature Reflective Encoder"
          paragraph="Outputs two out-of-phase signals indicative of direction and angle."
          img={`${assets}/images/CJMU-83 AEDR-8300 Reflective-Optical-Encoder.webp`}
          link={`${http}/about#electronics-encoder-reflective`}
          x="90"
          y="22"
        />

        <circle className="dot" cx="20" cy="45" r="1" />
        <path d="m 20,45 v 10" />
        <path d="m 20,70 v 8" />
        <Arrow x="20" y="78" r="90" />

        <circle className="dot" cx="65" cy="45" r="1" />
        <path d="m 65,45 v 10" />
        <path d="m 65,70 v 8" />
        <Arrow x="65" y="78" r="90" />

        <circle className="dot" cx="110" cy="45" r="1" />
        <path d="m 110,45 v 10" />
        <path d="m 110,70 v 8" />
        <Arrow x="110" y="78" r="90" />

        <SignalProcessing
          title="Micro Controller"
          paragraph="Process encoder signals and output current rotational angle."
          img={`${assets}/images/ATmega328P-Nano-V3.webp`}
          link={`${http}/about#electronics-encoder-signal-processing`}
          x="0"
          y="80"
        />

        <circle className="dot" cx="65" cy="110" r="1" />
        <path d="m 65,110 v 10" />
        <path d="m 65,135 v 8" />
        <Arrow x="65" y="143" r="90" />

        <circle className="dot" cx="65" cy="315" r="1" />
        <path d="m 65,315 v 10" />
        <path d="m 65,340 v 8" />
        <Arrow x="65" y="348" r="90" />
      </svg>
    </Hud>
  );
};
