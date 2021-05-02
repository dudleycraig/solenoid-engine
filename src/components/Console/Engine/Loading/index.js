import React from 'react';
import { useThree, useFrame, extend } from 'react-three-fiber';
import * as THREE from 'three';

export default (props) => {
  return (
    <mesh visible {...props}>
      <sphereGeometry attach="geometry" args={[1,16,16]} />
      <meshStandardMaterial attach="material" color="white" roughness={1} metalness={1} />
    </mesh>
  );
}
