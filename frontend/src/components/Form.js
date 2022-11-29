import React, { useState } from 'react';
import './styles/Form.css'
import { useTranslation } from 'react-i18next';

export default function Form() {
 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('');
  const { t, i18n } = useTranslation();
 
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
 
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
 
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value)
    setLanguage(event.target.value);
  }
 
  const handleSignup = (event) => {
    event.preventDefault();
    const userInfo = { name,email,password };

    fetch('http://54.209.73.79:5000/api/users/', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo)
    }).then(() => {
      console.log('Signup Done!!');
    })
  };
 
  return (
    <div class="center">
      <div className="form">
        <div className="heading">
          <h1>{t('label.signup')}</h1>
        </div>
        <form>
          <label className="label"> {t('label.name')} </label>
          <input className="input" type="text" onChange={handleNameChange} value={name} />
 
          <label className="label"> {t('label.email')} </label>
          <input className="input" type="email" onChange={handleEmailChange} value={email} />
 
          <label className="label"> {t('label.password')} </label>
          <input className="input" type="password" onChange={handlePasswordChange} value={password} />

          <label className="label"> {t('label.language')} </label>
          <select className="input" value={language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="zh">Chinese</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="ca">Catalan</option>
            <option value="da">Danish</option>
            <option value="de">German</option>
            <option value="is">Icelandic</option>
            <option value="it">Italian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="pl">Polish</option>
            <option value="pt">Portuguese</option>
            <option value="ro">Romanian</option>
            <option value="ru">Russian</option>
            <option value="tr">Turkish</option>
            <option value="cy">Welsh</option>
          </select>
          
          <button className="button" type="submit" onClick={handleSignup}>
            {t('label.signup')}
          </button>
        </form>
      </div>
    </div>
  );
}