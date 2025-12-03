'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Nav, Navbar, Container, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom sticky-top py-3">
      <Container>
        <Navbar.Brand className="fw-bold fs-4 me-5">
          Admin Foma
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-nav" />
        <Navbar.Collapse id="admin-nav">
          <Nav className="me-auto gap-2">

            <Link href="/admin" passHref legacyBehavior>
              <Nav.Link className={`custom-nav-link ${isActive('/admin') ? 'active' : ''}`}>Dashboard</Nav.Link>
            </Link>

            <Link href="/admin/users" passHref legacyBehavior>
              <Nav.Link className={`custom-nav-link ${isActive('/admin/users') ? 'active' : ''}`}>Users</Nav.Link>
            </Link>

            <Link href="/admin/content" passHref legacyBehavior>
              <Nav.Link className={`custom-nav-link ${isActive('/admin/content') ? 'active' : ''}`}>Content</Nav.Link>
            </Link>

          </Nav>

          <Nav>
            <Link href="/" passHref legacyBehavior>
              <Nav.Link className="text-danger fw-bold">Kembali ke Situs</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cek session dari localStorage
    const checkAuth = () => {
      try {
        const sessionData = localStorage.getItem('userSession');

        if (!sessionData) {
          // Tidak ada session, redirect ke login
          router.push('/Login');
          return;
        }

        const session = JSON.parse(sessionData);

        if (session.isLoggedIn && session.role === 'admin') {
          // User adalah admin, izinkan akses
          setIsAuthorized(true);
        } else {
          // Bukan admin, redirect ke login
          router.push('/Login');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/Login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Tampilkan loading saat melakukan pengecekan
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  // Jika tidak authorized, jangan render apapun (akan redirect)
  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <AdminNavbar />

      {/* Container Utama */}
      <Container className="py-4">
        <main>
          {children}
        </main>
      </Container>

      <style jsx global>{`
        :root {
          --primary-color: #c7d6d5;
          --secondary-color: #0c120c;
          --white-color: #ecebf3;
          --error-red: #c20114;
          --admin-bg: #b8c5c4; 
        }
        body {
          font-family: 'Poppins', sans-serif;
          background-color: var(--admin-bg) !important;
          color: var(--secondary-color) !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .custom-nav-link {
          font-weight: 500;
          padding: 0.5rem 1.2rem !important;
          border-radius: 50px;
          color: #6D7275 !important;
        }
        .custom-nav-link.active {
          background-color: var(--error-red) !important;
          color: white !important;
          box-shadow: 0 4px 10px rgba(194, 1, 20, 0.2);
        }
        .card {
          background-color: var(--white-color);
          border-radius: 12px;
          border: none;
        }
      `}</style>
    </>
  );
}