import React from 'react'
import { Link } from "react-router-dom"
import './styles/Header.css'

const Header = () => {
    return (
        <React.Fragment>
            <header className="bg-image">
                <div className="bg-container">
                    <h1>Envoy</h1>
                    <br />
                    <h2>Here to make learning better</h2>
                    <Link to="/upload">Upload Now!</Link>
                </div>
            </header>
        </React.Fragment>
    )
}

export default Header;