import React, {useRef, useEffect} from 'react';
import { Canvas, useThree, useFrame, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/** 
 * Move conrod and plunger in relation to crankshaft
 *
 * Material Properties
 * base:      transparent={false}, opacity={1}, alphaTest={1}, depthTest={true}, depthWrite={true}, visible={true}, side={THREE.FrontSide, THREE.BothSides, THREE.BackSide}
 * basic:     color={0x333333}, wireframe={true}, wireframeLinewidth={1}, vertexColors={false}, fog={true}, reflectivity={0}, refractionRatio={0.98}
 * standard:  flatShading={false}, roughness={0.8}, metalness={0.2} 
 * lambert:
 * phong:     emissive={0x101010}, specular={0x101010}, shininess={100} 
 */
export default ({conrodGltf, plungerGltf, zPosition, crankRotation, rodLength, crankRadius, zRotation, ...props}) => {
  const {scene:{children:[{geometry:conrodGeometry, name:conrodName}]}} = useLoader(GLTFLoader, conrodGltf);
  const {scene:{children:[{geometry:plungerGeometry, name:plungerName}]}} = useLoader(GLTFLoader, plungerGltf);

  const displacement = crankRadius * Math.cos(crankRotation) + Math.sqrt(Math.pow(rodLength, 2) - Math.pow(crankRadius, 2) * Math.pow(Math.sin(crankRotation), 2));
  const rotation = Math.asin(crankRadius / (rodLength / Math.sin(crankRotation))) * -1;

  return (
    <group rotation={[0,0,(zRotation >= 180 ? Math.PI : 0)]} position={[0,0,zPosition]}>
      <mesh key={conrodName} position={[displacement, 0, 0]} rotation={[0, 0, rotation]} >
        <bufferGeometry attach="geometry" {...conrodGeometry} />
        <meshPhongMaterial attach="material" depthTest={true} depthWrite={true} side={THREE.FrontSide} color={0xff3300} reflectivity={0} flatShading={false} roughness={0.8} metalness={0.2} emissive={0x101010} specular={0x101010} shininess={100} /> 
      </mesh>
      <mesh key={plungerName} position={[displacement, 0, 0]} rotation={[0,0,0]} >
        <bufferGeometry attach="geometry" {...plungerGeometry} />
        <meshPhongMaterial attach="material" depthTest={true} depthWrite={true} side={THREE.FrontSide} color={0xff3300} reflectivity={0} flatShading={false} roughness={0.8} metalness={0.2} emissive={0x101010} specular={0x101010} shininess={100} /> 
      </mesh>
    </group>
  );
}
