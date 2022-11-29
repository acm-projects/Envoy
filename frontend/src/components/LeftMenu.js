/*
import React from 'react'
import { Link } from 'react-router-dom'
import './styles/leftMenu.css'

import { navData } from "../lib/navData";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

//nav link created w/ each icon and link to text for each iteration in map function

function LeftMenu (){
    return(
        <div className="leftMenu">
            
            <h2 className="cardTitle">Texttt</h2>
            <p className="cardDescription">Text</p>
            <button className="cardBtn">View</button>

                
        

        <button className={styles.menuBtn}>
            <KeyboardDoubleArrowLeftIcon />
        </button>

        {navData.map(item =>{
            return <div key={item.id} className={styles.sideitem}>
                        {item.icon}
                        <span className={styles.linkText}>{item.text}</span>
                </div>
            })}

</div>

        
    )
}


export default LeftMenu;

*/