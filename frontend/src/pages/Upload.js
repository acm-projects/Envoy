import Navbar from '../components/Navbar';
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import './styles/Upload.css'
import Dropdown from '../components/Dropdown';
import React, { useState } from 'react';

const uploader = new Uploader({
  apiKey: "free"
});

const styles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
};

function Item(props) {

  const [open, setOpen] = useState(false);

  return (
    <li className="item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
}

function DropdownMenu() {
  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item">
        <span className="icon-button">{props.leftIcon}</span>
        
        {props.children}

        <span className="icon-right">{props.rightIcon}</span>
      </a>
    )
  }
  
  return (
    <div className="dropdown">
        <DropdownItem>My Profile</DropdownItem>
    </div>
  )
}

//links navbar pages
export default function Upload(props) {

  const [open, setOpen] = useState(false);

  return (
    <div>
      <Navbar />
      <div style={styles}>

        <UploadDropzone uploader={uploader}
                options={{multi: true}}
                onComplete={files => console.log(files)}
                width="600px"
                height="375px" />
      
      </div>
      <div className="dropdown-button">
      
      <Item icon="HERE">
        <DropdownMenu />
      </Item>

      </div>
    </div>
  )
}

