import React from "react";
import { PostCards } from "./";
import { Navigation } from "./"
import { Footer } from "./"

import { withRouter } from "react-router-dom";


function Home(props) {

  
  /*<div class="btn-group w-100 mb-3" role="group">
            <a href="/" class={`btn ${
                  (props.location.pathname === "/" | props.location.pathname === "/home") ? "btn-primary" : "btn-outline-dark"
                }`}>
               Selling</a>
              

            <a href="/buying" class={`btn ${
                  (props.location.pathname === "/buying") ? "btn-primary" : "btn-outline-primary"
                }`}>
               Buying</a>
               </div>
               */

    const paddingForPosts = {paddingTop:"70px"}
  return (
    
    <div className="home">
      <Navigation />
      <div class="container">
        <div class="row align-items-center my-3 mt-3">
          
          <div class="col-md-6 offset-md-3">
          
          
               <div class="card mb-3">
                  

                    <div class="card-body w-100">
                        <p class="lead">This is the beta. More features will be added. You are invited to <a target="_blank" href="https://forms.gle/jjDBXjmKBg1KMKRz5">provide feedback here.</a></p>
                        <p class="lead"><a href="/plannedFeatures">Click here for a list of planned/upcoming features</a></p>
                        
                        
                    </div>
                </div>

                

            <PostCards />

          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Home);