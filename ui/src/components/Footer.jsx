import React from 'react';
import './Footer.css';
import { FaFacebookSquare, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-top">
        <p className="footer-quote">
          "THE GREAT AIM OF EDUCATION IS NOT KNOWLEDGE BUT ACTION."
          <br />
          <span>~ Herbert Spencer</span>
        </p>
        <a href="#support" className="support-btn">SUPPORT OUR WORK →</a>
      </div>

      <div className="footer-bottom">
        <p className="footer-contact">
          27, Wireless Road, Kurunji Nagar West, K.K. Nagar, Trichy, Tamil Nadu - 620 021, India
          &nbsp; +91.89407.96777 &nbsp;
          visionsglobalempowermentindia@gmail.com
        </p>
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookSquare size={30} className="social-icon" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={30} className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
