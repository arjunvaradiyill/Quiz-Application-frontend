import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';


// Login component for user authentication
const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();


  // Handle form submission for login or registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = state === "register"
      ? "http://localhost:5005/api/register"
      : "http://localhost:5005/api/login";


    // Validate email format
    const payload = {
      email,
      password,
      // Include name only for registration
      ...(state === "register" && { username: name }),
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
      } else {
        if (state === "register") {
          setMessage("Registration successful! Redirecting to login...");
          setTimeout(() => {
            setState("login");
            setMessage("");
            setName("");
            setEmail("");
            setPassword("");
          }, 1500);
        } else {
          setMessage("Login successful! Redirecting...");
          setTimeout(() => {
            // Redirect to home page after successful login
            navigate("/home");
          }, 1500);
        }
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">{state === "login" ? "Login" : "Sign Up"}</h2>

      {state === "register" && (
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {message && <p className="message">{message}</p>}

      <p className="switch-mode">
        {state === "register" ? (
          <>
            Already have an account?{" "}
            <span onClick={() => setState("login")}>Login</span>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <span onClick={() => setState("register")}>Sign up</span>
          </>
        )}
      </p>

      <button type="submit" className="submit-btn">
        {state === "register" ? "Create Account" : "Login"}
      </button>
    </form>
  );
};

export default Login;
