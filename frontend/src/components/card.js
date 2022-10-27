import React from 'react'
import { Link } from 'react-router-dom'
import './styles/card.css'

function Card (){
    return(
        <div className="card-list">
            <div className="cardBody">
                <img className="cardImg" src="https://i.imgur.com/weMU2HH.jpg" />

                <div className="colRight">
                    <h2 className="cardTitle">Texttt</h2>
                    <p className="cardDescription">Text</p>
                    <button className="cardBtn">View</button>

                </div>
                
            </div>
        </div>
    )
}

export default Card;