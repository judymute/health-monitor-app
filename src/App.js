import logo from './logo.svg';
import './App.css';
import './UserDashboard';
import UserDashboard from './UserDashboard';
import Questions from './Questions';
import Chatbot from './chatbot';

function App() {
  return (
    <div className="App">
      <Questions/>
      <UserDashboard/>
      <Chatbot/>
    </div>
  );
}

export default App;
