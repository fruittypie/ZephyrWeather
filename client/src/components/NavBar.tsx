import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const MyNavbar: React.FC = () => {
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/map">Map</Nav.Link>
          <Nav.Link href="/news">News</Nav.Link>
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;





