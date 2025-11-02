'use client'
import { use } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function navbar()
{
    return (
        <Navbar expand="lg" className='bg-body'>
            <Container fluid>
                <Navbar.Toggle
                    as={Navbar.Brand}
                    href='#'
                    aria-controls='navbarScroll'
                    className="d-lg-none border-0"
                >
                    Foma
                </Navbar.Toggle>

                <Navbar.Brand
                    href='#'
                    className="d-none d-lg-block"
                >
                    Foma
                </Navbar.Brand>

                <Navbar.Collapse id='navbarScroll'>
                    <Nav
                        className='me-auto my-2 my-lg-0'
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#community">Community</Nav.Link>
                        <Nav.Link href="#event">Event</Nav.Link>
                    </Nav>
                </Navbar.Collapse>

                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                    >
                    </Form.Control>
                    <Button variant="outline-success">Search</Button>
                </Form>

                <NavDropdown title="User" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="profile.tsx">Profile</NavDropdown.Item>
                    <NavDropdown.Item href="history.tsx">History</NavDropdown.Item>
                    <NavDropdown.Divider></NavDropdown.Divider>
                    <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
                </NavDropdown>
            </Container>
        </Navbar>
    )
}

export default navbar;