import React, { useRef, useEffect } from 'react';
import Image from '../../../Image';
import Hud from '../../../Hud';
import { Alert } from 'react-bootstrap';
import useStore from '../../../../store';

export default (props) => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;
  const hud = useStore((state) => state.hud.camera);
  const status = useStore((state) => state.api.status);
  return (
    <Hud id="camera" title="Camera" hud={hud}>
      <Alert
        variant="dark"
        className="text-center warning"
        style={{
          display: `${status === 'connected' ? 'inline-block' : 'none'}`,
          position: 'absolute',
          top: '74px',
          fontSize: '20px',
          background: 'rgba(255,255,255,0.4)',
        }}
      >
        Live feed unavailable!
      </Alert>
      <Image className="w-100 h-auto justify-content-center align-self-center" src={`${assets}/images/engine/oblique.png`} cached={false} />
    </Hud>
  );
};
