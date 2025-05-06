import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [results, setResults] = useState(null);
  const [answered, setAnswered] = useState(false);
  const navigate = useNavigate();
   
  // Fetch Questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('http://localhost:5005/api/quiz');
      const data = await res.json();
      setQuestions(data);
      setSelectedOptions(new Array(data.length).fill(null));
    };

    fetchQuestions();
  }, []);

  // Timer Logic
  useEffect(() => {
    if (results || answered) return;

    if (timeLeft === 0) {
      nextQuestion();
    } else {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, results, answered]);

  // Handle Option Click
  const handleOptionClick = (index) => {
    if (answered) return;

    const updatedOptions = [...selectedOptions];
    updatedOptions[currentIdx] = index;
    setSelectedOptions(updatedOptions);
    setAnswered(true);

    setTimeout(() => {
      nextQuestion();
      setAnswered(false);
    }, 1500);
  };

  // Move to the Next Question
  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(15);
    } else {
      submitQuiz();
    }
  };

  // Submit the Quiz
  const submitQuiz = async () => {
    const answers = questions.map((q, i) => ({
      questionId: q._id,
      selectedOptionIndex: selectedOptions[i]
    }));
    const res = await fetch('http://localhost:5005/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
 
    const data = await res.json();
    setResults(data);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");  // Remove token from localStorage
    navigate("/login");  // Redirect to login page
  };

  if (!questions.length) return <p>Loading...</p>;

  if (results) {
    return (
      <div className="quiz-container">
        <h2> Quiz Completed!</h2>
        <p className="score-text">Your Score: {results.score} / {results.total}</p>

        <div className="result-buttons">
          <button onClick={() => window.location.reload()}>Retest</button>
          <button onClick={() => navigate('/home')}>Go to Home</button>
          <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
        </div>
      </div>
    );
  }

  // Get the current question based on the current index
  const currentQ = questions[currentIdx];

  return (
    <div className="quiz-container">
      <div className="question-header">
        <span>Question {currentIdx + 1} / {questions.length}</span>
        <span>⏱️ {timeLeft}s</span>
      </div>

      <p className="question-text">{currentQ.question}</p>

      <ul className="options">
        {currentQ.options.map((option, index) => {
          const selected = selectedOptions[currentIdx] === index;
          const correct = index === currentQ.correctAnswer;

          let className = 'option';
          if (answered || selectedOptions[currentIdx] !== null) {
            if (selected && correct) className += ' correct';
            else if (selected && !correct) className += ' wrong';
            else if (correct) className += ' correct';
          }

          return (
            <li
              key={index}
              className={className}
              onClick={() => handleOptionClick(index)}
            >
              {option}
            </li>
          );
        })}
      </ul>

    </div>
  );
};

export default Quiz;
