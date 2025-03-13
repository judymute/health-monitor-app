# Project Structure Documentation

## Overview
This document outlines the structure of our React application, detailing the organization of directories and key files.

## Directory Structure
```
client/
├── public/              # Static files
│   ├── index.html       # HTML entry point
│   ├── favicon.ico      # Site favicon
│   └── ... (other public assets)
├── src/                 # Source code
│   ├── assets/          # Static assets
│   │   └── images/
│   │       └── cutecowprofile.png
│   ├── components/      # Reusable components
│   │   ├── common/      # Shared UI components
│   │   │   ├── Chatbot/
│   │   │   │   ├── Chatbot.js
│   │   │   │   └── Chatbot.css
│   │   │   └── ShoppingList/
│   │   │       ├── ShoppingList.jsx
│   │   │       └── ShoppingList.css
│   │   ├── forms/       # Form-related components
│   │   │   ├── BasicInformation/
│   │   │   │   ├── BasicInformation.jsx
│   │   │   │   └── BasicInformation.css
│   │   │   ├── DietaryPreferences/
│   │   │   │   ├── DietaryPreferences.jsx
│   │   │   │   └── DietaryPreferences.css
│   │   │   ├── MedicalConditions/
│   │   │   │   ├── MedicalConditions.js
│   │   │   │   └── MedicalConditions.css
│   │   │   └── QuestionnaireContainer/
│   │   │       ├── QuestionnaireContainer.js
│   │   │       └── QuestionnaireContainer.css
│   │   ├── layout/      # Layout components
│   │   │   ├── StylizedTabs.js
│   │   │   └── UserProfileSection/    
│   │   │       ├── UserProfileSection.js
│   │   │       └── UserProfileSection.css
│   ├── pages/           # Page components
│   │   ├── LandingPage/
│   │   │   ├── LandingPage.js
│   │   │   └── LandingPage.css
│   │   └── UserDashboard/
│   │       ├── UserDashboard.js
│   │       └── UserDashboard.css
│   ├── services/        # API service calls
│   │   └── api.js       
│   ├── styles/          # Global styles
│   │   └── index.css
│   ├── utils/           # Utility functions
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── App.js           # Main App component
│   ├── App.test.js      # Tests for App component
│   └── index.js         # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── ... (other config files)
```

## Key Components

### Common Components
- **Chatbot**: Interactive chat interface for user assistance
- **ShoppingList**: Component for displaying and managing shopping lists

### Form Components
- **BasicInformation**: Collects user's personal information
- **DietaryPreferences**: Manages user's food preferences and restrictions
- **MedicalConditions**: Tracks user's health conditions
- **QuestionnaireContainer**: Wrapper for all questionnaire-related forms

### Layout Components
- **StylizedTabs**: Custom tab navigation component
- **UserProfileSection**: Displays user profile information

### Pages
- **LandingPage**: Initial entry point for users
- **UserDashboard**: Main user interface after authentication

## Development Conventions

### File Organization
- Each component has its own directory with JS/JSX and CSS files
- CSS is component-scoped rather than global where possible
- Page components are separated from reusable components

### Naming Conventions
- Component files use PascalCase (e.g., `UserDashboard.js`)
- Utility files use camelCase (e.g., `reportWebVitals.js`)
- CSS files match their component name (e.g., `UserDashboard.css`)

## Update Process
*This document should be updated whenever significant changes are made to the project structure.*

Last updated: [Date]