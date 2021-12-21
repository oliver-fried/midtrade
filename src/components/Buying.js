import { getAuth } from 'firebase/auth';
import React from "react";
import { BuyingCards } from "./";
import { Navigation } from "./"
import { withRouter } from "react-router-dom";


function Buying(props) {
  return (
    
    <div className="home">
      <Navigation />
      <div class="container">
      <div class="row align-items-center my-5">
          
          <div class="col-md-6 offset-md-3">
          <div class="btn-group w-100 mb-3" role="group">
            <a href="/" class={`btn ${
                  (props.location.pathname === "/" | props.location.pathname === "/home") ? "btn-primary" : "btn-outline-primary"
                }`}>
               Selling</a>
              

            <a href="/buying" class={`btn ${
                  (props.location.pathname === "/buying") ? "btn-primary" : "btn-outline-primary"
                }`}>
               Buying</a>
               </div>
            <BuyingCards />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Buying);