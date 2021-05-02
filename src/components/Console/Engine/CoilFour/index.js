import React, {useRef, useEffect} from 'react';
import { Canvas, useThree, useFrame, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default ({gltf, ...props}) => {
  const {scene:{children:[{geometry}, ...rest]}} = useLoader(GLTFLoader, gltf);
  return (
    <mesh {...props}>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshStandardMaterial attach="material" color="#bbbbbb" roughness={1} metalness={1} />
    </mesh>
  );
}
