import React, { useCallback, useContext, useEffect, useState } from "react";
import { withRouter, Redirect } from "react-router";
import { AuthContext } from "../Auth.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { Button, Container } from "react-bootstrap";


const Login = ({ history }) => {


    const [ currentUser, setCurrentUser ]  = useState();

  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      try {
        await getAuth()
        
        const provider = new GoogleAuthProvider();
        signInWithRedirect(getAuth(), provider);

        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  useEffect(() => {
      getAuth().onAuthStateChanged((user) => {
          setCurrentUser(user);
      });
  }, []);

  

  if (currentUser) {
    return <Redirect to="/" />;
  }
  const titleTextStyle = {fontSize:"7vw",
                         }
  const backgroundStyle = {backgroundImage:"linear-gradient(135deg, #7accff,#001fcf)"}

  
  return (

      
      <div class="container mh-100 vh-100 mw-100"  style={backgroundStyle}>
        
        <div class="row align-items-center h-100">
    <div class="mx-auto text-center">
        
    <h1 class="text-white" style={titleTextStyle}>Midtrade</h1>
      <button type="button" class="btn btn-light mr-3 ml-3"   onClick={handleLogin}>Log in with your USNA account</button>
      <p class="text-small text-white mt-2">(Not working? Enable cookies by clicking the eye icon on the right side of your browser bar.)</p>
      
      </div>
      
      
      </div>
    </div>
  );
};

export default withRouter(Login);