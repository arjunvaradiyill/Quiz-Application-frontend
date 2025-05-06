import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-content">
        <img
          src="https://i.pinimg.com/736x/04/9d/98/049d98b292527a474e71cafe47a93095.jpg"
          alt="quiz"
          className="quiz-image"
        />
        <h1>Ready to Challenge Yourself?</h1>
        <p>Put your brain to the test with fun and insightful quiz questions!</p>

        <button className="start-btn" onClick={() => navigate("/quiz")}>
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Home;
