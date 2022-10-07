import React from 'react'
import { Link } from 'react-router-dom'
import './styles/Navbar.css'

export default function Navbar() {
    return <nav className="nav">
            <div className="logo">
                Envoy
            </div>

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
}