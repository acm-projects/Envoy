import './App.css';
import Home from './Home';
import Login from "./Login";
import Authentification from './Authentification';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="Content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/authentification" element={<Authentification />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;