import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Button, Accordion, AccordionContext, useAccordionToggle, Card, Row, Col, Collapse, ButtonGroup } from 'react-bootstrap';
import Hud from '../../../Hud';
import EngineIcon from '../../../SVG/EngineIcon';
import useStore from '../../../../store';

export default ({ ...props }) => {
  const hud = useStore((state) => state.hud.layers);
  const models = {
    frame: useStore((state) => state.frame.models),
    journals: useStore((state) => state.journals.models),
    sensors: useStore((state) => state.sensors.models),
    coils: useStore((state) => state.coils.models),
    conrods: useStore((state) => state.pistons.models),
    crankshaft: useStore((state) => state.crankshaft.models),
  };

  const layers = {
    journals: { visible: Object.keys(models.journals).every((name) => models.journals[name].visible) },
    frame: { visible: Object.keys(models.frame).every((name) => models.frame[name].visible) },
    coils: { visible: Object.keys(models.coils).every((name) => models.coils[name].visible) },
    sensors: { visible: Object.keys(models.sensors).every((name) => models.sensors[name].visible) },
    crankshaft: { visible: Object.keys(models.crankshaft).every((name) => models.crankshaft[name].visible) },
    conrods: { visible: Object.keys(models.conrods).every((name) => models.conrods[name].visible) },
  };

  const LayerToggle = ({ children, eventKey, callback, ...props }) => {
    const currentEventKey = useContext(AccordionContext);
    const decorateOnClick = useAccordionToggle(eventKey, () => callback && callback(eventKey));
    const isCurrentEventKey = currentEventKey === eventKey;
    return (
      <Button active={isCurrentEventKey} onClick={decorateOnClick} {...props}>
        {children}
      </Button>
    );
  };

  return (
    <Hud id="layers" title="Layers" hud={hud} {...props}>
      {/**
      <EngineIcon layers={['frame', 'journals', 'sensors', 'coils', 'conrods', 'crankshaft']} hasEvents={false} width={'100%'} height={'auto'} />
      &nbsp;
        **/}
      <Accordion className="text-center" defaultActiveKey="0">
        {Object.keys(models).map((key, index) => [
          <ButtonGroup key={`layer-toggle-${index}`} size="sm" className="w-100 row">
            <LayerToggle key={`map-toggle-${index}`} eventKey={`${index}`} className="col-10 text-center">
              <Row className="no-gutter">
                <Col xl="12" className="text-center my-auto">
                  {key}
                </Col>
              </Row>
            </LayerToggle>
            <Button onClick={() => Object.keys(models[key]).map((name) => models[key][name].toggle())} active={!layers[key].visible} className="auto">
              <FontAwesomeIcon icon={layers[key].visible ? faEye : faEyeSlash} color={'rgba(255,255,255,0.8)'} />
            </Button>
          </ButtonGroup>,
          <Accordion.Collapse key={`map-collapse-${index}`} eventKey={`${index}`} className="col-12">
            <EngineIcon layers={[key]} width={'100%'} height={'auto'} />
          </Accordion.Collapse>,
        ])}
      </Accordion>
    </Hud>
  );
};
