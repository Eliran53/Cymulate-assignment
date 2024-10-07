import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [email, setEmail] = useState('');
  const [attempts, setAttempts] = useState([]);

  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loggedIn, setLoggedIn] = useState(!!token);

  const handleSignup = async () => {
    try {
      await axios.post(`${API_URL}/user/signup`, {
        username: signupUsername,
        password: signupPassword,
      });
      alert('Signup successful! Now you can log in.');
    } catch (err) {
      alert('Signup failed.');
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/user/login`, {
        username: loginUsername,
        password: loginPassword,
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setLoggedIn(true);
      fetchAttempts();
    } catch (err) {
      alert('Login failed.');
      console.error(err);
    }
  };

  const sendPhishingEmail = async () => {
    try {
      await axios.post(`${API_URL}/phishing/send`, { email }, {
        headers: { Authorization: token },
      });
      fetchAttempts();
    } catch (err) {
      alert('Something went wrong... Please try again later.');
      console.error(err);
    }
  };

  const fetchAttempts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/phishing/attempts`, {
        headers: { Authorization: token },
      });
      setAttempts(data);
    } catch (err) {
      console.error('Failed to fetch attempts', err);
    }
  };

  useEffect(() => {
    if (token) fetchAttempts();
  }, [token]);

  return (
    <div>
      {!loggedIn ? (
        <div>
          <h2>Sign Up</h2>
          <input
            type="text"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleSignup}>Sign Up</button>

          <h2>Login</h2>
          <input
            type="text"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Phishing Awareness Test</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter employee email"
          />
          <button onClick={sendPhishingEmail}>Send Phishing Email</button>

          <h3>Phishing Attempts</h3>
          <ul>
            {attempts.map((attempt) => (
              <li key={attempt._id}>
                Email: {attempt.email}, Status: {attempt.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
