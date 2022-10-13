import {useRef} from 'react';

const Home = () => {
    const title = 'Envoy Login'
    const username = useRef(null);
    const email = useRef(null);
    const password = useRef(null);

    function handleClick() {
        console.log(email.current.value);
        console.log(password.current.value);
        const login = {email, password};
        fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(login)
        }).then(() => {
            console.log('Thing happened');
        })
      }
    
    const loginError = () => {
        window.alert('Incorrect password or username.')
    }

    return(
        <div className = 'home'>
            <h1>{title}</h1>
            <b>Email: </b>
            <input
                ref={email}
                type="text"
                id="message"
                name="message"
            />
            <b><br></br></b>
            <b>Password:  </b>
            <input
                ref={password}
                type="text"
                id="message"
                name="message"
            />
            <b><br></br></b>
            <b><br></br></b>
            <button onClick = {handleClick}>Login</button>
        </div>
    );
}

export default Home;