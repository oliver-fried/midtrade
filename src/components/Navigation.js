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

  
  
  const proPicStyle = {height: "8vw", maxHeight: "50px"}
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
              <li class="nav-item">
                <a class="nav-link" href="about">About</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="books" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Books(sample button)
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="sciencebooks">Science</a>
                  <a class="dropdown-item" href="mathbook">Engineering</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="humanitiesbooks">Group 3</a>
                </div>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#">Disabled</a>
              </li>

              <li class="mt-1 navbar-text nav-ite">
                <a href="/post" class="nav-item navbar-text btn btn-outline-light">              
                  Post 
                </a>
              </li>
             
              <li>
                <a class="btn" type="button" href="/dashboard">
                <img class="rounded-circle " alt="10x10" style={proPicStyle} src={getAuth().currentUser.photoURL} />
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