import React, { useCallback, Redirect, useContext, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthProvider } from "../Auth";




export function Footer(props) {

  /* for path highligting:
  class={`nav-item  ${
                  props.location.pathname === "/post" ? "active" : ""
                }`}
  */

                const noStyle = {
                    textDecoration: "inherit",
                    color: "inherit"
                }
                const footerIssue = {postion:"relative"}
  
  return (
    <AuthProvider>
     
     
         
     <nav  class=" position-relative navbar justify-content-center fixed-bottom navbar-light bg-light">


     <p class="lead text-muted">
     <a style={noStyle} href="/about"><small>About </small></a>   |   <a class="  text-muted" style={noStyle} href="/terms-and-conditions"><small> Terms and Conditions</small> </a>
     </p>

    
    </nav>
  
  
      </AuthProvider>
    
  );

}



export default withRouter(Footer);