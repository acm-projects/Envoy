import React, { useState } from 'react';
import './styles/Form.css'

export default function LoginForm() {
 
  const [name, setName] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, seterrorMessage] = useState(null);
  
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
 
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
 
  const handleLogin = (event) => {
    event.preventDefault();
    const userInfo = { email,password };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo)
  };
  fetch('http://localhost:5000/api/users/login/', requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }

            setName(data.name);
            setToken(data.token);
            console.log(name);
        })
        .catch(error => {
          seterrorMessage(error.toString());
            console.error('There was an error!', error);
        });
      };
 
  return (
    <div class="center">
      <div className="loginform">
        <div className="heading">
          <h1>Login</h1>
        </div>
        <form>
          <label className="label">Email</label>
          <input className="input" type="email" onChange={(e)=>handleEmail(e)} value={email} />
          <label className="label">Password</label>
          <input className="input" type="password" onChange={(e)=>handlePassword(e)} value={password} />
          <button className="button" type="submit" onClick={(e)=>handleLogin(e)}>
            Login
          </button>
        </form> 
      </div>
    </div>
  );
}