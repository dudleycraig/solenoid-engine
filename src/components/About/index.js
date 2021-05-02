import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

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
          maxWidth: '700px',
          minHeight: '500px',
          color: '#cccccc',
        }}
      >
        <Row id="overview" className="p-0 m-0">
          <h3 style={{ color: '#ffffff' }}>Overview</h3>
          <Container className="p-0 m-0">
            <Row className="p-0 m-0">
              <Col className="col-12">
                <p className="small text-left">
                  My attempt at <i style={{ color: '#ffffff' }}>virtual representation</i> of <i style={{ color: '#ffffff' }}>real-world metrics</i>.
                  A manner of depicting reality in digital.
                </p>
                <p className="small text-left">The solenoid engine was designed in Blender and printed on an Ender 3.</p>
                <p className="small text-left">
                  The coils being PWM controlled via Mosfets, and the timing of which by a custom reflective encoder and Arduinos.
                </p>
                <p className="small text-left">
                  The engine is interfaced via a Node MCU, across websockets, to an express server and rendered using WebGL and React.
                </p>
              </Col>
            </Row>
          </Container>
        </Row>

        <Row id="design" className="p-0 m-0">
          <h3 style={{ color: '#ffffff' }}>Design</h3>
          <Container className="p-0 m-0">
            <Row className="p-0 m-0">
              <Col className="col-12">
                <h6 className="text-left">Models</h6>
                <p className="small text-left">
                  All the 3D work has been done in Blender v2.82a with the vectors being done in a mixture of Javascript 2D Canvas and Inkscape.
                  Bitmapped images were edited with Gimp.
                </p>
              </Col>
            </Row>
            <Row className="p-0 m-0">
              <Col className="col-12">
                <h6 className="text-left">Circuit</h6>
                <p className="small text-left">
                  I used Fritzing initially, but after multiple corrupted saves, including backups, I had to start from scratch and have since started
                  working in EagleCad, which I also hate.
                </p>
              </Col>
            </Row>
          </Container>
        </Row>

        <Row id="printing" className="p-0 m-0">
          <h3 style={{ color: '#ffffff' }}>Printing</h3>
          <Container className="p-0 m-0">
            <Row className="p-0 m-0">
              <Col className="col-12">
                <h6 className="text-left">Printing</h6>
                <p className="small text-left">
                  3D Printing was done on my reliable <i>Ender3 Pro</i> using default ABS material settings.
                </p>
              </Col>
            </Row>
          </Container>
        </Row>

        <Row id="code" className="p-0 m-0">
          <h3 style={{ color: '#ffffff' }}>Source Code</h3>
          <Container className="p-0 m-0">
            <Row className="p-0 m-0">
              <Col className="col-12">
                <h6 className="text-left">Client</h6>
                <p className="small text-left">
                  All coding is done in VIM. The client is rendered using React, WebGL and 2D Canvas with metrics piped via websockets. Libraries used
                  being <i>react-hooks</i>, <i>react-three-fiber</i>, <i>zustand</i> and <i>bootstrap</i>.
                </p>
              </Col>
            </Row>
            <Row className="p-0 m-0">
              <Col className="col-12">
                <h6 className="text-left">Server</h6>
                <p className="small text-left">
                  A standard express server for hosting static media and a separate websocket server for hosting real-time metrics.
                  <br />
                  <i className="warning">
                    Since I can't open the engine api to WWW, I've created a mimicked, software only, event driven engine with observables.
                  </i>
                </p>
              </Col>
            </Row>

            <Row className="p-0 m-0">
              <Col className="col-12">
                <h6 className="text-left">Firmware</h6>
                <p className="small text-left">Standard Arduino C for all microprocessors.</p>
              </Col>
            </Row>
          </Container>
        </Row>

        <Row id="electronics" className="p-0 m-0">
          <h3 style={{ color: '#ffffff' }}>Electronics</h3>
          <Container className="p-0 m-0">
            <Row id="electronics-encoder-optical-360" className="m-0 mb-2 p-0">
              <Col className="col-md-2 col-4 p-0 m-0">
                <img src={`${assets}/images/Optical-Endstop-Switch.webp`} style={{ width: 'auto', height: '100px', borderRadius: '8px' }} />
              </Col>
              <Col className="col-md-10 col-8 p-0 m-0">
                <h6 className="text-left">360° EndStop Sensor</h6>
                <p className="small text-left m-0 p-0">
                  Blasini Endstop
                  <br />
                  Repurposed to signal on passing 360° gap on codewheel.
                </p>
              </Col>
            </Row>

            <Row id="electronics-encoder-optical-60" className="m-0 mb-2 p-0">
              <Col className="col-md-2 col-4 p-0 m-0">
                <img src={`${assets}/images/Optical-Endstop-Switch.webp`} style={{ width: 'auto', height: '100px', borderRadius: '8px' }} />
              </Col>
              <Col className="col-md-10 col-8 p-0 m-0">
                <h6 className="text-left">60° EndStop Sensor</h6>
                <p className="small text-left">
                  Blasini Endstop
                  <br />
                  Repurposed to signal on passing 60° gaps on codewheel.
                </p>
              </Col>
            </Row>

            <Row id="electronics-encoder-reflective" className="m-0 mb-2 p-0">
              <Col className="col-md-2 col-4 p-0 m-0">
                <img
                  src={`${assets}/images/CJMU-83 AEDR-8300 Reflective-Optical-Encoder.webp`}
                  style={{ width: 'auto', height: '100px', borderRadius: '8px' }}
                />
              </Col>
              <Col className="col-md-10 col-8 p-0 m-0">
                <h6 className="text-left">Reflective Encoder</h6>
                <p className="small text-left">
                  CJMCU-83 Reflective Optical Encoder
                  <br />
                  Originally intended encoding codewheel on paper though surface needs to be reflective. Ended up 3d printing a mask backed by
                  tinfoil.
                </p>
              </Col>
            </Row>

            <Row id="electronics-encoder-signal-processing" className="m-0 mb-2 p-0">
              <Col className="col-md-2 col-4 p-0 m-0">
                <img src={`${assets}/images/ATmega328P-Nano-V3.webp`} style={{ width: 'auto', height: '100px', borderRadius: '8px' }} />
              </Col>
              <Col className="col-md-10 col-8 p-0 m-0">
                <h6 className="text-left">Encoder Processing</h6>
                <p className="small text-left">
                  ATmega328P Nano V3
                  <br />
                  Process signals generated by encoders and, via SPI, transmit crankshaft rotational angle to PWM processor.
                </p>
              </Col>
            </Row>

            <Row id="electronics-pwm-processing" className="m-0 mb-2 p-0">
              <Col className="col-md-2 col-4 p-0 m-0">
                <img src={`${assets}/images/ATmega328P-Nano-V3.webp`} style={{ width: 'auto', height: '100px', borderRadius: '8px' }} />
              </Col>
              <Col className="col-md-10 col-8 p-0 m-0">
                <h6 className="text-left">PWM Processing</h6>
                <p className="small text-left">
                  ATmega328P Nano V3
                  <br />
                  Given rotational angle and duty-cycle, determines timing and shape of PWM signal for coils.
                </p>
              </Col>
            </Row>

            <Row id="electronics-api-processing" className="m-0 mb-2 p-0">
              <Col className="col-md-2 col-4 p-0 m-0">
                <img src={`${assets}/images/NodeMcu-Lua-ESP8266.webp`} style={{ width: 'auto', height: '100px', borderRadius: '8px' }} />
              </Col>
              <Col className="col-md-10 col-8 p-0 m-0">
                <h6 className="text-left">API Processing</h6>
                <p className="small text-left">
                  NodeMcu Lua ESP8266
                  <br />
                  Communicates via UART, receiving sensor metrics and transmitting duty-cycle.
                  <br />
                  Communicates via websockets, transmitting sensor metrics and receiving duty-cycle.
                </p>
              </Col>
            </Row>

            <Row id="electronics-mosfet" className="m-0 mb-2 p-0">
              <Col className="col-md-2 col-4 p-0 m-0">
                <img src={`${assets}/images/IRFZ44N-NChannel-Mosfet.webp`} style={{ width: 'auto', height: '100px', borderRadius: '8px' }} />
              </Col>
              <Col className="col-md-10 col-8 p-0 m-0">
                <h6 className="text-left">IRFZ44N N-Channel</h6>
                <p className="small text-left">Amplifies 5V PWM signal to 24V for 12V Coils.</p>
              </Col>
            </Row>

            <Row id="electronics-coil" className="m-0 mb-2 p-0">
              <Col className="col-md-2 col-4 p-0 m-0">
                <img src={`${assets}/images/DC-12V-5N-10mm-PushPull-Solenoid.webp`} style={{ width: 'auto', height: '100px', borderRadius: '8px' }} />
              </Col>
              <Col className="col-md-10 col-8 p-0 m-0">
                <h6 className="text-left">DC 12V 5N/10mm Push Pull Solenoid</h6>
                <p className="small text-left">PWM controlled solenoid for driving crankshaft.</p>
              </Col>
            </Row>

            <Row id="electronics-current" className="m-0 mb-2 p-0">
              <Col className="col-md-2 col-4 p-0 m-0">
                <img
                  src={`${assets}/images/GY-INA219-I2C-Digital-Current-Sensor.webp`}
                  style={{ width: 'auto', height: '100px', borderRadius: '8px' }}
                />
              </Col>
              <Col className="col-md-10 col-8 p-0 m-0">
                <h6 className="text-left">GY-INA219 I2C Digital Current Sensor</h6>
                <p className="small text-left">Measures power consumption of each coil.</p>
              </Col>
            </Row>

            <Row id="electronics-thermistor" className="m-0 mb-2 p-0">
              <Col className="col-md-2 col-4 p-0 m-0">
                <img src={`${assets}/images/NTC-MK2a-1percent-Thermistor.webp`} style={{ width: 'auto', height: '100px', borderRadius: '8px' }} />
              </Col>
              <Col className="col-md-10 col-8 p-0 m-0">
                <h6 className="text-left">NTC-NK2a Thermistor</h6>
                <p className="small text-left">Measures temperature of each coil.</p>
              </Col>
            </Row>
            <Row id="electronics-null" className="mb-1 p-0 m-0">
              <Col className="col-12">&nbsp;</Col>
            </Row>
          </Container>
        </Row>
      </Container>
    </Container>
  );
};
