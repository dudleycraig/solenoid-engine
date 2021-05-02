import React, { useRef } from 'react';
import { useThree, useFrame, extend } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
extend({ OrbitControls });

export default (props) => {
  const {
    gl: { domElement },
    camera,
  } = useThree();
  const controls = useRef();

  useFrame(() => controls.current.update());

  return <orbitControls ref={controls} args={[camera, domElement]} autoRotate={false} enableZoom={true} {...props} />;
};
