'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Search, Github as User, LogOut, History } from 'lucide-react';

interface AppNavbarProps
{
    onNavChange: (view: string) => void;
    isLoggedIn: boolean;
    hideSearchInput?: boolean; 
}

function AppNavbar({ onNavChange, isLoggedIn, hideSearchInput = false }: AppNavbarProps) 
{
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search`);
        }
    };
    type SearchInputEvent = MouseEvent<FormControlElement> | FocusEvent<FormControlElement>;
    const handleSearchAction = (e: SearchInputEvent) => {
        // Pastikan kita menggunakan router dan belum berada di halaman '/search'
        if (router && !pathname.startsWith('/search')) {
            // Navigasi ke halaman /search TANPA query (?q=)
            router.push('/search');
        }
    };

    const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.preventDefault();
        onNavChange('login'); 
    }

    const handleSignupClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onNavChange('signup');
    }

    const handleLogout = () =>
    {
        localStorage.removeItem('userSession');
        window.location.href = '/';
    };

    const desktopAuthContent = () =>
    {
        if (isLoggedIn)
        {
            return (
                <NavDropdown 
                    title="User" 
                    id="navbarScrollingDropdown" 
                    align="end"
                    className="profile-dropdown-toggle"
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
            );
        }
        else
        {
            return (
                <div className="d-flex align-items-center signin"> 
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
                </div>
            );
        }
    };
    
    const mobileAuthContent = () =>
    {
        if (isLoggedIn)
        {
            return (
                <Nav className="mobile-auth-section w-100 py-2">
                    <Nav.Link href="/profile" className="mobile-profile-link">
                        <User size={18} className="me-2" />
                        Profile
                    </Nav.Link>
                    <Nav.Link href="/user-history" className="mobile-profile-link">
                        <History size={18} className="me-2" />
                        History
                    </Nav.Link>
                    <Nav.Link 
                        as="button"
                        onClick={handleLogout}
                        className="mobile-profile-link logout"
                    >
                        <LogOut size={18} className="me-2" />
                        Logout
                    </Nav.Link>
                </Nav>
            );
        }
        else {
            return (
                <div className="d-flex flex-column signin-mobile p-3 w-100">
                    <Button 
                        className='lgnBtn mb-2'
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
                </div>
            );
        }
    };

    return (
        <>
            <Navbar expand="lg" className='navigation'>
                <Container fluid className='d-flex align-items-center **justify-content-between**'> 
                    <Navbar.Brand
                        href='/'
                        className="navi-title"
                    >
                        Foma
                    </Navbar.Brand>

                    {!hideSearchInput &&(
                        <Form className="d-flex search" 
                            onSubmit={(e) => { 
                                e.preventDefault(); 
                                // Jika pengguna mengisi teks dan menekan Enter, bawa query-nya
                                const trimmedQuery = searchQuery.trim();
                                if (router) {
                                    if (trimmedQuery !== '') {
                                        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
                                    } else {
                                        router.push('/search');
                                    }
                                }
                            }}
                        >
                            <Form.Control
                                type="search"
                                placeholder="Searching for something?"
                                className="me-0"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={handleSearchAction}
                                onFocus={handleSearchAction}
                            />
                            <Button 
                                type="submit"
                                variant="outline-success" 
                                className="search-button p-2 flex items-center justify-center" 
                                style={{ width: '40px' }}
                            >
                                <Search size={25} />
                            </Button>
                        </Form>
                    )}
                    
                    {checking()}
                </Container>

                <Navbar.Collapse id="navbarScroll" className="navbar-menu-mobile">
                    <Container fluid className="px-lg-0">
                        <div className="d-lg-none mobile-auth-wrapper">
                            {mobileAuthContent()} 
                        </div>
                    </Container>
                </Navbar.Collapse>
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
                    padding: 0.5rem 2rem;
                    box-shadow: 0 2px 20px var(--shadow-color);
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    min-height: 75px; 
                    z-index: 1000;
                    border-bottom: 1px solid var(--border-color);
                }
                
                /* Title Brand */
                .navi-title
                {
                    font-size: var(--h3-size);
                    font-weight: 700;
                    color: var(--secondary-color);
                    white-space: nowrap;
                }

                /* Search Bar Container PC */
                .search
                {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    border-radius: 50px;
                    overflow: hidden;
                    background-color: var(--primary-color);
                    border: 1px solid var(--border-color);
                }

                /* Search Bar Container Mobile */
                .search-mobile
                {
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    border-radius: 50px;
                    overflow: hidden;
                    background-color: var(--primary-color);
                    border: 1px solid var(--border-color);
                }

                /* Search Input Field */
                .search .form-control, .search-mobile .form-control
                {
                    border: none !important;
                    box-shadow: none !important;
                    background-color: transparent !important;
                    padding: 0.5rem 1rem;
                    font-size: 0.9rem;
                    color: var(--secondary-color);
                    min-width: 0;
                    height: auto;
                }

                .search .form-control::placeholder, .search-mobile .form-control::placeholder
                {
                    color: var(--placeholder-color);
                }

                /* Search Button */
                .search-button
                {
                    color: var(--secondary-color) !important;
                    border-radius: 0 !important;
                    border-color: transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                /* Navbar Collapse on Mobile (the dropdown container) */
                .navbar-menu-mobile {
                    width: 100%;
                    background: var(--white-color);
                    border-top: 1px solid var(--border-color);
                }
                
                .navbar-collapse
                {
                    flex-basis: auto;
                    flex-grow: 0;
                    align-items: center;
                }

                /* Login/Signup Buttons (Desktop) */
                .signin
                {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                    justify-content: flex-end;
                    width: 100%;
                    position: relative;
                }

                .lgnBtn
                {
                    padding: 0.5rem 0.2rem;
                    border-radius: 50px;
                    min-width: 90px;
                    font-size: var(--p-size);
                    text-decoration: none;
                    text-align: center;
                    transition: all 0.3s ease;
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
                    width: 100%;
                    text-align: right;
                }
                
                .profile-dropdown-toggle .dropdown-toggle:hover
                {
                    background-color: var(--primary-color);
                }

                /* Dropdown Menu Styling (Desktop) */
                .profile-dropdown-toggle .dropdown-menu
                {
                    background: var(--white-color);
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(12, 18, 12, 0.15);
                    min-width: 200px;
                    z-index: 1001;
                    border: 1px solid var(--border-color);
                    margin-top: 1rem !important;
                    padding: 0.8rem 0;
                    position: absolute;
                }

                /* Dropdown Item Styling (Desktop) */
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

                /* Responsivenes */
                @media (max-width: 992px)
                {
                    .navigation
                    {
                        padding: 0.75rem 1rem;
                        height: auto;
                        flex-direction: column; 
                    }
                    .navigation .container-fluid
                    {
                        padding: 0;
                        flex-wrap: nowrap;
                    }
                    .navi-title
                    {
                        font-size: var(--h4-size);
                    }
                    .navigation .container-fluid > div:nth-child(3)
                    { 
                        flex-basis: auto;
                        flex-grow: 1;
                        justify-content: flex-end;
                        align-items: center;
                    }
                    .navbar-collapse
                    {
                        width: 100%;
                        flex-basis: 100%;
                        margin-top: 0;
                        order: 2; /* Put the menu below the main row */
                    }
                    .search-mobile
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