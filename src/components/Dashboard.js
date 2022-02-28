import React from "react";
import { DashboardCards } from "./";
import { Navigation } from "./"
import { Footer } from "./"
import { getAuth, signOut } from "firebase/auth"

import { withRouter } from "react-router-dom";


function Dashboard(props) {

    const handleSignOut = () => {
        signOut(getAuth()).then(() => {
          window.location.assign('https://accounts.google.com/Logout');
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
        });
      }

  
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
    const noStyle = {
      textDecoration: "inherit",
  }
  return (
    <div>
    
    
          <h1>Dashboard</h1>

          <button class='btn btn-primary btn-block w-100 mb-4 mt-3' onClick={handleSignOut}>Sign out</button>
          <h3><p class="lead"><a style={noStyle} href="/about">About</a> | <a style={noStyle} href="/terms-of-use">Terms of Use</a></p></h3>


            <h1><p class="display-6">My posts</p></h1>
          
               

            <DashboardCards />

          </div>
    
    
    
    
  );
}

export default withRouter(Dashboard);