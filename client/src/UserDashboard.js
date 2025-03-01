import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = ({ userData }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        // This would be your actual API call to get recommendations from your backend
        // For this example, we'll simulate a response
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        
        // Simulate a successful response
        const mockRecommendations = {
          dailyPlan: {
            breakfast: {
              name: "Overnight Oats with Berries",
              ingredients: ["rolled oats", "almond milk", "chia seeds", "mixed berries", "honey"],
              preparation: "Mix oats, milk, and chia seeds. Refrigerate overnight. Top with berries and honey before eating.",
              nutritionalBenefits: "High in fiber, antioxidants, and provides sustained energy",
              healthNotes: "Good for heart health and blood sugar management"
            },
            lunch: {
              name: "Mediterranean Quinoa Bowl",
              ingredients: ["quinoa", "cucumber", "cherry tomatoes", "red onion", "feta cheese", "olive oil", "lemon juice"],
              preparation: "Combine cooked quinoa with chopped vegetables, feta, olive oil, and lemon juice.",
              nutritionalBenefits: "Rich in protein, fiber, and healthy fats",
              healthNotes: "Anti-inflammatory properties from olive oil and vegetables"
            },
            dinner: {
              name: "Baked Salmon with Roasted Vegetables",
              ingredients: ["salmon fillet", "broccoli", "carrots", "bell peppers", "olive oil", "garlic", "lemon"],
              preparation: "Season salmon and bake. Roast vegetables with olive oil and garlic.",
              nutritionalBenefits: "High in omega-3 fatty acids, protein, and essential nutrients",
              healthNotes: "Supports heart and brain health"
            },
            snacks: [
              {
                name: "Greek Yogurt with Nuts",
                ingredients: ["Greek yogurt", "mixed nuts", "honey"],
                preparation: "Top yogurt with nuts and a drizzle of honey.",
                nutritionalBenefits: "Good source of protein and probiotics",
                healthNotes: "Supports gut health and provides protein"
              }
            ]
          },
          nutritionalFocus: [
            {
              nutrient: "Vitamin D",
              reason: "Important for immune function and bone health",
              sources: ["salmon", "egg yolks", "mushrooms", "fortified foods"]
            },
            {
              nutrient: "Fiber",
              reason: "Supports digestive health and maintains healthy blood sugar",
              sources: ["whole grains", "vegetables", "fruits", "legumes"]
            }
          ],
          avoidList: [
            {
              food: "Processed sugars",
              reason: "Can cause energy crashes and inflammation"
            },
            {
              food: "Highly processed foods",
              reason: "Often high in sodium and unhealthy fats"
            }
          ],
          weeklyHabitTips: [
            "Drink a glass of water before each meal",
            "Add an extra serving of vegetables to your lunch and dinner",
            "Take a 10-minute walk after each meal to aid digestion"
          ]
        };
        
        setRecommendations(mockRecommendations);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load your recommendations. Please try again later.");
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userData, navigate]);

  // Function to handle questionnaire retake
  const handleRetakeQuestionnaire = () => {
    navigate('/questionnaire');
  };

  // If we're loading
  if (loading) {
    return (
      <div className="user-dashboard loading">
        <h2>Generating your personalized meal recommendations...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="user-dashboard error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button className="btn-primary" onClick={handleRetakeQuestionnaire}>
          Retake Questionnaire
        </button>
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
        <button className="btn-secondary" onClick={handleRetakeQuestionnaire}>
          Update Health Profile
        </button>
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
            {/* Similar structure as breakfast */}
          </div>

          <div className="meal-card">
            <h3>Dinner</h3>
            <h4>{recommendations.dailyPlan.dinner.name}</h4>
            {/* Similar structure as breakfast */}
          </div>

          <div className="meal-card">
            <h3>Snacks</h3>
            {recommendations.dailyPlan.snacks.map((snack, idx) => (
              <div key={idx} className="snack-item">
                <h4>{snack.name}</h4>
                {/* Similar structure as meals */}
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