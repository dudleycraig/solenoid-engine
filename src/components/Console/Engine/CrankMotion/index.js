import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import useStore from '../../../../store';
import Conrod from '../Pistons/Conrod';
import Plunger from '../Pistons/Plunger';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * animates the crankshaft, pushrods and conrods
 *
 * calculations as per https://en.wikipedia.org/wiki/Piston_motion_equations using below scriptified equation
 * Math.pow(rodLength, 2) = Math.pow(crankRadius, 2) + Math.pow(displacement, 2) - (2 * crankRadius * displacement * Math.cos(r))
 */
export default ({ models, moment, displacement, ...props }) => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;
  const rodLength = 41.6;
  const crankRadius = 5.5;
  const {
    scene: { children: crankshaftChildren },
  } = useLoader(GLTFLoader, `${assets}/models/crankshaft.gltf`);

  const crankshaftModels = useStore((state) => state.crankshaft.models);
  const crankshaftRef = useRef();

  const pistonsModels = useStore((state) => state.pistons.models);
  const pistonsRef = useRef();

  const conrod1Ref = useRef();
  const plunger1Ref = useRef();
  const conrod2Ref = useRef();
  const plunger2Ref = useRef();
  const conrod3Ref = useRef();
  const plunger3Ref = useRef();
  const conrod4Ref = useRef();
  const plunger4Ref = useRef();
  const conrod5Ref = useRef();
  const plunger5Ref = useRef();
  const conrod6Ref = useRef();
  const plunger6Ref = useRef();

  const unsubscribe = useStore.subscribe(
    (metrics) => {
      const [sample] = metrics.slice(-1);
      if (crankshaftRef.current) crankshaftRef.current.rotation.z = sample.r;

      const sqrRodLength = Math.pow(rodLength, 2);
      const sqrCrankRadius = Math.pow(crankRadius, 2);
      const calcMotion = (offsetRotation) => {
        const radians = sample.r + offsetRotation;
        const cosR = Math.cos(radians);
        const sinR = Math.sin(radians);
        const displacement = crankRadius * cosR + Math.sqrt(sqrRodLength - sqrCrankRadius * Math.pow(sinR, 2));
        const moment = Math.asin(crankRadius / (rodLength / sinR)) * -1;
        return [displacement, moment];
      };

      // TODO: calculate motion once and append static values for each piston offset
      if (conrod1Ref.current && plunger1Ref.current) {
        const [displacement, moment] = calcMotion(pistonsModels['piston1'].offsetRotation);
        conrod1Ref.current.position.x = displacement;
        conrod1Ref.current.rotation.z = moment;
        plunger1Ref.current.position.x = displacement;
      }

      if (conrod2Ref.current && plunger2Ref.current) {
        const [displacement, moment] = calcMotion(pistonsModels['piston2'].offsetRotation);
        conrod2Ref.current.position.x = displacement;
        conrod2Ref.current.rotation.z = moment;
        plunger2Ref.current.position.x = displacement;
      }

      if (conrod3Ref.current && plunger3Ref.current) {
        const [displacement, moment] = calcMotion(pistonsModels['piston3'].offsetRotation);
        conrod3Ref.current.position.x = displacement;
        conrod3Ref.current.rotation.z = moment;
        plunger3Ref.current.position.x = displacement;
      }

      if (conrod4Ref.current && plunger4Ref.current) {
        const [displacement, moment] = calcMotion(pistonsModels['piston4'].offsetRotation);
        conrod4Ref.current.position.x = displacement;
        conrod4Ref.current.rotation.z = moment;
        plunger4Ref.current.position.x = displacement;
      }

      if (conrod5Ref.current && plunger5Ref.current) {
        const [displacement, moment] = calcMotion(pistonsModels['piston5'].offsetRotation);
        conrod5Ref.current.position.x = displacement;
        conrod5Ref.current.rotation.z = moment;
        plunger5Ref.current.position.x = displacement;
      }

      if (conrod6Ref.current && plunger6Ref.current) {
        const [displacement, moment] = calcMotion(pistonsModels['piston6'].offsetRotation);
        conrod6Ref.current.position.x = displacement;
        conrod6Ref.current.rotation.z = moment;
        plunger6Ref.current.position.x = displacement;
      }
    },
    (state) => state.api.metrics
  );

  return (
    <>
      <group ref={crankshaftRef} rotation={[0, 0, Math.PI / 2]} {...props}>
        {crankshaftChildren.map((child) => {
          const { geometry, name } = child;
          const { position, visible } = crankshaftModels[name];
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
      <group ref={pistonsRef}>
        <group key={'piston1'} rotation={[0, 0, pistonsModels['piston1'].offsetAngle]} position={pistonsModels['piston1'].position}>
          <Conrod
            ref={conrod1Ref}
            visible={pistonsModels['piston1'].visible}
            position={[39.704024257520075, 0, 0]}
            rotation={[0, 0, -0.12712182709520753]}
          />
          <Plunger ref={plunger1Ref} visible={pistonsModels['piston1'].visible} position={[39.704024257520075, 0, 0]} rotation={[0, 0, 0]} />
        </group>
        <group key={'piston2'} rotation={[0, 0, pistonsModels['piston2'].offsetAngle]} position={pistonsModels['piston2'].position}>
          <Conrod
            ref={conrod2Ref}
            visible={pistonsModels['piston2'].visible}
            position={[42.82462626387182, 0, 0]}
            rotation={[0, 0, 0.12712182709520795]}
          />
          <Plunger ref={plunger2Ref} visible={pistonsModels['piston2'].visible} position={[42.82462626387182, 0, 0]} rotation={[0, 0, 0]} />
        </group>
        <group key={'piston3'} rotation={[0, 0, pistonsModels['piston3'].offsetAngle]} position={pistonsModels['piston3'].position}>
          <Conrod
            ref={conrod3Ref}
            visible={pistonsModels['piston3'].visible}
            position={[46.92772545174594, 0, 0]}
            rotation={[0, 0, 0.030912565659944102]}
          />
          <Plunger ref={plunger3Ref} visible={pistonsModels['piston3'].visible} position={[46.92772545174594, 0, 0]} rotation={[0, 0, 0]} />
        </group>
        <group key={'piston4'} rotation={[0, 0, pistonsModels['piston4'].offsetAngle]} position={pistonsModels['piston4'].position}>
          <Conrod
            ref={conrod4Ref}
            visible={pistonsModels['piston4'].visible}
            position={[36.232525306353686, 0, 0]}
            rotation={[0, 0, -0.03091256565995003]}
          />
          <Plunger ref={plunger4Ref} visible={pistonsModels['piston4'].visible} position={[36.232525306353686, 0, 0]} rotation={[0, 0, 0]} />
        </group>
        <group key={'piston5'} rotation={[0, 0, pistonsModels['piston5'].offsetAngle]} position={pistonsModels['piston5'].position}>
          <Conrod
            ref={conrod5Ref}
            visible={pistonsModels['piston5'].visible}
            position={[37.621077308236885, 0, 0]}
            rotation={[0, 0, 0.09601955856744303]}
          />
          <Plunger ref={plunger5Ref} visible={pistonsModels['piston5'].visible} position={[37.621077308236885, 0, 0]} rotation={[0, 0, 0]} />
        </group>
        <group key={'piston6'} rotation={[0, 0, pistonsModels['piston6'].offsetAngle]} position={pistonsModels['piston6'].position}>
          <Conrod
            ref={conrod6Ref}
            visible={pistonsModels['piston6'].visible}
            position={[45.195675447277274, 0, 0]}
            rotation={[0, 0, -0.09601955856744204]}
          />
          <Plunger ref={plunger6Ref} visible={pistonsModels['piston6'].visible} position={[45.195675447277274, 0, 0]} rotation={[0, 0, 0]} />
        </group>
      </group>
    </>
  );
};

/**
   * get initial values and bypass calculating them
   *
   * get distance plunger and crank have travelled relative to crank position
  const getDisplacement = (r, offsetRotation) => crankRadius * Math.cos(r + offsetRotation) + Math.sqrt(Math.pow(rodLength, 2) - Math.pow(crankRadius, 2) * Math.pow(Math.sin(r + offsetRotation), 2));
   *
   * get angle crank has moved relative to crank rotation
  const getMoment = (r, offsetRotation) => Math.asin(crankRadius / (rodLength / Math.sin(r + offsetRotation))) * -1;
   *
  console.log({
    1: { displacement: getDisplacement(r, pistonsModels['piston1'].offsetRotation), moment: getMoment(r, pistonsModels['piston1'].offsetRotation) },
    2: { displacement: getDisplacement(r, pistonsModels['piston2'].offsetRotation), moment: getMoment(r, pistonsModels['piston2'].offsetRotation) },
    3: { displacement: getDisplacement(r, pistonsModels['piston3'].offsetRotation), moment: getMoment(r, pistonsModels['piston3'].offsetRotation) },
    4: { displacement: getDisplacement(r, pistonsModels['piston4'].offsetRotation), moment: getMoment(r, pistonsModels['piston4'].offsetRotation) },
    5: { displacement: getDisplacement(r, pistonsModels['piston5'].offsetRotation), moment: getMoment(r, pistonsModels['piston5'].offsetRotation) },
    6: { displacement: getDisplacement(r, pistonsModels['piston6'].offsetRotation), moment: getMoment(r, pistonsModels['piston6'].offsetRotation) },
  });
   */
