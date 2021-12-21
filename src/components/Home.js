import React from "react";
import { PostCards } from "./";
import { Navigation } from "./"
import { withRouter } from "react-router-dom";


function Home(props) {

  
  
  return (
    
    <div className="home">
      <Navigation />
      <div class="container">
        <div class="row align-items-center my-3">
          
          <div class="col-md-6 offset-md-3">
          
          <div class="btn-group w-100 mb-3" role="group">
            <a href="/" class={`btn ${
                  (props.location.pathname === "/" | props.location.pathname === "/home") ? "btn-primary" : "btn-outline-dark"
                }`}>
               Selling</a>
              

            <a href="/buying" class={`btn ${
                  (props.location.pathname === "/buying") ? "btn-primary" : "btn-outline-primary"
                }`}>
               Buying</a>
               </div>
               <div class="card mb-3">
                    <div class="card-header">
                        <div class="container">
                            <div class="row">
                            <div class="col-8">
                                    <h3 class="text">Welcome!</h3>
                                </div>
                                <div class="col-4">
                                </div>
                                <div class="col">
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    <div class="card-body w-100">
                        <p class="lead">This is the beta. More features will be added. If you have time, you are invitied to <a href="https://forms.gle/jjDBXjmKBg1KMKRz5">provide feedback here.</a></p>
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