import React from 'react'
import { Link } from 'react-router-dom'
import './styles/Navbar.css'

const Navbar = () => {
    return (
        <div className='sum'>
            <div className="logo">
                Envoy
            </div>
            <nav className='item'>
                <ul className='ul'>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/upload'>Upload</Link>
                    </li>
                    <li>
                        <Link to='/account'>Account</Link>
                    </li>
                    <li>
                        <Link to='/login'>Log in</Link>
                    </li>
                    <li>
                        <Link to='/signup'>Sign up</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar