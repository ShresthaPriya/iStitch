import React from "react";
import "../styles/Footer.css"; 
import { Icon } from "lucide-react";

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <ul>
          <li>About Us</li>
          <li>Contact Us</li>
          <li>FAQs</li>
          <li>Terms and Conditions</li>
        </ul>
      </div>
      <div className="footer-section contact-info">
        <p>Email us: istitch@gmail.com </p>
        <p>Phone : +977 9810657787</p>
      </div>
      <div className="footer-section payments">
        <p>We accept: <span>💳</span></p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2023 iStitch. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
