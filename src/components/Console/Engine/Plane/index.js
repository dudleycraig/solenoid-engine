import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';

export default (props) => {
  return (
    <mesh 
      rotation={new THREE.Euler(-0.5 * Math.PI,0,0,'XYZ')} // Euler(x-rad, y-rad, z-rad, order)
      position={new THREE.Vector3(15,0,0)}
    >
      <planeGeometry 
        attach="geometry" 
        args={[60,20]} // width, height
      />
      <meshLambertMaterial 
        attach="material" 
        color={0xFFFFFF} 
      />
      <arrowHelper />
    </mesh>
  );
}
