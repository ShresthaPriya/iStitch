import React from "react";
import "../styles/Footer.css"; 

const Footer = () => (
  <footer className="footer">
    <div>
      <ul>
        <li>About Us</li>
        <li>Contact Us</li>
        <li>FAQs</li>
        <li>Terms and Conditions</li>
      </ul>
    </div>
    <div className="payments">We accept: <span>💳</span></div>
  </footer>
);

export default Footer;
