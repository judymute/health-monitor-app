import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/questionnaire');
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="icon-container float-animation">
          <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z" fill="#e8f5e9"/>
            <path d="M65 85C72.1797 85 78 79.1797 78 72C78 64.8203 72.1797 59 65 59C57.8203 59 52 64.8203 52 72C52 79.1797 57.8203 85 65 85Z" fill="#4caf50"/>
            <path d="M135 85C142.18 85 148 79.1797 148 72C148 64.8203 142.18 59 135 59C127.82 59 122 64.8203 122 72C122 79.1797 127.82 85 135 85Z" fill="#4caf50"/>
            <path d="M100 140C117.673 140 132 128.673 132 115C132 101.327 117.673 90 100 90C82.327 90 68 101.327 68 115C68 128.673 82.327 140 100 140Z" fill="#66bb6a"/>
            <path d="M85 75C88.866 75 92 71.866 92 68C92 64.134 88.866 61 85 61C81.134 61 78 64.134 78 68C78 71.866 81.134 75 85 75Z" fill="white"/>
            <path d="M115 75C118.866 75 122 71.866 122 68C122 64.134 118.866 61 115 61C111.134 61 108 64.134 108 68C108 71.866 111.134 75 115 75Z" fill="white"/>
          </svg>
        </div>
        <h1>Welcome to Hen Care</h1>
        <p>Track your health goals, monitor your progress, and achieve a healthier lifestyle with our cute and fun app!</p>
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