import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree, Dom } from 'react-three-fiber';
import * as THREE from 'three';
import useStore from '../../../store';
import CameraControls from '../CameraControls';
import Frame from './Frame';
import Coils from './Coils';
import Sensors from './Sensors';
import Journals from './Journals';
import CrankMotion from './CrankMotion';
import Sinusoid from '../Hud/Sinusoid';

const range = (from, to) => Array.from({ length: to - from + 1 }, (v, k) => k + from);

const Loading = () => {
  const ref = useRef();
  const radius = 16;
  const divisions = 8;
  const radians = THREE.MathUtils.degToRad(360 / 8);
  useFrame(() => (ref.current.rotation.z = ref.current.rotation.z + 0.061));
  return (
    <group ref={ref}>
      {range(1, divisions).map((index) => {
        const x = Math.cos(radians * index) * radius;
        const y = Math.sin(radians * index) * radius;
        return (
          index !== 1 && (
            <mesh key={`spinner-${index}`} visible position={[x, y, 0]} rotation={[0, 0, 0]}>
              <sphereGeometry attach="geometry" args={[5, 20, 20]} />
              <meshPhongMaterial
                attach="material"
                depthTest={true}
                depthWrite={true}
                side={THREE.FrontSide}
                color={0xff7700}
                reflectivity={0}
                flatShading={false}
                roughness={0.8}
                metalness={0.2}
                emissive={0x101010}
                specular={0x101010}
                shininess={100}
              />
            </mesh>
          )
        );
      })}
    </group>
  );
};

const Engine = () => {
  const engineRef = useRef();

  const sinusoidRef = useRef();
  const { visible } = useStore((state) => state.hud.sinusoid);
  useEffect(() => {
    if (sinusoidRef.current) sinusoidRef.current.visible = visible;
  }, [visible]);

  return (
    <group ref={engineRef} rotation={[0, 0, 0]}>
      <Suspense fallback={<Loading />}>
        <Sinusoid ref={sinusoidRef} visible={visible} />
        <Frame />
        <Journals />
        <Sensors />
        <CrankMotion />
        <Coils />
      </Suspense>
    </group>
  );
};

const Scene = () => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;
  const { camera, scene } = useThree();
  const torchRef = useRef();
  const nextSample = useStore((state) => state.api.next);

  useFrame(({}, delta) => {
    torchRef.current.position.x = camera.position.x;
    torchRef.current.position.y = camera.position.y;
    torchRef.current.position.z = camera.position.z;
    nextSample(delta);
  });

  const texture = new THREE.CubeTextureLoader()
    .setPath(`${assets}/images/skybox/`)
    .load([
      'skybox-grid.may4th.1024x1024.xpos.png',
      'skybox-grid.may4th.1024x1024.xneg.png',
      'skybox-grid.may4th.1024x1024.ypos.png',
      'skybox-grid.may4th.1024x1024.yneg.png',
      'skybox-grid.may4th.1024x1024.zpos.png',
      'skybox-grid.may4th.1024x1024.zneg.png',
    ]);
  scene.background = new THREE.Color(0x002b36);
  scene.background = texture;

  return (
    <>
      <CameraControls />
      <spotLight position={[0, 400, 0]} lookAt={[0, 0, 0]} color={0xcccccc} intensity={1} penumbra={0.5} />
      <spotLight ref={torchRef} lookAt={[0, 0, 0]} color={0xccaaaa} intensity={2} penumbra={0} />
      <Engine />
    </>
  );
};

export default ({ ...props }) => {
  const initialCameraPosition = [-400, 450, -300]; // 400, 400, 400 // -125, 200, -675
  return (
    <Canvas
      id="console"
      gl={{ alpha: true }}
      onCreated={({ scene }) => scene.translateY(50)}
      camera={{ fov: 30, aspect: 0.2, near: 1, far: 5000, position: initialCameraPosition, zoom: 1 }}
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        left: '0px',
        top: '0px',
        zIndex: 20,
      }}
      concurrent
      pixelRatio={window.devicePixelRatio}
      {...props}
    >
      <Scene />
    </Canvas>
  );
};
