import React from "react";
import { Navigation } from "./"
import { withRouter } from "react-router-dom";


function PlannedFeatures(props) {

  
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

  return (
    
    <div className="plannedFeatures">
      <Navigation />
      <div class="container">
        <div class="row align-items-center my-3">
          
          <div class="col-md-6 offset-md-3 text-center" > 
          
          <h1>Planned Features</h1>

          <h1 class=" lead">- Support for multiple images</h1>
          <h1 class="lead">- Ability to request to buy items</h1>
          <h1 class="lead">- Description tags to posts (functioning as a hashtag)</h1>
          <h1 class=" lead">- Dedicated textbook section</h1>
          <h1 class=" lead">- Ability to edit posted posts</h1>


          
          <button class="btn btn-primary mt-4" onClick={() => window.open("https://forms.gle/55c7JpVuKXB7QPj36", '_blank')}>     Vote     </button>
          
          
        
          </div>

        </div>
      </div>
    </div>
  );
}

export default withRouter(PlannedFeatures);