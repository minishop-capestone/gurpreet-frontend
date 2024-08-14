import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import { useAuth } from '../components/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate("/addProduct");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await fetch('https://gurpreet-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        login(data.user);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to log in');
    }
  };

  return (
    <main className="content login-content">
      <div className="login-page">
        <div className="login-container">
          <h1>Mini shop Login</h1>
          <p>Enter your email and password.</p>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className='login-button' type="submit">Login</button>
          </form>
          <div className="signup-container">
            <a href="/signup">Create new account?</a>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
