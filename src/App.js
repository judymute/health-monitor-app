import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import UserDashboard from './UserDashboard';
import QuestionnaireContainer from './QuestionnaireContainer'; // Assuming you created this

function App() {
  // State to store user data and track if questionnaire is completed
  const [userData, setUserData] = useState(null);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);

  // Function to handle saving user data from questionnaire
  const handleSaveUserData = (data) => {
    setUserData(data);
    setIsQuestionnaireCompleted(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
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
          
          {/* Default route - redirect to questionnaire or dashboard */}
          <Route 
            path="*" 
            element={
              isQuestionnaireCompleted ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/questionnaire" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;