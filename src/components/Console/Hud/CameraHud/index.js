import React from 'react';
import { Row, Card, Col, Button } from 'react-bootstrap';
import Messages from '../../../Messages';
import StatusIcon from '../../../StatusIcon';
import useStore from '../../../../store';

export default (props) => {
  const { monitoring:data } = useStore();
  return (
    <Card id="camera-hud" bg="light" text="dark" className="hud">
      <Card.Header as={Row}>
        <Col md={6}><StatusIcon status={data.status} />&nbsp;Camera</Col>
        <Col md={{span:2, offset:4}}>
          <Button variant="primary" onClick={() => data.toggle()} size="sm">X</Button>
        </Col>
      </Card.Header>
      <Card.Body>
      </Card.Body>
    </Card>
  );
}
