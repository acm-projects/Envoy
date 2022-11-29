import React, { useState } from 'react';
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import uploadIcon from '../assets/uploadIcon.png';
import background from '../assets/uploadBackground.jpg';
import './styles/UploadForm.css';

const uploader = new Uploader({
    apiKey: "free"
  });

const options = { multi: true }

const headingStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '10vh',
  }

export default function UploadForm() {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleUpload = (event) => {
    event.preventDefault();
    alert("Uploaded!");
  };

  return (
    <><div style={{ backgroundImage: `url(${background})`, backgroundRepeat:"no-repeat", backgroundSize:"contain",
    height: 1200, width: 1600
    }}>
    </div>
    <div class="center">
        <div className="form">
          <form>
            <div style={headingStyles}>
              <img src={uploadIcon} alt="Upload Icon" />
            </div>
            <div style={headingStyles}>
              <h1>Upload any video</h1>
            </div>
            <div className="uploadButton">
              <UploadButton uploader={uploader}
                options={options}           // Optional.
                onComplete={files => {      // Optional.
                  if (files.length === 0) {
                    console.log('No files selected.')
                  } else {
                    console.log('Files uploaded:');
                    console.log(files.map(f => f.fileUrl));
                  }
                  }}>
                {({onClick}) =>
                  <button className="button" onClick={onClick}>
                    Upload Your Video
                  </button>
                }
              </UploadButton>
            </div>
            <label className="label">Title:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <div className="titleInput">
              <input className="input" type="text" onChange={handleTitleChange} value={title} />
            </div>
            <label className="label">Language:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <div>
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
            </div>
            <div>
            <label className="label">Description:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <textarea className="description">
                Type a short description of your video here
              </textarea>
            </div>
            <button className="button" type="submit" onClick={handleUpload}>
              Submit
            </button>
          </form>
        </div>
      </div></>
  );
}