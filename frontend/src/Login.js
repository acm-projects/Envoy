import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userInfo = { email,password };

    fetch('http://localhost:5000/api/users/login/', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo)
    }).then(() => {
      console.log('new blog added');
    })
  }

  return (
    <div className="login">
      <h2>Log into Envoy!</h2>
      <form onSubmit={handleSubmit}>
        <label>User Email: </label>
        <input 
          type="text" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <b><br></br></b>

        <label>Password: </label>
        <input 
          type="text" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <b><br></br></b>
        <button>Login</button>
      </form>
    </div>
  );
}
 
export default Login;