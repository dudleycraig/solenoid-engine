import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import StatusIcon from '../../../StatusIcon';
import useStore from '../../../../store';

export default (props) => {
  const { monitoring:data } = useStore();
  return (
    <Card id="monitoring-hud" bg="light" text="dark" className="hud" {...props}>
      <Card.Header as={Row}>
        <Col md={6}><StatusIcon status={data.status} />&nbsp;Monitoring</Col>
        <Col md={{span:2, offset:4}}>
          <Button variant="primary" onClick={() => data.toggle()} size="sm">X</Button>
        </Col>
      </Card.Header>
      <Card.Body>
        {/**
        <Form noValidate id="global-control-form">
          <Form.Group as={Row} controlId="crankRotation">
            <Col lg={4}>
              <Form.Label size="sm">Rotation</Form.Label>
            </Col>
            <Col lg={8}>
              <Form.Label size="sm">
                <RadToDeg className="rad-to-deg" radians={crankRotation.value} />
              </Form.Label>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="crankSpeed">
            <Col lg={4}>
              <Form.Label size="sm">Speed</Form.Label>
            </Col>
            <Col lg={8}>
              <Form.Control size="sm" type="text" name="crankSpeed" placeholder="Crankshaft Speed" value={crankSpeed.value} onChange={event => crankSpeed.update(event.target.value)} isInvalid={Object.keys(crankSpeed.messages).filter(uuid => crankSpeed.messages[uuid].status === 'error').length > 0} autoFocus />
            </Col>
          </Form.Group>
        </Form>
        <Messages messages={crankSpeed.messages} />
         **/}
      </Card.Body>
    </Card>
  );
}
