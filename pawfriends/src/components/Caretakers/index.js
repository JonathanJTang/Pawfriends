import React from 'react';
import "./styles.css";
import chen from './chen.png';
import logout from './logout.png';
import heart from './heart.png';
import logo from './logo.png';
import shiba2 from './shiba2.jpg';
import red from './red.png';
import NavBar from "./../NavBar";
/* Caretakers component */
class Caretakers extends React.Component {
  render() {
    return (
      <div>
 		<NavBar />
         <div><h1> Daycare? Matchmake? Post on Pawfriends! </h1></div> 
          <div className = 'careposts'>

             <div className = 'carepost'>
            
            <h2>
              Looking for someone to dogsit? I am the right one!
              <img src = {heart} alt = 'firstheart' className = 'like' /> 
            </h2>
            <div>
            <p>Ideally I would want my own pet, but I am saving up for it for now. 
            Free next month for your dog if you are going somewhere</p>
            <img src = {chen} alt = 'duck' className = 'postpic' />
            </div>
          </div>

          <div className = 'carepost'>
            <h2>
              Tofu wants a gf!
          
              <img src = {heart} className = 'like' />
            </h2>
            <div>
            <p>Tofu, a 2 year old shiba, is looking for his girlfriend! Tofu is very smart and well-behaved </p>
            <img src = {shiba2} className = 'postpic' />
            </div>
          </div>

          <div className = 'carepost'>
            <h2>
              I can take care of your pet any time next week!
              <img src = {heart} className = 'like' />
            </h2>
            <div>
            <p>I have some downtime as I work from home now. Pretty much available anytime next week if you need daycare</p>
          <img src = {red} className = 'postpic' />
          </div>
          </div>

        </div>	
      </div>
    );
  }
}

export default Caretakers;