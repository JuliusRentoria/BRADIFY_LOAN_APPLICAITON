import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error);
      } else {
        const data = await response.json();
        setToken(data.token);
        alert('Login successful!');

        // Redirect to '/homepage'
        navigate('/homepage'); 
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  

  return (
    <div className="login template d-flex justify-content-center align-items-center 100-w vh-100 bg-primary">
    <div className="form_container p-5 rounded bg-white">
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-2">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" className="form-control" />
        </div>
        <div className="mb-2">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="form-control" />
        </div>
        <button type="submit">Login</button>
      </form>
      {token && <p>Token: {token}</p>}
    </div>
      </div>
      </div>
  );
}

export default Login;
