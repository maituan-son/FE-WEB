import React from 'react'

const Footer = () => {
  return (
    <div> <footer className="footer">
    <div className="footer-container">
      {/* Cột 1: Logo và Địa chỉ */}
      <div className="footer-column">
        <h2 className="footer-logo">Funiro.</h2>
        <p className="footer-address">
          400 University Drive Suite 200 Coral <br />
          Gables,
          <br />
          FL 33134 USA
        </p>
      </div>
      {/* Cột 2: Links */}
      <div className="footer-column">
        <h3 className="footer-heading">Links</h3>
        <ul className="footer-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/shop">Shop</a>
          </li>
          <li>
            <a href="/blog">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>
      {/* Cột 3: Help */}
      <div className="footer-column">
        <h3 className="footer-heading">Help</h3>
        <ul className="footer-links">
          <li>
            <a href="#">Payment Options</a>
          </li>
          <li>
            <a href="#">Returns</a>
          </li>
          <li>
            <a href="#">Privacy Policies</a>
          </li>
        </ul>
      </div>
      {/* Cột 4: Newsletter */}
      <div className="footer-column">
        <h3 className="footer-heading">Newsletter</h3>
        <form className="footer-newsletter">
          <input
            type="email"
            placeholder="Enter Your Email Address"
            required=""
          />
          <button type="submit">SUBSCRIBE</button>
        </form>
      </div>
    </div>
    {/* Copyright */}
    <div className="footer-copyright">
      <p>2023 Funiro. All rights reserved</p>
    </div>
  </footer></div>
  )
}

export default Footer