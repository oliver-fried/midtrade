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
  const titleTextStyle = {fontSize:"10vw"}
  
  return (
      
      <div class="mh-100 vh-100 bg-primary bg-gradient row align-items-center" >
        <div class='bg-image' src='background.png'></div>
    <div class="col h-100 align-self-center text-center">
        
    <h1 class="text-white" style={titleTextStyle}>Midtrade.</h1>
      <button type="button" class="btn btn-light mr-3 ml-3"  onClick={handleLogin}>Log in with your USNA account</button>
      <p class="text-small text-white mt-2">(Not working? Enable cookies.)</p>
      
      </div>
      
      
      
    </div>
  );
};

export default withRouter(Login);