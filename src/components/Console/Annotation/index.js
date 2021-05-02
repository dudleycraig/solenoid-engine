import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from 'react-three-fiber';

export default ({children, subjectRelativePosition, annotationPosition, orientation=['center', 'middle'], color='rgba(0, 0, 0, 0.3)', ...props}) => {
  const { viewport } = useThree();
  const canvas = useMemo(() => textCanvas(children), [children]);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 24;
  texture.minFilter = THREE.NearestFilter;

  // calculate which side of the subject the line terminates
  const terminationPosition = useMemo(() => {
    const orientations = { center:0, middle:0, left:1, right:-1, top:-1, bottom:1};
    const [annotationX, annotationY, annotationZ] = annotationPosition; 
    const [orientationX, orientationY] = orientation;
    return new THREE.Vector3(annotationX + ((canvas.width / 4) * orientations[orientationX]), annotationY + ((canvas.height / 4) * orientations[orientationY]), annotationZ);
  }, [orientation, annotationPosition, canvas.width, canvas.height]);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints([terminationPosition, new THREE.Vector3(...subjectRelativePosition)]), [subjectRelativePosition, terminationPosition]);

  const ref = useRef();

  return (
    <group {...props}>
      <mesh position={subjectRelativePosition}>
        <sphereBufferGeometry args={[1, 16, 16]} attach={'geometry'} />
        <meshBasicMaterial color={color} attach={'material'} />
      </mesh>
      <line geometry={lineGeometry}>
        <lineBasicMaterial attach={'material'} color={color} linewidth={10} linecap={'round'} linejoin={'round'} sizeAttenuation={false} transparent alphaTest={0.5} />
      </line>
      <mesh position={terminationPosition}>
        <sphereBufferGeometry args={[1, 16, 16]} attach={'geometry'} />
        <meshBasicMaterial color={color} attach={'material'} />
      </mesh>
      <sprite ref={ref} scale={ [canvas.width / viewport.factor, canvas.height / viewport.factor, 1] } position={annotationPosition} {...props}>
        <spriteMaterial attach="material" map={texture} transparent alphaTest={0.5} />
      </sprite>
    </group>
  );
};

const textCanvas = (text, style = {}) => {
  const { 
    fontSize = 9, 
    fontColor = 'rgba(0, 0, 0, 1)', 
    fontFace = 'Arial, Roboto',
    fontStyle = 'Bold',
    textBaseline = 'middle',
    textAlign = 'center',
    borderWidth = 2,
    borderColor = 'rgba(0, 0, 0, 1)',
    borderRadius = 6,
    padding = 0,
    backgroundColor = 'rgba(255, 255, 255, 1)',
  } = style;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const textSize = { w:Math.ceil(context.measureText(text).width), h:fontSize };
  const canvasSize = { w:Math.ceil(textSize.w + ((borderWidth + borderRadius + padding) * 2)), h:Math.ceil(textSize.h + ((borderWidth + borderRadius + padding) * 2)) };
  const canvasPosition = { x:(canvasSize.w / 2), y:(canvasSize.h / 2) };
  canvas.style = { ...canvas.style, ...{ position:'absolute', width:`${canvasSize.w}px`, height:`${canvasSize.h}px` } }
  canvas.width = canvasSize.w;
  canvas.height = canvasSize.h;

  if (borderWidth && borderWidth > 0) { // if there's a border, draw it bevelled
    context.lineWidth = borderWidth;
    context.strokeStyle = borderColor;

    const origin = { x:0, y:canvasSize.h };
    context.beginPath();
    context.moveTo(origin.x + borderRadius, origin.y);
    context.lineTo(origin.x + canvasSize.w - borderRadius, origin.y);
    context.quadraticCurveTo(origin.x + canvasSize.w, origin.y, origin.x + canvasSize.w, origin.y - borderRadius);
    context.lineTo(origin.x + canvasSize.w, origin.y - canvasSize.h + borderRadius);
    context.quadraticCurveTo(origin.x + canvasSize.w, origin.y - canvasSize.h, origin.x + canvasSize.w - borderRadius, origin.y - canvasSize.h);
    context.lineTo(origin.x + borderRadius, origin.y - canvasSize.h);
    context.quadraticCurveTo(origin.x, origin.y - canvasSize.h, origin.x, origin.y - canvasSize.h + borderRadius);
    context.lineTo(origin.x, origin.y - borderRadius);
    context.quadraticCurveTo(origin.x, origin.y, origin.x + borderRadius, origin.y);
    context.closePath();

    context.fillStyle = backgroundColor;
    context.fill();

    context.strokeStyle = borderColor;
    context.stroke();
  }

  context.fillStyle = fontColor;
  context.font = `${fontStyle} ${fontSize}px ${fontFace}`;
  context.textAlign = textAlign;
  context.textBaseline = textBaseline;
  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  context.fillText(text, canvasPosition.x, canvasPosition.y);

  return canvas;
};

