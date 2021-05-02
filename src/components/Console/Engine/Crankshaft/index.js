import React, { forwardRef } from 'react';
import * as THREE from 'three';
import { useLoader, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import crankshaft from '../../../../assets/models/crankshaft.gltf';

export default forwardRef(({ models, ...props }, ref) => {
  const {
    scene: { children },
  } = useLoader(GLTFLoader, crankshaft);

  return (
    <group ref={ref} rotation={[0, 0, 0]} {...props}>
      {children.map((child) => {
        const { geometry, name } = child;
        const { position, visible } = models[name];
        return (
          <mesh key={`model-${name}`} position={new THREE.Vector3(...position)} visible={visible}>
            <bufferGeometry attach="geometry" {...geometry} />
            <meshPhongMaterial
              attach="material"
              depthTest={true}
              depthWrite={true}
              side={THREE.FrontSide}
              color={0x990000}
              reflectivity={0}
              flatShading={false}
              roughness={0.8}
              metalness={0.2}
              emissive={0x101010}
              specular={0x101010}
              shininess={100}
            />
          </mesh>
        );
      })}
    </group>
    /**
      {() =>
        Object.keys(models).map((name) => {
          if (!models[name].annotation) return null;
          const {
            annotation: {
              text,
              position: [annotationX, annotationY, annotationZ],
              ...annotationProps
            },
          } = models[name];
          return (
            <Annotation
              key={`annotation-${name}`}
              annotationPosition={[annotationX, annotationY, annotationZ]}
              subjectRelativePosition={[13, annotationY, annotationZ]}
              {...annotationProps}
            >
              {text}
            </Annotation>
          );
        })
      }
       **/
  );
});
