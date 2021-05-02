import React, { useEffect, useRef, useState } from 'react';
import { Overlay, ToggleButtonGroup, ToggleButton, Alert } from 'react-bootstrap';
import useStore from '../../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faProjectDiagram, faComment, faVideo, faLayerGroup, faChartLine } from '@fortawesome/free-solid-svg-icons';
import ConnectionToggle from '../../SVG/ConnectionToggle';
import Schematic from './Schematic';
import Layers from './Layers';
import Camera from './Camera';
import Log from './Log';
import RPMGauge from '../../SVG/RPMGauge';
import Dutycycle from './Dutycycle';

export default ({ ...props }) => {
  const hud = useStore((state) => state.hud);
  const status = useStore((state) => state.api.status);

  const schematicRef = useRef();
  const layersRef = useRef();
  const cameraRef = useRef();
  const logRef = useRef();
  const rpmRef = useRef();

  const icons = { faPlay, faProjectDiagram, faComment, faVideo, faLayerGroup, faChartLine };

  const [hudState, setHudState] = useState(
    Object.keys(hud).reduce((accumulator, name, index) => (hud[name].visible ? [...accumulator, index] : accumulator), [])
  );

  useEffect(
    () => setHudState(Object.keys(hud).reduce((accumulator, name, index) => (hud[name].visible ? [...accumulator, index] : accumulator), [])),
    [hud]
  );

  useEffect(() => {
    const resize = () => (rpmRef.current, (rpmRef.current.style.left = `calc(${window.innerWidth / 2 - 60}px)`), true);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [window.innerWidth]);

  return [
    <div key={`toolbar-hud`} id="toolbar-hud" className="container-fluid fixed-bottom variant-dark bg-dark py-1" {...props}>
      <Alert
        variant="dark"
        className="text-center warning"
        style={{
          display: `${status === 'connected' ? 'inline-block' : 'none'}`,
          position: 'absolute',
          bottom: '80px',
          right: '20px',
          zIndex: '30',
          fontSize: '20px',
          background: 'rgba(255,255,255,0.4)',
        }}
      >
        Mimicking API!
      </Alert>
      <div
        //  d-flex flex-row h-100 flex-xl-nowrap flex-wrap justify-content-between align-items-center
        className="d-flex flex-row h-100 flex-wrap justify-content-between align-items-center"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        <div className="m-auto" style={{ dislay: 'inline-block' }}>
          <Dutycycle />
        </div>

        <div className="align-self-start mr-auto">
          <ConnectionToggle />
        </div>

        <div className="align-self-end">
          <ToggleButtonGroup
            size="md"
            type="checkbox"
            value={hudState}
            onChange={(values) =>
              Object.keys(hud).map((name, index) =>
                values.includes(index)
                  ? !hud[name].visible && hud[name].setVisible(!hud[name].visible)
                  : hud[name].visible && hud[name].setVisible(!hud[name].visible)
              )
            }
          >
            {Object.keys(hud).map((name, index) => (
              <ToggleButton key={`hud-button-${index}`} title={name} className="variant-primary" name={name} value={index}>
                <FontAwesomeIcon icon={icons[hud[name].icon]} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <div
          ref={rpmRef}
          className="text-center"
          style={{
            position: 'absolute',
            top: '-60px',
            left: `${window.innerWidth / 2 - 60}px`,
            margin: '0px auto',
            width: '150px',
          }}
        >
          <RPMGauge width="100%" />
        </div>
      </div>
    </div>,
    <Overlay key={`schematic-hud`} target={schematicRef.current} show={hud.schematic.visible}>
      <>
        <Schematic />
      </>
    </Overlay>,
    <Overlay key={`layers-hud`} target={layersRef.current} show={hud.layers.visible}>
      <>
        <Layers />
      </>
    </Overlay>,
    <Overlay key={`camera-hud`} target={cameraRef.current} show={hud.camera.visible}>
      <>
        <Camera />
      </>
    </Overlay>,
    <Overlay key={`log-hud`} target={logRef.current} show={hud.log.visible}>
      <>
        <Log />
      </>
    </Overlay>,
  ];
};
