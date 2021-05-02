/**
 * bootstrap themes thru bootswatch
 * cerulean, cosmo, cyborg, darkly, flatly, journal, litera,
 * lumen, lux, materia, minty, pulse, sandstone, simplex,
 * sketchy, slate, solar, spacelab, superhero, united, yeti
 */
import 'bootswatch/dist/solar/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import './styles/App.scss';
import MainNavigation from './components/MainNavigation';
import Console from './components/Console';
import About from './components/About';
import NotFound from './components/NotFound';

function App() {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;

  return (
    <Router className="App">
      <MainNavigation />
      <Container className="content">
        <Switch>
          <Route exact path={`${path}/about`} component={About} />
          <Route exact path={`${path}/console`} component={Console} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
