import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/questionnaire');
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to Our Platform</h1>
        <p>Complete a short questionnaire to get started with your personalized experience.</p>
        <button 
          className="get-started-button"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default LandingPage;