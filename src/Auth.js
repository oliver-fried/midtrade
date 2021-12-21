import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { app } from "./Firebase.js"

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  if(pending){
    return (
        <div className="row align-items-center" >
        <div className="col h-100 align-self-center text-center">
            
        <h1 className="text-white">Loading...</h1>
          
          </div>
          
          
          
        </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
