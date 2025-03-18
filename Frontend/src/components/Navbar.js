"use client"; // Add this line at the top

import React, { useState } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import "../styles/Navbar.css"

const Navbar = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  console.log("line 12: Session:  ",session)

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const AUTHENTIK_LOGOUT_URL = "http://localhost:9000/application/o/portfolio/end-session/?redirect_uri=http://localhost:3000/login";

  const handleFullLogout = async () => {
    await signOut({ redirect: false });  // Remove NextAuth session
    window.location.href = AUTHENTIK_LOGOUT_URL;  // Redirect to Authentik logout
  };
  


  if(session){
    return (
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>
          <Link href="/">PortfolioView</Link>
        </div >
        <ul className="ul-choices-group" style={styles.navMenu}>
          <li style={styles.navItem}>
            <Link href="/">Home</Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/about">About</Link>
          </li>
          <li style={styles.navItem} onMouseEnter={handleDropdown} onMouseLeave={handleDropdown}>
            <span style={styles.navLink}>Account</span>
            {showDropdown && (
              <ul style={styles.dropdownMenu}>
                <li style={styles.dropdownItem}>
                  <Link href="/login">My Account</Link>
                </li>
                <li style={styles.dropdownItem}>
                  {/* <button onClick={() => signOut({ callbackUrl: "http://localhost:3000/login" })}>Log out</button> */}
                  <button onClick={handleFullLogout}>Logout</button>;
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    );
  }else{
    return (
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>
          <Link href="/">Porofolio View</Link>
        </div>
        <ul style={styles.navMenu}>
          <li style={styles.navItem}>
            <Link href="/">Home</Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/about">About</Link>
          </li>
          <li style={styles.navItem}>
          <Link href="/login">Log in</Link>
          </li>
        </ul>
      </nav>
    );
  }

  
};

// Basic inline styles for demonstration
const styles = {
  navbar: {
    position: 'fixed',
    top: '0%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#06347d',
    padding: '10px 20px',
    color: '#fff',
    zIndex: 1000,
  },
  navLogo: {
    fontSize: '1.5rem',
  },
  navMenu: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
  },
  navItem: {
    position: 'relative',
  },
  navLink: {
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#444',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: '10px 20px',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default Navbar;
