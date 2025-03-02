import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = ({ userData }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    // Check if we have user data
    if (!userData) {
      navigate('/questionnaire');
      return;
    }

    // Function to fetch recommendations
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorDetails(null);
        
        console.log('Fetching meal plan recommendations...');
        
        // Call the backend API to generate meal plan
        const response = await fetch('http://localhost:3001/api/generateMealPlan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        
        // Log the status code to help diagnose issues
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to generate meal plan');
        }
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to generate meal plan');
        }
        
        setRecommendations(data.mealPlan);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(`Failed to load your recommendations: ${err.message}`);
        setErrorDetails(err.stack || "No additional details available");
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userData, navigate]);

  // Function to handle questionnaire retake
  const handleRetakeQuestionnaire = () => {
    navigate('/questionnaire');
  };

  // Function to manually refresh recommendations
  const handleRefreshRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/generateMealPlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate meal plan');
      }
      
      setRecommendations(data.mealPlan);
      setLoading(false);
    } catch (err) {
      console.error("Error refreshing recommendations:", err);
      setError(`Failed to refresh your recommendations: ${err.message}`);
      setLoading(false);
    }
  };

  // If we're loading
  if (loading) {
    return (
      <div className="user-dashboard loading">
        <h2>Generating your personalized meal recommendations...</h2>
        <div className="loading-spinner"></div>
        <p className="loading-message">This may take a few moments as we analyze your health profile.</p>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="user-dashboard error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        {errorDetails && (
          <details className="error-details">
            <summary>Technical Details</summary>
            <pre>{errorDetails}</pre>
          </details>
        )}
        <div className="error-actions">
          <button className="btn-primary" onClick={handleRetakeQuestionnaire}>
            Retake Questionnaire
          </button>
          <button className="btn-secondary" onClick={handleRefreshRecommendations}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If there are no recommendations
  if (!recommendations) {
    return (
      <div className="user-dashboard no-data">
        <h2>No recommendations available</h2>
        <p>Please complete the health questionnaire to receive personalized recommendations.</p>
        <button className="btn-primary" onClick={handleRetakeQuestionnaire}>
          Take Questionnaire
        </button>
      </div>
    );
  }

  // Render dashboard with recommendations
  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>Your Health Dashboard</h1>
        <div className="dashboard-actions">
          <button className="btn-secondary" onClick={handleRetakeQuestionnaire}>
            Update Health Profile
          </button>
          <button className="btn-refresh" onClick={handleRefreshRecommendations}>
            Refresh Meal Plan
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="daily-plan">
          <h2>Today's Meal Plan</h2>
          
          <div className="meal-card">
            <h3>Breakfast</h3>
            <h4>{recommendations.dailyPlan.breakfast.name}</h4>
            <div className="meal-details">
              <div className="ingredients">
                <h5>Ingredients:</h5>
                <ul>
                  {recommendations.dailyPlan.breakfast.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="preparation">
                <h5>Preparation:</h5>
                <p>{recommendations.dailyPlan.breakfast.preparation}</p>
              </div>
            </div>
            <div className="health-notes">
              <p><strong>Benefits:</strong> {recommendations.dailyPlan.breakfast.nutritionalBenefits}</p>
              <p><strong>Health Notes:</strong> {recommendations.dailyPlan.breakfast.healthNotes}</p>
            </div>
          </div>

          <div className="meal-card">
            <h3>Lunch</h3>
            <h4>{recommendations.dailyPlan.lunch.name}</h4>
            <div className="meal-details">
              <div className="ingredients">
                <h5>Ingredients:</h5>
                <ul>
                  {recommendations.dailyPlan.lunch.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="preparation">
                <h5>Preparation:</h5>
                <p>{recommendations.dailyPlan.lunch.preparation}</p>
              </div>
            </div>
            <div className="health-notes">
              <p><strong>Benefits:</strong> {recommendations.dailyPlan.lunch.nutritionalBenefits}</p>
              <p><strong>Health Notes:</strong> {recommendations.dailyPlan.lunch.healthNotes}</p>
            </div>
          </div>

          <div className="meal-card">
            <h3>Dinner</h3>
            <h4>{recommendations.dailyPlan.dinner.name}</h4>
            <div className="meal-details">
              <div className="ingredients">
                <h5>Ingredients:</h5>
                <ul>
                  {recommendations.dailyPlan.dinner.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="preparation">
                <h5>Preparation:</h5>
                <p>{recommendations.dailyPlan.dinner.preparation}</p>
              </div>
            </div>
            <div className="health-notes">
              <p><strong>Benefits:</strong> {recommendations.dailyPlan.dinner.nutritionalBenefits}</p>
              <p><strong>Health Notes:</strong> {recommendations.dailyPlan.dinner.healthNotes}</p>
            </div>
          </div>

          <div className="meal-card">
            <h3>Snacks</h3>
            {recommendations.dailyPlan.snacks.map((snack, idx) => (
              <div key={idx} className="snack-item">
                <h4>{snack.name}</h4>
                <div className="meal-details">
                  <div className="ingredients">
                    <h5>Ingredients:</h5>
                    <ul>
                      {snack.ingredients.map((ingredient, ingredientIdx) => (
                        <li key={ingredientIdx}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="preparation">
                    <h5>Preparation:</h5>
                    <p>{snack.preparation}</p>
                  </div>
                </div>
                <div className="health-notes">
                  <p><strong>Benefits:</strong> {snack.nutritionalBenefits}</p>
                  <p><strong>Health Notes:</strong> {snack.healthNotes}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="health-sidebar">
          <section className="nutrition-focus">
            <h3>Nutritional Focus</h3>
            {recommendations.nutritionalFocus.map((item, idx) => (
              <div key={idx} className="focus-item">
                <h4>{item.nutrient}</h4>
                <p>{item.reason}</p>
                <h5>Sources:</h5>
                <ul>
                  {item.sources.map((source, sourceIdx) => (
                    <li key={sourceIdx}>{source}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="avoid-list">
            <h3>Foods to Limit</h3>
            {recommendations.avoidList.map((item, idx) => (
              <div key={idx} className="avoid-item">
                <h4>{item.food}</h4>
                <p>{item.reason}</p>
              </div>
            ))}
          </section>

          <section className="habit-tips">
            <h3>Weekly Habit Tips</h3>
            <ul>
              {recommendations.weeklyHabitTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default UserDashboard;