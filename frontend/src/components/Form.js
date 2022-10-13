import React, { useState } from 'react';
import './styles/Form.css'

export default function Form() {
 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
 
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
 
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
 
  const handleSignup = (event) => {
    event.preventDefault();
    alert("Welcome to Envoy!");
  };
 
  return (
    <div class="center">
      <div className="form">
        <div className="heading">
          <h1>Sign Up</h1>
        </div>
        <form>
          <label className="label">Name</label>
          <input className="input" type="text" onChange={handleNameChange} value={name} />
 
          <label className="label">Email</label>
          <input className="input" type="email" onChange={handleEmailChange} value={email} />
 
          <label className="label">Password</label>
          <input className="input" type="password" onChange={handlePasswordChange} value={password} />
 
          <button className="button" type="submit" onClick={handleSignup}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}