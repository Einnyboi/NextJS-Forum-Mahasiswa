'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Search, Github as User, LogOut, History } from 'lucide-react';

function AppNavbar() 
{
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status on mount
    useEffect(() => {
        const checkAuth = () => {
            const session = typeof window !== 'undefined' ? localStorage.getItem('userSession') : null;
            setIsLoggedIn(!!session);
        };
        
        checkAuth();
    }, []);

    const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.preventDefault();
        router.push('/login');
    }

    const handleSignupClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push('/signup');
    }

    const handleLogout = () => {
        localStorage.removeItem('userSession');
        window.location.href = '/';
    };

    const checking = () =>
    {
        if (isLoggedIn)
        {
            return (
                <Nav className="my-2 my-lg-0 profile-dropdown-toggle">
                    <NavDropdown 
                        title="User" 
                        id="navbarScrollingDropdown" 
                        align="end"
                    >
                        <NavDropdown.Item href="/profile">
                            <User size={18} className="me-2" />
                            Profile
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/user-history">
                            <History size={18} className="me-2" />
                            History
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item 
                            as="button" 
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLogout();
                            }}
                            type="button"
                        >
                            <LogOut size={18} className="me-2" />
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            );
        }
        else {
            return (
                <Nav className="d-flex align-items-center signin">
                    <Button
                        className='lgnBtn'
                        onClick={handleLoginClick}
                    >
                        Login
                    </Button>
                    <Button
                        className='lgnBtn'
                        onClick={handleSignupClick}
                    >
                        Sign Up
                    </Button>
                </Nav>
            );
        }
    };

    return (
        <>
            <Navbar expand="lg" className='navigation'>
                <Container fluid>
                    <Navbar.Brand
                        href='#'
                        className="navi-title"
                    >
                        Foma
                    </Navbar.Brand>

                    <Form className="d-flex search">
                        <Form.Control
                            type="search"
                            placeholder="Searching for something?"
                            className="me-0"
                            aria-label="Search"
                        />
                        <Button variant="outline-success" className="search-button p-2 flex items-center justify-center" style={{ width: '40px' }}>
                            <Search size={25} />
                        </Button>
                    </Form>

                    {checking()}
                </Container>
            </Navbar>

            <style jsx global>
                {`
                body
                {
                    padding-top: 80px !important;
                }

                .navigation
                {
                    background: var(--white-color) !important;
                    padding: 1rem 2rem;
                    box-shadow: 0 2px 20px var(--shadow-color);
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 75px; 
                    z-index: 1000;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                }
                
                /* Title/Brand */
                .navi-title
                {
                    font-size: var(--h2-size);
                    font-weight: 700;
                    color: var(--secondary-color);
                    margin-right: 2rem;
                }

                /* Search Bar Container */
                .search
                {
                    flex-grow: 1;
                    max-width: 500px;
                    display: flex;
                    align-items: center;
                    border-radius: 50px;
                    overflow: hidden;
                    background-color: var(--primary-color);
                    border: 1px solid var(--border-color);
                }

                /* Search Input Field */
                .search .form-control
                {
                    border: none !important;
                    box-shadow: none !important;
                    background-color: transparent !important;
                    padding: 0.75rem 1rem;
                    height: auto;
                    font-size: 0.95rem;
                    color: var(--secondary-color);
                }

                .search .form-control::placeholder
                {
                    color: var(--placeholder-color);
                }

                /* Search Button */
                .search-button
                {
                    color: var(--secondary-color) !important;
                    border-radius: 0 !important;
                    border-color: transparent;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .signin
                {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    position: relative;
                }

                .lgnBtn
                {
                    padding: 0.5rem 0.2rem;
                    border-radius: 50px;
                    font-size: var(--p-size);
                    text-decoration: none;
                    min-width: 90px;
                    display: inline-block;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .lgnBtn
                {
                    background-color: transparent;
                    color: var(--secondary-color);
                    border: 2px solid var(--primary-color);
                }

                .lgnBtn:hover
                {
                    background-color: var(--primary-color);
                    color: var(--secondary-color);
                    border: 2px solid var(--primary-color);
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }

                /* Profile Dropdown Toggle */
                .profile-dropdown-toggle .dropdown-toggle
                {
                    font-weight: 500;
                    color: var(--secondary-color);
                    border: 1px solid var(--border-color);
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }
                
                .profile-dropdown-toggle .dropdown-toggle:hover
                {
                    background-color: var(--primary-color);
                }

                /* Dropdown Menu Styling */
                .profile-dropdown-toggle .dropdown-menu
                {
                    background: var(--white-color);
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(12, 18, 12, 0.15);
                    min-width: 200px;
                    z-index: 1001;
                    border: 1px solid var(--border-color);
                    margin-top: 0.75rem !important;
                    padding: 0.5rem 0;
                }

                /* Dropdown Item Styling */
                .profile-dropdown-toggle .dropdown-item
                {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    padding: 0.8rem 1.2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: var(--secondary-color);
                    text-decoration: none;
                    border-radius: 12px;
                    margin: 0.2rem 0.5rem;
                    font-weight: 500;
                }

                .profile-dropdown-toggle .dropdown-item:hover
                {
                    background: var(--primary-color);
                    color: var(--secondary-color);
                }

                /* Responsivenes */
                @media (max-width: 992px)
                {
                    .navigation
                    {
                        padding: 0.75rem 1rem;
                        height: auto;
                    }
                    .search
                    {
                        width: 100%;
                        max-width: none;
                        order: 3;
                        margin-top: 0.5rem;
                    }
                    .navbar-collapse
                    {
                        order: 4;
                    }
                    .navbar-toggler
                    {
                        margin-right: 0.5rem;
                    }
                }
            `}
            </style>
        </>
    )
}

export default AppNavbar;