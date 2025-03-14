"use client"; // Add this line at the top

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
        <li style={styles.navItem} onMouseEnter={handleDropdown} onMouseLeave={handleDropdown}>
          <span style={styles.navLink}>Services</span>
          {showDropdown && (
            <ul style={styles.dropdownMenu}>
              <li style={styles.dropdownItem}>
                <Link href="/services/design">Design</Link>
              </li>
              <li style={styles.dropdownItem}>
                <Link href="/services/development">Development</Link>
              </li>
              <li style={styles.dropdownItem}>
                <Link href="/services/marketing">Marketing</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
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
    backgroundColor: '#333',
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
