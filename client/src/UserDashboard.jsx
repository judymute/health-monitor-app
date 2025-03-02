import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import DaySelector from './DaySelector';
import MealPlan from './MealPlan';

const UserDashboard = ({ userData }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [activeDay, setActiveDay] = useState(new Date().getDate());

  useEffect(() => {
    if (!userData) {
      navigate('/questionnaire');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorDetails(null);

        const response = await fetch('http://localhost:3001/api/generateMealPlan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Failed to generate meal plan');

        setRecommendations(data.mealPlan);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load your recommendations: ${err.message}`);
        setErrorDetails(err.stack || "No additional details available");
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userData, navigate]);

  const handleRetakeQuestionnaire = () => navigate('/questionnaire');

  const handleRefreshRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/generateMealPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to generate meal plan');

      setRecommendations(data.mealPlan);
      setLoading(false);
    } catch (err) {
      setError(`Failed to refresh your recommendations: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center my-5">Loading meal plan...</div>;
  if (error) return <div className="text-center my-5 text-danger">{error}</div>;

  return (
    <div className="container-fluid py-4">
      <div className="container">
        <UserProfile userData={userData} onRetake={handleRetakeQuestionnaire} />
        <DaySelector activeDay={activeDay} setActiveDay={setActiveDay} />
        <MealPlan recommendations={recommendations} />
      </div>
    </div>
  );
};

export default UserDashboard;
