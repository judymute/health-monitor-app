import logo from './logo.svg';
import './App.css';
import './UserDashboard';
import UserDashboard from './UserDashboard';
import Questions from './Questions';

function App() {
  return (
    <div className="App">
      <Questions/>
      <UserDashboard/>
    </div>
  );
}

export default App;
