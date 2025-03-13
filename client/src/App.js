import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import UserDashboard from './UserDashboard';
import QuestionnaireContainer from './QuestionnaireContainer';
import LandingPage from './LandingPage';
import Chatbot from './Chatbot';

function App() {
  // State to store user data and track if questionnaire is completed
  const [userData, setUserData] = useState(null);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  // Function to handle saving user data from questionnaire
  const handleSaveUserData = (data) => {
    setUserData(data);
    setIsQuestionnaireCompleted(true);
  };

  useEffect(() => {
    // Fetch user data when the app loads
    setLoading(true);
    fetch('http://localhost:3001/api/getUserProfile')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Retrieved user data:', data);
        setUserData(data);
        
        // Check if user has completed the questionnaire (for example, if they have a name)
        if (data.basicInformation?.fullName) {
          setIsQuestionnaireCompleted(true);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        // If there's an error (like user not found), still set loading to false
        setLoading(false);
      });
  }, []);

  // Show loading indicator while fetching data
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* New route for the landing page */}
          <Route 
            path="/" 
            element={<LandingPage />} 
          />
          
          {/* Route for the questionnaire */}
          <Route 
            path="/questionnaire" 
            element={
              <QuestionnaireContainer 
                onComplete={handleSaveUserData} 
                userData={userData}
              />
            } 
          />
          
          {/* Route for the dashboard - protected, requires completed questionnaire */}
          <Route 
            path="/dashboard" 
            element={
              isQuestionnaireCompleted ? 
                <UserDashboard userData={userData} /> : 
                <Navigate to="/questionnaire" replace />
            } 
          />
          
          {/* Default route - redirect to landing page */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
        <Chatbot/>
      </div>
    </Router>
  );
}

export default App;