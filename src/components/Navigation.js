import React, { useCallback, Redirect, useContext, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthProvider } from "../Auth";




function Navigation(props) {

  

  
  
  const proPicStyle = {height: "8vw", maxHeight: "50px"}
  return (
    <AuthProvider>
     
        
         
      <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
        <div className="container-fluid">
          
          <a className="navbar-brand" href="/"><h2>Midtrade <small class="text-light">(beta)</small></h2></a>

          
          <a className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </a>


    <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
            
            
              
              <li 
                class={`nav-item  ${
                  props.location.pathname === "/post" ? "active" : ""
                }`}
              >
                <a className="nav-link" href="/post">
                <span className="align-middle">
                  Post Item
                  </span>
                </a>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/request" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/request">
                <span class="align-middle">
                  Request Item
                  </span>
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/about" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/about">
                <span class="align-middle">
                  About
                  </span>
                </Link>
              </li>
              <li>
              
              <a class="btn" type="button" href="/dashboard">
               
              <img class="rounded-circle" alt="10x10" style={proPicStyle} src={getAuth().currentUser.photoURL} />
              
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