import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, About, Post, TermsOfUse, Login, Buying, Request, Dashboard, DashboardRequests, PlannedFeatures, Prohibited} from "./components";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "./Auth"
import { Footer } from "./components/"

function App() {

  return (
    <div id='root'>
      <AuthProvider>

      <Router>
        <Switch>
                    

          <Route path="/login" component={() => <Login />} />
          <PrivateRoute path="/"  component={() => <Home />} />

    
        </Switch>

      </Router>


    </AuthProvider>
    </div>
  );
}

export default App;