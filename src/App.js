import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, About, Post, TermsAndConditions, Login, Buying, Request, Dashboard, DashboardRequests } from "./components";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "./Auth"

function App() {

  return (
    <div id='root'>
      <AuthProvider>
      <Router>
        
        <Switch>
          <PrivateRoute exact path="/dashboard" component={() => <Dashboard />} />
          <PrivateRoute exact path="/home" component={() => <Home />} />
          <PrivateRoute exact path="/" component={() => <Home />} />
          <PrivateRoute exact path="/buying" component={() => <Buying />} />
          <PrivateRoute exact path="/post" component={() => <Post />} />
          <PrivateRoute exact path="/about" component={() => <About />} />
          <PrivateRoute exact path="/request" component={() => <Request />} />
          <PrivateRoute exact path="/terms-and-conditions" component={() => <TermsAndConditions />} />
          <Route path="/login" component={() => <Login />} />
          <PrivateRoute exact path="/dashboard-requests" component={() => <DashboardRequests />} />

          
          
          
        </Switch>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;