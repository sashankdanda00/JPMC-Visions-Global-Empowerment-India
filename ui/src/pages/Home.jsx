import React from 'react';
import Campaign from '../components/Campaign.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Hero from '../components/Hero.jsx';
import Chatting from '../components/Chatting.jsx'; // Import Chatting
const Home = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Navbar />
      <div id="home"><Hero /></div>
      <div id="campaign"><Campaign /></div>
      <div id="about"><Footer /></div>
      {/* Sticky Chatbot */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <Chatting />
      </div>
    </div>
  );
};
export default Home;