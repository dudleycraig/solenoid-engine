import React from 'react';
import useStore from '../../store';

export default ({
  layers = ['frame', 'sensors', 'coils', 'journals', 'crankshaft', 'conrods'],
  width = 370,
  height = 200,
  className = '',
  hasEvents = true,
  ...props
}) => {
  const models = {
    journals: useStore((state) => state.journals.models),
    frame: useStore((state) => state.frame.models),
    coils: useStore((state) => state.coils.models),
    sensors: useStore((state) => state.sensors.models),
    crankshaft: useStore((state) => state.crankshaft.models),
    conrods: useStore((state) => state.pistons.models),
  };

  const Frame = () => (
    <g id="frame" className={`${hasEvents ? 'clickable' : 'non-clickable'}`}>
      <a
        onClick={() => models.frame.frontFacingLeftVHinge.toggle() && false}
        className={models.frame.frontFacingLeftVHinge.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m25 90v-40" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() =>
          (models.frame.frontFacingLeftElbow.toggle(),
          models.frame.conduit013.toggle(),
          models.frame.conduit014.toggle()) && false
        }
        className={
          models.frame.frontFacingLeftElbow.visible &&
          models.frame.conduit013.visible &&
          models.frame.conduit014.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <path d="m25 40v-20h20" className="svg-thick thick-18" />
        <path d="m75 20h-30" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.frame.frontFacingRightVHinge.toggle() && false}
        className={models.frame.frontFacingRightVHinge.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m25 150v-40" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() =>
          (models.frame.frontFacingRightElbow.toggle(),
          models.frame.conduit001.toggle(),
          models.frame.conduit002.toggle()) && false
        }
        className={
          models.frame.frontFacingRightElbow.visible &&
          models.frame.conduit001.visible &&
          models.frame.conduit002.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <path d="m25 160v20h20" className="svg-thick thick-18" />
        <path d="m65 180h-20" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.frame.leftRailCoilHolder2.toggle() && false}
        className={models.frame.leftRailCoilHolder2.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m85 20h20" className="svg-thick thick-18" />
        <path d="m95 0v30" className="svg-thick thick-6" />
      </a>
      <a
        onClick={() => models.frame.rightRailCoilHolder1.toggle() && false}
        className={models.frame.rightRailCoilHolder1.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m75 180h20" className="svg-thick thick-18" />
        <path d="m85 200v-30" className="svg-thick thick-6" />
      </a>
      <a
        onClick={() => models.frame.conduit012.toggle() && false}
        className={models.frame.conduit012.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m115 20h20" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.frame.conduit003.toggle() && false}
        className={models.frame.conduit003.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m105 180h20" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.frame.leftRailCoilHolder4.toggle() && false}
        className={models.frame.leftRailCoilHolder4.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m145 20h20" className="svg-thick thick-18" />
        <path d="m155 0v30" className="svg-thick thick-6" />
      </a>
      <a
        onClick={() => models.frame.rightRailCoilHolder3.toggle() && false}
        className={models.frame.rightRailCoilHolder3.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m135 180h20" className="svg-thick thick-18" />
        <path d="m145 200v-30" className="svg-thick thick-6" />
      </a>
      <a
        onClick={() => models.frame.conduit011.toggle() && false}
        className={models.frame.conduit011.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m175 20h20" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.frame.conduit004.toggle() && false}
        className={models.frame.conduit004.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m165 180h20" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.frame.leftRailCoilHolder6.toggle() && false}
        className={models.frame.leftRailCoilHolder6.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m205 20h20" className="svg-thick thick-18" />
        <path d="m215 0v30" className="svg-thick thick-6" />
      </a>
      <a
        onClick={() => models.frame.rightRailCoilHolder5.toggle() && false}
        className={models.frame.rightRailCoilHolder5.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m195 180h20" className="svg-thick thick-18" />
        <path d="m205 200v-30" className="svg-thick thick-6" />
      </a>
      <a
        onClick={() => models.frame.conduit010.toggle() && false}
        className={models.frame.conduit010.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m235 20h20" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.frame.conduit005.toggle() && false}
        className={models.frame.conduit005.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m225 180h30" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.frame.leftRailLEDEncoder.toggle() && false}
        className={models.frame.leftRailLEDEncoder.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m265 20h20" className="svg-thick thick-18" />
        <path d="m275 40v-30" className="svg-thick thick-6" />
      </a>
      <a
        onClick={() => models.frame.rightRailLEDEncoder.toggle() && false}
        className={models.frame.rightRailLEDEncoder.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m265 180h20" className="svg-thick thick-18" />
        <path d="m275 160v30" className="svg-thick thick-6" />
      </a>
      <a
        onClick={() =>
          (models.frame.rearFacingLeftElbow.toggle(),
          models.frame.conduit009.toggle(),
          models.frame.conduit008.toggle()) && false
        }
        className={
          models.frame.rearFacingLeftElbow.visible && models.frame.conduit009.visible && models.frame.conduit008.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <path d="m345 40v-20h-20" className="svg-thick thick-18" />
        <path d="m295 20h30" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() =>
          (models.frame.rearFacingRightElbow.toggle(),
          models.frame.conduit007.toggle(),
          models.frame.conduit006.toggle()) && false
        }
        className={
          models.frame.rearFacingRightElbow.visible &&
          models.frame.conduit007.visible &&
          models.frame.conduit006.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <path d="m295 180h30" className="svg-thick thick-18" />
        <path d="m345 160v20h-20" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.frame.rearFacingLeftVHinge.toggle() && false}
        className={models.frame.rearFacingLeftVHinge.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m345 90v-40" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.frame.rearFacingRightVHinge.toggle() && false}
        className={models.frame.rearFacingRightVHinge.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m345 150v-40" className="svg-thick thick-18" />
      </a>
    </g>
  );

  const Coils = () => (
    <g id="coils" className={`${hasEvents ? 'clickable' : 'non-clickable'}`}>
      <a
        onClick={() => models.coils.coil1.toggle() && false}
        className={models.coils.coil1.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m85 170v20" className="svg-thick thick-18" />
        <path d="m85 160v40" className="svg-thick thick-4" />
      </a>

      <a
        onClick={() => models.coils.coil2.toggle() && false}
        className={models.coils.coil2.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m95 10v20" className="svg-thick thick-18" />
        <path d="m95 0v40" className="svg-thick thick-4" />
      </a>

      <a
        onClick={() => models.coils.coil3.toggle() && false}
        className={models.coils.coil3.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m145 170v20" className="svg-thick thick-18" />
        <path d="m145 160v40" className="svg-thick thick-4" />
      </a>

      <a
        onClick={() => models.coils.coil4.toggle() && false}
        className={models.coils.coil4.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m155 10v20" className="svg-thick thick-18" />
        <path d="m155 0v40" className="svg-thick thick-4" />
      </a>

      <a
        onClick={() => models.coils.coil5.toggle() && false}
        className={models.coils.coil5.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m205 170v20" className="svg-thick thick-18" />
        <path d="m205 160v40" className="svg-thick thick-4" />
      </a>

      <a
        onClick={() => models.coils.coil6.toggle() && false}
        className={models.coils.coil6.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m215 10v20" className="svg-thick thick-18" />
        <path d="m215 0v40" className="svg-thick thick-4" />
      </a>
    </g>
  );

  const Sensors = () => (
    <g id="sensors" className={`${hasEvents ? 'clickable' : 'non-clickable'}`}>
      <a
        onClick={() => models.sensors.leftLEDEncoderPeg.toggle() && false}
        className={models.sensors.leftLEDEncoderPeg.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m275 10v40" className="svg-thick thick-4" />
        <path d="m265 50h20" className="svg-thick thick-4" />
      </a>
      <a
        onClick={() => models.sensors.leftLEDEncoder.toggle() && false}
        className={models.sensors.leftLEDEncoder.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m265 56h20" className="svg-thick thick-4" />
      </a>

      <a
        onClick={() => models.sensors.rightLEDEncoderPeg.toggle() && false}
        className={models.sensors.rightLEDEncoderPeg.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m275 190v-40" className="svg-thick thick-4" />
        <path d="m265 150h20" className="svg-thick thick-4" />
      </a>
      <a
        onClick={() => models.sensors.rightLEDEncoder.toggle() && false}
        className={models.sensors.rightLEDEncoder.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m265 144h20" className="svg-thick thick-4" />
      </a>

      <a
        onClick={() => models.sensors.reflectiveEncoderPeg.toggle() && false}
        className={models.sensors.reflectiveEncoderPeg.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m295 100h30" className="svg-thick thick-4" />
        <path d="m295 90v20" className="svg-thick thick-4" />
      </a>
      <a
        onClick={() => models.sensors.reflectiveEncoder.toggle() && false}
        className={models.sensors.reflectiveEncoder.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m289 90v20" className="svg-thick thick-4" />
      </a>
    </g>
  );

  const Journals = () => (
    <g id="journals" className={`${hasEvents ? 'clickable' : 'non-clickable'}`}>
      <a
        onClick={() =>
          (models.journals.journalBottomForFrontFacingVHinge.toggle(),
          models.journals.journalTopForFrontFacingVHinge.toggle()) && false
        }
        className={
          models.journals.journalBottomForFrontFacingVHinge.visible &&
          models.journals.journalTopForFrontFacingVHinge.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <ellipse cx="25.042" cy="99.974" rx="16.157" ry="16.158" className="svg-thick thick-8" />
      </a>
      <a
        onClick={() =>
          (models.journals.journalBottomForAxleOfMainConrods1And2.toggle(),
          models.journals.journalTopForAxleOfMainConrods1And2.toggle()) && false
        }
        className={
          models.journals.journalBottomForAxleOfMainConrods1And2.visible &&
          models.journals.journalTopForAxleOfMainConrods1And2.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <ellipse cx="77.503" cy="100.01" rx="16.157" ry="16.158" className="svg-thick thick-8" />
      </a>
      <a
        onClick={() =>
          (models.journals.journalBottomForAxleOfMainConrods3And4.toggle(),
          models.journals.journalTopForAxleOfMainConrods3And4.toggle()) && false
        }
        className={
          models.journals.journalBottomForAxleOfMainConrods3And4.visible &&
          models.journals.journalTopForAxleOfMainConrods3And4.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <ellipse cx="131.05" cy="100.06" rx="16.157" ry="16.158" className="svg-thick thick-8" />
      </a>
      <a
        onClick={() =>
          (models.journals.journalBottomForAxleOfMainConrods5And6.toggle(),
          models.journals.journalTopForAxleOfMainConrods5And6.toggle()) && false
        }
        className={
          models.journals.journalBottomForAxleOfMainConrods5And6.visible &&
          models.journals.journalTopForAxleOfMainConrods5And6.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <ellipse cx="185.04" cy="99.974" rx="16.157" ry="16.158" className="svg-thick thick-8" />
      </a>
      <a
        onClick={() =>
          (models.journals.journalBottomForAxleOfCodewheel.toggle(),
          models.journals.journalTopForAxleOfCodewheel.toggle()) && false
        }
        className={
          models.journals.journalBottomForAxleOfCodewheel.visible &&
          models.journals.journalTopForAxleOfCodewheel.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <ellipse cx="239" cy="99.994" rx="16.157" ry="16.158" className="svg-thick thick-8" />
      </a>
      <a
        onClick={() =>
          (models.journals.journalBottomForAxleOfCodewheelAndSensor.toggle(),
          models.journals.journalTopForAxleOfCodewheelAndSensor.toggle()) && false
        }
        className={
          models.journals.journalBottomForAxleOfCodewheelAndSensor.visible &&
          models.journals.journalTopForAxleOfCodewheelAndSensor.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <ellipse cx="291.98" cy="100.04" rx="16.157" ry="16.158" className="svg-thick thick-8" />
      </a>
      <a
        onClick={() =>
          (models.journals.journalBottomForRearFacingVHinge.toggle(),
          models.journals.journalTopForRearFacingVHinge.toggle()) && false
        }
        className={
          models.journals.journalBottomForRearFacingVHinge.visible &&
          models.journals.journalTopForRearFacingVHinge.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <ellipse cx="345.04" cy="100.09" rx="16.157" ry="16.158" className="svg-thick thick-8" />
      </a>
    </g>
  );

  const Crankshaft = () => (
    <g id="crankshaft" className={`${hasEvents ? 'clickable' : 'non-clickable'}`}>
      <a
        onClick={() => models.crankshaft.rearSpacerAxle.toggle() && false}
        className={models.crankshaft.rearSpacerAxle.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m45 100h20" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() =>
          (models.crankshaft.crank2d120.toggle(),
          models.crankshaft.crankAxleForConrods5And6.toggle(),
          models.crankshaft.crank1d0.toggle()) && false
        }
        className={
          models.crankshaft.crank2d120.visible &&
          models.crankshaft.crankAxleForConrods5And6.visible &&
          models.crankshaft.crank1d0.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <path d="m75 90v20" className="svg-thick thick-6" />
        <path d="m75 90h30" className="svg-thick thick-4" />
        <path d="m105 90v20" className="svg-thick thick-6" />
      </a>
      <path d="m105 100h30" className="svg-thick thick-6" />
      <a
        onClick={() =>
          (models.crankshaft.crank4d120.toggle(),
          models.crankshaft.crankAxleForConrods3And4.toggle(),
          models.crankshaft.crank3d0.toggle()) && false
        }
        className={
          models.crankshaft.crank4d120.visible &&
          models.crankshaft.crankAxleForConrods3And4.visible &&
          models.crankshaft.crank3d0.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <path d="m165 90v20" className="svg-thick thick-6" />
        <path d="m135 110h30" className="svg-thick thick-4" />
        <path d="m135 90v20" className="svg-thick thick-6" />
      </a>
      <path d="m165 100h30" className="svg-thick thick-6" />
      <a
        onClick={() =>
          (models.crankshaft.crank6d120.toggle(),
          models.crankshaft.crankAxleForConrods1And2.toggle(),
          models.crankshaft.crank5d0.toggle()) && false
        }
        className={
          models.crankshaft.crank6d120.visible &&
          models.crankshaft.crankAxleForConrods1And2.visible &&
          models.crankshaft.crank5d0.visible
            ? 'visible'
            : 'hidden'
        }
        href="#0"
      >
        <path d="m225 90v20" className="svg-thick thick-6" />
        <path d="m195 90h30" className="svg-thick thick-4" />
        <path d="m195 90v20" className="svg-thick thick-6" />
      </a>
      <a
        onClick={() => models.crankshaft.codewheelBackplate.toggle() && false}
        className={models.crankshaft.codewheelBackplate.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m265 80v40" className="svg-thick thick-10" />
        <path d="m235 100h20" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.crankshaft.codewheel.toggle() && false}
        className={models.crankshaft.codewheel.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m275 70v60" className="svg-thick thick-6" />
        <path d="m275 100h10" className="svg-thick thick-18" />
      </a>
      <a
        onClick={() => models.crankshaft.frontSpacerAxle.toggle() && false}
        className={models.crankshaft.frontSpacerAxle.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m325 100h-20" className="svg-thick thick-18" />
      </a>
    </g>
  );

  const Conrods = () => (
    <g id="conrods" className={`${hasEvents ? 'clickable' : 'non-clickable'}`}>
      <a
        onClick={() => models.conrods.piston2.toggle() && false}
        className={models.conrods.piston2.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m95 40v10" className="svg-thick thick-8" />
        <path d="m95 60v30" className="svg-thick thick-8" />
      </a>

      <a
        onClick={() => models.conrods.piston1.toggle() && false}
        className={models.conrods.piston1.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m85 160v-30" className="svg-thick thick-8" />
        <path d="m85 90v30" className="svg-thick thick-8" />
      </a>
      <a
        onClick={() => models.conrods.piston4.toggle() && false}
        className={models.conrods.piston4.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m155 40v30" className="svg-thick thick-8" />
        <path d="m155 80v30" className="svg-thick thick-8" />
      </a>
      <a
        onClick={() => models.conrods.piston3.toggle() && false}
        className={models.conrods.piston3.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m145 160v-10" className="svg-thick thick-8" />
        <path d="m145 140v-30" className="svg-thick thick-8" />
      </a>
      <a
        onClick={() => models.conrods.piston5.toggle() && false}
        className={models.conrods.piston5.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m205 160v-30" className="svg-thick thick-8" />
        <path d="m205 120v-30" className="svg-thick thick-8" />
      </a>

      <a
        onClick={() => models.conrods.piston6.toggle() && false}
        className={models.conrods.piston6.visible ? 'visible' : 'hidden'}
        href="#0"
      >
        <path d="m215 40v10" className="svg-thick thick-8" />
        <path d="m215 60v30" className="svg-thick thick-8" />
      </a>
    </g>
  );

  const layerToJSX = {
    frame: Frame,
    sensors: Sensors,
    coils: Coils,
    journals: Journals,
    crankshaft: Crankshaft,
    conrods: Conrods,
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 370 200`} className={`svg-engine ${className}`} {...props}>
      {layers.map((layer) => React.createElement(layerToJSX[layer], { key: `layer-${layer}` }))}
    </svg>
  );
};
