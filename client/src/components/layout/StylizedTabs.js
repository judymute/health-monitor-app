import React from 'react';
import PropTypes from 'prop-types';

/**
 * StylizedTabs - A cute, soft-styled tab component with a green theme
 * 
 * @param {Object} props Component props
 * @param {string} props.activeTab Currently active tab ID
 * @param {Function} props.setActiveTab Function to change active tab
 * @param {Array} props.tabs Array of tab objects with id, icon, and label properties
 * @param {Object} props.colors Custom colors object (optional)
 */
const StylizedTabs = ({ 
  activeTab, 
  setActiveTab, 
  tabs = [
    { id: 'mealPlan', icon: 'bi-card-list', label: 'Meal Plan' },
    { id: 'shoppingList', icon: 'bi-cart', label: 'Shopping List' }
  ],
  colors = {
    primary: '#2ECC71',     // Main green
    secondary: '#27AE60',   // Darker green
    light: '#E8F8F5',       // Very light green
    accent1: '#D5F5E3',     // Soft light green
    background: 'rgba(213, 245, 227, 0.3)', // Super light green background
    shadow: 'rgba(46, 204, 113, 0.2)'  // Green shadow
  }
}) => {
  return (
    <div 
      className="rounded-4 p-2 mb-4" 
      style={{ 
        background: colors.background, 
        boxShadow: `0 4px 10px ${colors.shadow}`,
        border: `1px solid ${colors.accent1}`
      }}
    >
      <div className="d-flex justify-content-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className="d-flex align-items-center px-4 py-2 mx-2 rounded-pill"
            style={{ 
              background: activeTab === tab.id ? colors.primary : 'white',
              color: activeTab === tab.id ? 'white' : colors.primary,
              border: `1px solid ${activeTab === tab.id ? colors.primary : colors.accent1}`,
              boxShadow: activeTab === tab.id 
                ? `0 4px 8px ${colors.shadow}` 
                : 'none',
              fontWeight: activeTab === tab.id ? '600' : '500',
              transform: activeTab === tab.id ? 'translateY(-2px)' : 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`${tab.icon} me-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

StylizedTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  colors: PropTypes.object
};

export default StylizedTabs;