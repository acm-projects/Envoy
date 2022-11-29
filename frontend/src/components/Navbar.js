import React from 'react'
import { Link } from 'react-router-dom'
import './styles/Navbar.css'
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const { t } = useTranslation();

    return <nav className="nav">
        <div className="logo">
            Envoy
        </div>
        <ul className="navbarLeft">
            <li>
                <Link to='/'> {t('navbar.home')} </Link>
            </li>
            <li>
                <Link to='/library'> {t('navbar.library')} </Link>
            </li>
            <li>
                <Link to='/upload'> {t('navbar.upload')} </Link>
            </li>
        </ul>

        <ul class="navbarRight">
            <li>
                <Link to='/login'> {t('navbar.login')} </Link>
            </li>
            <li>
                <Link to='/signup'> {t('label.signup')} </Link>
            </li>
        </ul>
    </nav>
}