import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

export default () => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;

  return (
    <Container
      className="p-0 m-0"
      style={{
        backgroundImage: `url(${assets}/images/engine/oblique-opaque.png)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundSize: 'contain',
      }}
    >
      <Container
        className="p-0 m-0"
        className="about text-center"
        style={{
          maxWidth: '800px',
          minHeight: '600px',
          color: '#cccccc',
        }}
      >
        <Row>
          <Col>
            <Alert variant={'dark'} className="error" style={{ whiteSpace: 'pre-line', background: '#ffffff' }}>
              <h3>
                <i>{window.location.href}</i> not found.
              </h3>
            </Alert>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};
