import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
  return (
    <Navbar bg="light" data-bs-theme="light" className='shadow-sm'>
        <Container>
          <Navbar.Brand href="/">Epimetheus</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/tutorial">Tutorial</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  )
}

export default Header
