import React from 'react';
import "./styles.css";

import squeaky from './squeaky.png';
import bundle from './bundle.png';
import duck from './duck.png';
import heart from './heart.png';
import avatar from './avatar.jpg';
import shiba from './shiba.jpg';
import ttungttang from './ttungttang.jpg';
import NavBar from "./../NavBar";


/* Trade component */
class Trade extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
         <div><h1> Trade toys with pawfriends! </h1></div> 
          <div className = 'tradeposts'>

             <div className = 'tradepost'>
            
            <h2>
              Selling an almost brand new duck plush!
              <img src = {avatar} alt = 'avatar' className = 'poster' />
              <img src = {heart} alt = 'firstheart' className = 'like' /> 
            </h2>
            <div>
            <p>5 dollars only! A gently used, almost brand new duck plush. 
            Location is Toronto, open to meet at any subway stations</p>
            <img src = {duck} alt = 'duck' className = 'postpic' />
            </div>
          </div>

          <div className = 'tradepost'>
            <h2>
              A large squeaky ball
              <img src = {shiba} alt = 'shiba' className = 'poster' />
              <img src = {heart} className = 'like' />
            </h2>
            <div>
            <p>10 only! A rarely used, almost brand new squeaky ball.
            Would be great to meet up anywhere near Yonge and Eg</p>
            <img src = {squeaky} className = 'postpic' />
            </div>
          </div>

          <div className = 'tradepost'>
            <h2>
              squicky balls in bundle
              <img src = {ttungttang} alt = 'ttungttang' className = 'poster' />
              <img src = {heart} className = 'like' />
            </h2>
            <div>
            <p>my cat got a new toy, so I am trying to sell these balls! $5 is a steal for a bundle of cute squeaky balls</p>
          <img src = {bundle} className = 'postpic' />
          </div>
          </div>

        </div>	
      </div>
    );
  }
}

export default Trade;