import React from 'react'
import { Link } from "react-router-dom"
import './styles/HomeCont.css'
import Space from './../assets/space.jpg';

const HomeCont = () => {
    return (
        

        <React.Fragment>
            <header className="bg-image">
                <div className="bg-container">

                <div class="homeHeader">
                    <div class="block">
                        <h1>Envoy</h1>
                        <br />
                        <h2>Here to make learning better</h2>
                        <br />
                        <br />

                        <Link to="/upload" class="button">Upload Now!</Link>
                        <br />
                       
                    </div>
                    
                </div>
                </div>

            </header>

            <div class="lay2">
                <h1>
                    Access to translated educational content like never before.
                </h1>
            </div>

            <div class="homeMid">

                <div class="lay2Img">
                    <img src={Space} />
                </div>
            
                <p class="intro">
                    The rise of virtual learning has changed our way of obtaining new 
                    knowledge but many roadblocks exist in the world of online education. 
                    Many good tutorials or online resources can be in a different language. 
                    Envoy is a website that helps people learn from online videos get 
                    access to content they may not be able to understand. You can get 
                    translated versions of the best tutorial videos and bridge the gap in 
                    virtual learning.
                </p>

            </div>

            <footer>
                <small>All content &copy; Envoy. All rights reserved.</small>
            </footer>

            
        </React.Fragment>
    )
}

export default HomeCont;