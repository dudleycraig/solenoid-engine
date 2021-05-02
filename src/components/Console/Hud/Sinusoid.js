import React, { useRef, forwardRef, useEffect } from 'react';
import * as THREE from 'three';
import useStore from '../../../store';

const range = (from, to) => Array.from({ length: to - from + 1 }, (v, k) => k + from);

export default forwardRef((props, ref) => {
  const { visible, setVisible } = useStore((state) => state.hud.sinusoid);

  const radius = 30;
  const padding = 5;

  const needleRef = useRef();
  const source = { tl: { x: padding, y: padding }, c: { x: radius + padding, y: radius + padding }, w: radius * 2, h: radius * 2 + padding * 2 };
  const circlePoints = new THREE.EllipseCurve(source.c.x, source.c.y, radius, radius, 0, 2 * Math.PI, false, 0).getPoints(radius * 2);
  const circleGeometry = new THREE.BufferGeometry().setFromPoints(circlePoints);
  const zeroDegreePoints = [
    new THREE.Vector3(source.c.x + (radius / 4) * 3, source.c.y, 0),
    new THREE.Vector3(source.c.x + radius + 3, source.c.y, 0),
  ];
  const zeroDegreeGeometry = new THREE.BufferGeometry().setFromPoints(zeroDegreePoints);

  const needlePoints = (r) => [
    new THREE.Vector3(source.c.x, source.c.y, 0),
    new THREE.Vector3(Math.cos(r) * radius + source.c.x, Math.sin(r) * radius + source.c.y, 0),
  ];
  const needleGeometry = new THREE.BufferGeometry().setFromPoints(needlePoints(2 * Math.PI));

  const sinusoidRef = useRef();
  const degToRad = (d) => d * (Math.PI / 180);
  const target = { tl: { x: radius * 2 + padding * 2, y: padding }, w: radius * 2 * 2, h: radius * 2 + padding * 2 };
  const xAxisPoints = [new THREE.Vector3(target.tl.x, target.h / 2), new THREE.Vector3(target.tl.x + target.w, target.h / 2)];
  const xAxisGeometry = new THREE.BufferGeometry().setFromPoints(xAxisPoints);
  const sinePoint = (x, r) => new THREE.Vector3(target.tl.x + x * (target.w / 360), target.h / 2 + radius * Math.sin(r - degToRad(x)), 0);
  const sinePoints = range(1, 360).reduce((a, x) => [...a, sinePoint(x, 2 * Math.PI)], []);
  const sinusoidGeometry = new THREE.BufferGeometry().setFromPoints(sinePoints);

  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (metrics) => {
        const [sample] = metrics.slice(-1);
        const needleGeometry = new THREE.BufferGeometry().setFromPoints(needlePoints(-sample.r));
        if (needleRef.current) needleRef.current.geometry = needleGeometry;

        const sinePoints = range(1, 360).reduce((a, x) => [...a, sinePoint(x, -sample.r)], []);
        const sinusoidGeometry = new THREE.BufferGeometry().setFromPoints(sinePoints);
        if (sinusoidRef.current) sinusoidRef.current.geometry = sinusoidGeometry;
      },
      (state) => state.api.metrics
    );
    return () => unsubscribe();
  }, []);

  return (
    <group ref={ref} title="Analysis" position={[radius + 5, -(radius + 5), -120]} rotation={[0, Math.PI, 0]} {...props}>
      <line geometry={circleGeometry}>
        <lineBasicMaterial attach={'material'} color={'0xffffff'} linewidth={2} linecap={'round'} linejoin={'round'} />
      </line>
      <line geometry={zeroDegreeGeometry}>
        <lineBasicMaterial attach={'material'} color={'0xffffff'} linewidth={2} linecap={'round'} linejoin={'round'} />
      </line>
      <line ref={needleRef} geometry={needleGeometry}>
        <lineBasicMaterial attach={'material'} color={'0xffffff'} linewidth={2} linecap={'round'} linejoin={'round'} />
      </line>
      <line geometry={xAxisGeometry}>
        <lineBasicMaterial attach={'material'} color={'0xffffff'} linewidth={2} linecap={'round'} linejoin={'round'} />
      </line>
      <line ref={sinusoidRef} geometry={sinusoidGeometry}>
        <lineBasicMaterial attach={'material'} color={'0xffffff'} linewidth={2} linecap={'round'} linejoin={'round'} />
      </line>
    </group>
  );
});

/**
const Sinusoid = () => {
  const metrics = useStore((state) => state.api.metrics);
  const [sample, setSample] = useState(metrics.slice(-1)[0]);
  const canvasSize = { w: 170, h: 100 };

  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (metrics) => setSample(metrics.slice(-1)[0]),
      (state) => state.api.metrics
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => setSample(metrics.slice(-1)[0]), [metrics]);

  const texture = new THREE.CanvasTexture(sinusoidCanvas(canvasSize, sample));
  texture.needsUpdate = true;
  texture.anisotropy = 24;
  texture.minFilter = THREE.NearestFilter;

  return (
    <mesh position={[-53, 0, -120]} rotation={[0, Math.PI, 0]}>
      <planeBufferGeometry attach="geometry" args={[canvasSize.w, canvasSize.h]} />
      <meshPhongMaterial
        attach="material"
        map={texture}
        transparent={true}
        opacity={0.9}
        depthTest={true}
        side={THREE.DoubleSide}
        depthWrite={true}
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
};

const sinusoidCanvas = (canvasSize, sample, style = {}) => {
  const canvas = document.createElement('canvas');
  window.devicePixelRatio = 2;
  canvas.pixelRatio = window.devicePixelRatio;
  canvas.width = canvasSize.w * window.devicePixelRatio;
  canvas.style.width = `${canvasSize.w}px`;
  canvas.height = canvasSize.h * window.devicePixelRatio;
  canvas.style.height = `${canvasSize.h}px`;
  canvas.style = { imageRendering: 'crisp-edges' };

  const context = canvas.getContext('2d');
  context.scale(window.devicePixelRatio, window.devicePixelRatio);
  context.imageSmoothingEnabled = false;

  const rect = (x0, y0, x1, y1, r) => {
    const w = x1 - x0;
    const h = y1 - y0;
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;

    context.lineWidth = 1;
    context.strokeStyle = 'rgba(0, 0, 0, 1)';

    context.beginPath();
    context.translate(0.5, 0.5);
    context.moveTo(x1 - r, y0);
    context.quadraticCurveTo(x1, y0, x1, y0 + r);
    context.lineTo(x1, y1 - r);
    context.quadraticCurveTo(x1, y1, x1 - r, y1);
    context.lineTo(x0 + r, y1);
    context.quadraticCurveTo(x0, y1, x0, y1 - r);
    context.lineTo(x0, y0 + r);
    context.quadraticCurveTo(x0, y0, x0 + r, y0);
    context.closePath();
    context.stroke();
  };

  const sinusoid = () => {
    const diameter = 60;
    const radius = diameter / 2;
    const center = { x: canvasSize.w / 2, y: canvasSize.h / 2 };
    const degToRad = (degrees) => degrees * (Math.PI / 180);

    context.lineWidth = 0.75;
    context.strokeStyle = 'rgba(255,255,255,1)';

    const source = {
      center: { x: 2 + radius, y: center.y },
      initial: { x: diameter + 2, y: center.y },
    };

    context.beginPath();
    context.arc(source.center.x, source.center.y, radius, 0, 2 * Math.PI, false);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(source.center.x, source.center.y);
    context.lineTo(
      Math.cos(sample.r) * (source.initial.x - source.center.x) + Math.sin(sample.r) * (source.initial.y - source.center.y) + source.center.x,
      Math.cos(sample.r) * (source.initial.y - source.center.y) + Math.sin(sample.r) * (source.initial.x - source.center.x) + source.center.y
    );
    context.closePath();
    context.stroke();

    const target = {
      start: { x: diameter + 5, y: center.y },
      end: { x: canvasSize.w, y: center.y },
      width: canvasSize.w - (diameter + 5),
      height: diameter,
    };
    const sinePoint = (x, r) => [target.start.x + x * (target.width / 360), canvasSize.h / 2 + radius * Math.sin(r - degToRad(x))];

    context.moveTo(target.start.x, target.start.y);
    context.lineTo(target.end.x, target.end.y);
    context.stroke();

    context.moveTo(...sinePoint(target.start.x, sample.r));
    context.beginPath();
    range(1, 360).map((x) => context.lineTo(...sinePoint(x, sample.r)));
    context.stroke();
  };

  // rect(0, 0, canvasSize.w - 2, canvasSize.h - 2, 5);

  sinusoid();

  return canvas;
};
**/
