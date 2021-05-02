import React, { useRef } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

export default () => {
  const controls = useRef(); // Ref to controls for update every frame using useFrame
  const {camera, gl:{domElement}} = useThree();

  useFrame(() => controls.current.update());

  return <orbitControls 
    ref={controls} 
    args={[camera, domElement]} 
    enableRotate
    autoRotate={false} 
    enableZoom={false} 
    maxDistance={100}
    minDistance={5}
    maxPolarAngle={Math.PI / 2}
    minPolarAngle={Math.PI / 6}
  />
};

