import React, { useState } from 'react';
import SectionContent from './SectionContent';
import './Hero.css';

const Student = () => {
  const [activeSection, setActiveSection] = useState('Account');

  const sections = ['Account', 'Academics', 'Progress'];

  return (
    <div className="hero-container">
      <div className="sidebar">
        <h2>Student Panel</h2>
        <ul>
          {sections.map(section => (
            <li
              key={section}
              className={activeSection === section ? 'active' : ''}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </li>
          ))}
        </ul>
      </div>

      <div className="content-area">
        <SectionContent section={activeSection} />
      </div>
    </div>
  );
};

export default Student;
