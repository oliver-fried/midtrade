import React, { useCallback, Redirect, useContext, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthProvider } from "../Auth";




function Navigation(props) {

  /* for path highligting:
  class={`nav-item  ${
                  props.location.pathname === "/post" ? "active" : ""
                }`}
  */

  
  
  const proPicStyle = {height: "8vw", minHeight: "50px", maxHeight: "50px",}
  return (
    <AuthProvider>
     
     
         
      <nav className="navbar py-0 sticky-top navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          
          <a className="navbar-brand" href="/"><h2>Midtrade <small class="text-light">(beta)</small></h2></a>

          
          <a className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </a>


    <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav nav-pills ms-auto">
            
            


              <li class="mt-1 ms-2 navbar-text">
                <a href="/post" class="nav-item navbar-text btn btn-outline-light">              
                  Post 
                </a>
              </li>


             
              <li class="nav-item mb-1">
              
              <a class="btn" type="button" href="/dashboard">
               
              <img class="rounded-circle"  style={proPicStyle} src={getAuth().currentUser.photoURL} />
              
              </a>
              </li>
              
            </ul>

          
            </div>
          
        </div>
      </nav>
    
  
  
      </AuthProvider>
    
  );

}



export default withRouter(Navigation);