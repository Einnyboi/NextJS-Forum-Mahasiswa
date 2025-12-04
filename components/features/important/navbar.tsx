'use client'
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Search, Github as User, LogOut, History, Menu, X } from 'lucide-react';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;
type SearchInputEvent = React.MouseEvent<FormControlElement> | React.FocusEvent<FormControlElement>;

interface AppNavbarProps
{
    onNavChange: (view: string) => void;
    isLoggedIn: boolean;
}

function AppNavbar({ onNavChange, isLoggedIn }: AppNavbarProps) 
{
    const router = useRouter();
    const pathname = usePathname(); // Get current path
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        const trimmedQuery = searchQuery.trim();
        if (router) {
            if (trimmedQuery !== '') {
                router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
            } else {
                // If search is empty, just navigate to the search page
                router.push('/search');
            }
        }
    };

    const handleSearchAction = (e: SearchInputEvent) => {
        // Navigates to the search page immediately on click/focus
        if (router && !pathname.startsWith('/search')) {
            router.push('/search');
        }
    };
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.preventDefault();
        onNavChange('login'); 
    }

    const handleSignupClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.preventDefault();
        onNavChange('signup');
    }

    const handleLogout = () => {
        localStorage.removeItem('userSession');
        window.location.href = '/';
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        handleLogout();
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
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
                            onClick={handleLogoutClick}
                            type="button"
                        >
                            <LogOut size={18} className="me-2" />
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            );
        }
        else
        {
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
                        href='/'
                        className="navi-title me-3"
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

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="logout-modal-overlay" onClick={cancelLogout}>
                    <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={cancelLogout}>
                            <X size={20} />
                        </button>
                        <h3>Leaving the conversation early?</h3>
                        <p>Are you sure you want to log out? We'll miss you!</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={cancelLogout}>
                                Stay
                            </button>
                            <button className="btn-logout" onClick={confirmLogout}>
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
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
                    width: 100%;
                    max-width: 500px;
                    display: flex;
                    align-items: center;
                    border-radius: 50px;
                    overflow: hidden;
                    background-color: var(--primary-color);
                    border: 1px solid var(--border-color);
                }

                /* Search Bar */
                .search-mobile
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
                    padding: 0.5rem;
                    overflow: hidden;
                }

                /* Dropdown Item Styling */
                .profile-dropdown-toggle .dropdown-item
                {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    padding: 0.8rem 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: var(--secondary-color);
                    text-decoration: none;
                    border-radius: 8px;
                    margin: 0.2rem 0;
                    font-weight: 500;
                }

                .profile-dropdown-toggle .dropdown-item:hover
                {
                    background: var(--primary-color);
                    color: var(--secondary-color);
                }

                /* --- Mobile Collapse Styles --- */
                .navbar-mobile-toggle
                {
                    /* Style the hamburger menu toggle */
                    border: 1px solid var(--border-color) !important; 
                    border-radius: 8px !important;
                    min-width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .mobile-auth-wrapper
                {
                    padding: 0.5rem 0;
                }
                .mobile-auth-section
                {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .signin-mobile
                {
                    padding: 1rem;
                }
                .signin-mobile .lgnBtn
                {
                    min-width: unset;
                    width: 100%;
                }
                
                .mobile-profile-link
                {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 1.5rem !important;
                    border-radius: 0;
                    text-decoration: none;
                    color: var(--secondary-color);
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                .mobile-profile-link:hover
                {
                    background-color: var(--primary-color);
                }

                /* Responsiveness */
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
                        width: 100%;
                        flex-basis: 100%;
                        margin-top: 0;
                        order: 2;
                        order: 4;
                    }
                    .navbar-toggler
                    {
                        margin-right: 0.5rem;
                    }
                }
                
                @media (min-width: 992px)
                {
                    .navbar-expand-lg .container-fluid
                    {
                        justify-content: space-between !important;
                        flex-wrap: nowrap !important;
                    }
                    
                    .navigation .container-fluid > div:nth-child(2)
                    {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-left: auto !important;
                        margin-right: auto !important;
                        flex-grow: 1;
                    }
                }

                /* Logout Modal Styles */
                .logout-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(12, 18, 12, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .logout-modal {
                    background: #ecebf3;
                    border-radius: 16px;
                    padding: 32px;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(12, 18, 12, 0.3);
                    position: relative;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .modal-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: transparent;
                    border: none;
                    color: #6c757d;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }

                .modal-close:hover {
                    background: #d5d4dc;
                    color: #0c120c;
                }

                .logout-modal h3 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #0c120c;
                    margin: 0 0 12px 0;
                }

                .logout-modal p {
                    color: #6c757d;
                    margin: 0 0 24px 0;
                    font-size: 1rem;
                    line-height: 1.5;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .btn-cancel,
                .btn-logout {
                    padding: 10px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }

                .btn-cancel {
                    background: white;
                    color: #0c120c;
                    border: 2px solid #d5d4dc;
                }

                .btn-cancel:hover {
                    background: #f5f5f5;
                    border-color: #c7d6d5;
                }

                .btn-logout {
                    background: #dc3545;
                    color: white;
                }

                .btn-logout:hover {
                    background: #c82333;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
                }
            `}
            </style>
        </>
    )
}

export default AppNavbar;