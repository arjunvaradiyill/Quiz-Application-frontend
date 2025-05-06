import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Quiz from './pages/Quiz.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
    </Routes>
  );
}

export default App;
