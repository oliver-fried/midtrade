// Code for About page, no JS, just HTML and some CSS for styling
//
// Oliver Fried, January 2021

import React from "react";
import { Navigation } from "./"
import { Footer } from "./"

function About() {

  // CSS Style Block 
  const fH = {
    display: "inline-block",
    height: "90vh", /*THis will set height equal to the height of windows*/
    width: "100vw" /*This will set width equal to width of windows*/
    }

  return (
    <div>
          

            <h1 class=" font-weight-light">About</h1>

            <p class="lead">
            Midtrade (or Midtrade.us) is in no way affiliated with the United States Naval Academy, the US Navy, the Department of Defense, or the US Government.
            </p>
            
            <p class="lead">
            If you want to help maintain/develop this project, text me: </p>

            <p class="lead">
            Oliver Fried: 508-850-6770
            </p>

            <p class="lead"><a href="https://github.com/oliver-fried/midtrade" >All website code is located at the Github repo here.</a></p>

            
            

          </div>
       
      
      
    
  );
}

export default About;