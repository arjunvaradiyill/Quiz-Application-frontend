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
   
  //-----> Fetch Questions <-----
  // Fetch quiz questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('http://localhost:5005/api/quiz');
      const data = await res.json();
      setQuestions(data);
      setSelectedOptions(new Array(data.length).fill(null));
    };

    fetchQuestions();
  }, []);

  //-----> Timer Logic <-----
  // Handle the countdown timer
  useEffect(() => {
    if (results || answered) return;

    if (timeLeft === 0) {
      nextQuestion();
    } else {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, results, answered]);


  //-----> Handle Option Click <-----
  // Handle the option click event
  // Update the selected option and move to the next question
  // If the question is answered, prevent further clicks
  // After a delay, move to the next question
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
//-----> Next Question <-----
  // Move to the next question or submit the quiz if it's the last question
  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(15);
    } else {
      submitQuiz();
    }
  };

  //-----> Submit Quiz <-----
  // Submit the quiz answers to the backend
  // Prepare the answers in the required format
  const submitQuiz = async () => {
    const answers = questions.map((q, i) => ({
      questionId: q._id,
      selectedOptionIndex: selectedOptions[i]
    }));
    // Send the answers to the backend
    const res = await fetch('http://localhost:5005/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
 
    // Handle the response
    const data = await res.json();
    setResults(data);
  };
  //-----> Render Quiz <-----
  // Render the quiz UI
  // If there are no questions, show a loading message
  // If the quiz is completed, show the results
  // Otherwise, show the current question and options
  // Display the question number and time left
  if (!questions.length) return <p>Loading...</p>;

  if (results) {
    return (
      <div className="quiz-container">
        <h2>Quiz Completed!</h2>
        <p className="score-text">Your Score: {results.score} / {results.total}</p>

        <div className="result-buttons">
          <button onClick={() => window.location.reload()}>Retest</button>
          <button onClick={() => navigate('/home')}>Go to Home</button>
        </div>
      </div>
    );
  }

  // 👇 Only define currentQ after checking for results
  // This prevents errors when the quiz is completed
  // and currentQ is accessed before it's defined
  // Get the current question based on the current index
  const currentQ = questions[currentIdx];

  return (
    // Display the question number and time left
    <div className="quiz-container">
      <div className="question-header">
        <span>Question {currentIdx + 1} / {questions.length}</span>
        <span>⏱️ {timeLeft}s</span>
      </div>
      Display the progress bar
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
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
