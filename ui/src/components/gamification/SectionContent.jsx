import React from 'react';
import AccountDetails from './AccountDetails';
import Progress from './Progress';
// import Academics from './Academics'; // You can add this when it's ready

const SectionContent = ({ section }) => {
  switch (section) {
    case 'Account':
      return <AccountDetails />;

    case 'Progress':
      return <Progress />;

    // case 'Academics':
    //   return <Academics />;

    default:
      return (
        <div className="default-section">
          <h2>📘 Welcome</h2>
          <p>Please select a section from the left to view your details.</p>
        </div>
      );
  }
};

export default SectionContent;
