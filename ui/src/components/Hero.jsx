import React from 'react';

const backgroundImageUrl = "https://twocircles.net/wp-content/uploads/2021/09/Dalit-Children.jpeg"; // Replace with your image URL

const Hero = () => {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '70vh',
        width: '100%',
        overflow: 'hidden',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        color: '#fff',
        textShadow: '0 2px 8px rgba(0,0,0,0.7)',
        padding: '4rem 1rem 2rem 1rem',
        background: 'rgba(0,0,0,0.3)', // Optional: dark overlay for readability
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, textAlign: 'center' }}>
          Visions Global Empowerment India ("Visions India")
        </h1>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 400, marginBottom: '2rem', maxWidth: 700, textAlign: 'center' }}>
          A nonprofit organization committed to implementing meaningful education & community development efforts for under-served populations through
        </h2>
        <div style={{ fontSize: '1.1rem', letterSpacing: 2, fontWeight: 600, textAlign: 'center' }}>
          EDUCATION &nbsp; * &nbsp; LEADERSHIP &nbsp; * &nbsp; TECHNOLOGY &nbsp; * &nbsp; HEALTH
        </div>
      </div>
    </div>
  );
};

export default Hero;