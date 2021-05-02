import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faTv } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav } from 'react-bootstrap';
import useStore from '../../store';

export default () => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;
  const navigation = useStore((state) => state.navigation);
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    const [{}, sub, page] = location.pathname.split('/');
    navigation.toggle(page || 'console');
  }, [location]);

  return (
    <Navbar className="MainNavigation" variant="dark" bg="dark" expand="md" fixed="top">
      <Navbar.Brand href={`http://functional.org.za`}>functional.org.za</Navbar.Brand>
      <Nav className="justify-content-left flex-row">
        <Nav.Link className={`${navigation.pages['console'].active && 'active'} ml-auto`} onClick={() => history.push(`${path}/console`)}>
          <FontAwesomeIcon icon={faTv} size="1x" />
          <span className="ml-1 d-md-inline d-none">Console</span>
        </Nav.Link>
        <Nav.Link className={`${navigation.pages['about'].active && 'active'} ml-md-0 ml-4`} onClick={() => history.push(`${path}/about`)}>
          <FontAwesomeIcon icon={faInfo} size="1x" />
          <span className="ml-1 d-md-inline d-none">About</span>
        </Nav.Link>
      </Nav>
      {/**
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className={navigation.pages['console'].active && 'active'} onClick={() => history.push('/console')}>
            <FontAwesomeIcon icon={faInfo} size="1x" />
            <span className="ml-1 d-md-inline d-none">Console</span>
          </Nav.Link>
          <Nav.Link className={navigation.pages['about'].active && 'active'} onClick={() => history.push('/about')}>
            <FontAwesomeIcon icon={faTv} size="1x" />
            <span className="ml-1 d-md-inline d-none">About</span>
          </Nav.Link>
          <NavDropdown
            className={`nav-link ${
              (navigation.pages['construction'].pages['overview'].active ||
                navigation.pages['construction'].pages['prints'].active ||
                navigation.pages['construction'].pages['electronics'].active ||
                navigation.pages['construction'].pages['code'].active) &&
              'active'
            }`}
            title="Construction"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item onClick={() => history.push('/construction/overview')}>Overview</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => history.push('/construction/prints')}>3D Print</NavDropdown.Item>
            <NavDropdown.Item onClick={() => history.push('/construction/electronics')}>Electronics</NavDropdown.Item>
            <NavDropdown.Item onClick={() => history.push('/construction/code')}>Code</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
        **/}
    </Navbar>
  );
};
