import React from "react";
import { PostCards } from "./";
import { BookCards } from "./";
import { getAuth, signOut } from "firebase/auth";
import { Link, withRouter } from "react-router-dom";
import { AuthContext, AuthProvider } from "../Auth";
import PrivateRoute from "../PrivateRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


import { About, Post, TermsOfUse, Login, Buying, Request, Dashboard, DashboardRequests, PlannedFeatures, Prohibited} from "./";
import DashboardCards from "./DashboardCards";

const handleSignOut = () => {
  signOut(getAuth()).then(() => {
    window.location.assign('/login');
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}



function Home(props) {

  
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
    const proPicStyle = {height: "8vw", minHeight:"30px", maxHeight: "36px"}
    const borderStyle = {backgroundColor:"white"}

  return (
    <div>
      <AuthProvider>
      <div class="d-block d-md-none">
            
            <nav className="navbar py-0 sticky-top navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
              <a class="navbar-brand">Midtrade</a>

              <div class="d-flex">
            <button class=" btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample"> 
      <span class="navbar-toggler-icon"></span>
    </button>
    </div>
    </div>
            </nav>

            <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" data-bs-keyboard="false" data-bs-backdrop="false" aria-labelledby="offcanvasExampleLabel">
                <div class="offcanvas-header bg-primary">
                    <a class="text-decoration-none" href="/"><h5 class="offcanvas-title text-white" id="offcanvasExampleLabel">Midtrade</h5></a>
                    <button type="button" class="btn-close text-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body bg-primary">



                    <div id="sidebar" class=" ">
                        <div class="nav flex-column py-0">

                        <ul class="nav flex-column ms-0">

                        <li class="">
                          
                                <a href="/" 
                                
                                
                                class={`nav-link px-0  ${
                                  window.location.pathname === "/" ? "fw-bold" : ""
                                }`}
                                
                                > <i class="fs-0 text-white bi-grid"></i><span class="align-text-bottom ms-2 d-sm-inline text-white">All Posts</span></a>
                            </li>



                            <li class="ms-4 w-100">
                                <a href="/books" 
                                
                                
                                class={`nav-link px-0  ${
                                  window.location.pathname === "/books" ? "fw-bold" : ""
                                }`}
                                
                                > <i class="fs-4 text-white bi-book"></i><span class="align-text-bottom ms-2 d-sm-inline text-white">Books</span></a>
                            </li>
                            <li class="ms-4">
                                <a href="/electronics" class={`nav-link text-white px-0  ${
                                  window.location.pathname === "/electronics" ? "fw-bold" : ""
                                }`}> <i class="fs-4 text-white bi-laptop"></i> <span class="   align-text-bottom   ms-1 d-sm-inline">Electronics</span></a>
                            </li>
                            <li class="ms-4">
                                <a href="/apparel" class={`nav-link px-0  ${
                                  window.location.pathname === "/apparel" ? "fw-bold" : ""
                                }`}> <i class="fs-4 text-white bi bi-person"></i><span class="   align-text-bottom  ms-1 text-white d-sm-inline">Apparel</span></a>
                            </li>
                            <li class="ms-4">
                                <a href="/room-items" class={`nav-link px-0  ${
                                  window.location.pathname === "/room-items" ? "fw-bold" : ""
                                }`}> <i class="fs-4 text-white bi bi-lamp"></i><span class="   align-text-bottom  ms-1 text-white d-sm-inline">Room items</span></a>
                            </li>

                            <li class="w-100">
                                <a href="/dashboard" 
                                
                                
                                class={`nav-link px-0  ${
                                  window.location.pathname === "/dashboard" ? "fw-bold" : ""
                                }`}
                                
                                > <i class="fs-4 text-white bi-speedometer2"></i><span class="align-text-bottom ms-2 d-sm-inline text-white">My Posts</span></a>
                            </li>

                            <li class="w-100">
                                <a href="/post" 
                                
                                
                                class={`nav-link px-0  ${
                                  window.location.pathname === "/post" ? "fw-bold" : ""
                                }`}
                                
                                > <i class="fs-4 text-white bi-pen"></i><span class="align-text-bottom ms-2 d-sm-inline text-white">Post</span></a>
                            </li>

                            
                        </ul>

                        <hr class="text-white" />
                <div class="dropdown pb-4">
                    <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img class="rounded-circle" alt="10x10" style={proPicStyle} src={getAuth().currentUser.photoURL}/>
                        <span class=" d-sm-inline mx-1">{getAuth().currentUser.displayName}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                        <li><a class="dropdown-item" href="/about">About Midtrade</a></li>
                        <li><a class="dropdown-item" href="/terms-of-use">Terms of Use</a></li>
                        <li>
                            <hr class="dropdown-divider" />
                        </li>
                        <li><a class="dropdown-item" onClick={handleSignOut}>Sign out</a></li>
                    </ul>
                </div>

                        
                           
                            
                        </div>
                    </div>
                   


                    
                </div>
            </div>
            


            <div class="container">
        <div class="row align-items-center my-3 mt-3">
          
          <div class="col-md-6 offset-md-3">
      

          <Router>
  <Switch>
  <PrivateRoute exact path="/" component={() => <PostCards />} />          
    <PrivateRoute exact path="/dashboard" component={() => <DashboardCards />} />
    <PrivateRoute exact path="/post" component={() => <Post />} />   
    <PrivateRoute exact path="/About" component={() => <About />} />   
    <PrivateRoute exact path="/terms-of-use" component={() => <TermsOfUse />} />   
    <PrivateRoute exact path="/prohibited" component={() => <Prohibited />} />   
    <PrivateRoute exact path="/books" component={() => <PostCards />} /> 
    <PrivateRoute exact path="/electronics" component={() => <PostCards />} /> 
    <PrivateRoute exact path="/apparel" component={() => <PostCards />} /> 
    <PrivateRoute exact path="/room-items" component={() => <PostCards />} /> 
    <PrivateRoute exact path="/plannedFeatures" component={() => <PlannedFeatures />} /> 





           

    
    
    
  </Switch>

</Router>
          </div>
        </div>
      </div>



            </div>
    
            <div class="d-none d-md-block">

    <div class="container-fluid">

         
    <div class="row flex-nowrap">
        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-primary">
            <div class="d-flex flex-column sticky-top align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <a href="/" class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span class="fs-3 d-none d-sm-inline">Midtrade</span>
                </a>


                <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                
          


                <li>
                        <a href="/"  
                        
                        class={`" text-decoration-none px-0 align-middle  ${
                          window.location.pathname === "/" ? "fw-bold" : ""
                        }`}

                        >
                            <i class="fs-4 bi-grid text-white" 
                            
                            
                            ></i> <span class="ms-1 text-white d-none d-sm-inline  align-text-bottom  "> All posts</span> </a>
                            <ul class=" nav flex-column ms-3" id="submenu3" data-bs-parent="#menu">
                            <li class="w-100">
                                <a href="/books" 
                                
                                
                                class={`nav-link px-0  ${
                                  window.location.pathname === "/books" ? "fw-bold" : ""
                                }`}
                                
                                > <i class="fs-4 text-white bi-book"></i> <span class="   align-text-bottom  ms-1 d-none d-sm-inline text-white">Books</span></a>
                            </li>
                            <li>
                                <a href="/electronics" class={`nav-link text-white px-0  ${
                                  window.location.pathname === "/electronics" ? "fw-bold" : ""
                                }`}> <i class="fs-4 text-white bi-laptop"></i> <span class="   align-text-bottom   ms-1 d-none d-sm-inline">Electronics</span></a>
                            </li>
                            <li>
                                <a href="/apparel" class={`nav-link px-0  ${
                                  window.location.pathname === "/apparel" ? "fw-bold" : ""
                                }`}> <i class="fs-4 text-white bi bi-person"></i><span class="   align-text-bottom  ms-1 text-white d-none d-sm-inline">Apparel</span></a>
                            </li>
                            <li>
                                <a href="room-items" class={`nav-link px-0  ${
                                  window.location.pathname === "/room-items" ? "fw-bold" : ""
                                }`}> <i class="fs-4 text-white bi bi-lamp"></i><span class="   align-text-bottom  ms-1 d-none text-white d-sm-inline">Room items</span></a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="/dashboard" class={`nav-link px-0  ${
                                  window.location.pathname === "/dashboard" ? "fw-bold" : ""
                                }`}>
                            <i class="fs-4 text-white bi-speedometer2"></i> <span class=" align-text-bottom  ms-1 text-white d-none d-sm-inline">My Posts</span> </a>
                        
                    </li>
                    <li>
                        <a href="/post" class={`nav-link px-0  ${
                                  window.location.pathname === "/post" ? "fw-bold" : ""
                                }`}>
                            <i class="fs-4 text-white bi-pen"></i> <span class=" align-text-bottom ms-1 text-white d-none d-sm-inline">Post</span></a>
                    </li>
                    
                    
                    
                </ul>

                
                <hr style={borderStyle}/>
                <div class="dropdown pb-4">
                    <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img class="rounded-circle" alt="10x10" style={proPicStyle} src={getAuth().currentUser.photoURL}/>
                        <span class="d-none d-sm-inline mx-1">{getAuth().currentUser.displayName}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                        <li><a class="dropdown-item" href="/about">About Midtrade</a></li>
                        <li><a class="dropdown-item" href="/terms-of-use">Terms of Use</a></li>
                        <li>
                            <hr class="dropdown-divider" />
                        </li>
                        <li><a class="dropdown-item" onClick={handleSignOut}>Sign out</a></li>
                    </ul>
                </div>
                
            </div>
        </div>
        <div class="col py-3">
  
        
        <div class="row align-items-center my-3 mt-3">
          
          <div class="col-md-6 offset-md-3">
          
          
               

              


        
<Router>
  <Switch>
  <PrivateRoute exact path="/" component={() => <PostCards />} />          
    <PrivateRoute exact path="/dashboard" component={() => <DashboardCards />} />
    <PrivateRoute exact path="/post" component={() => <Post />} />   
    <PrivateRoute exact path="/About" component={() => <About />} />   
    <PrivateRoute exact path="/terms-of-use" component={() => <TermsOfUse />} />   
    <PrivateRoute exact path="/prohibited" component={() => <Prohibited />} />   
    <PrivateRoute exact path="/books" component={() => <PostCards />} /> 
    <PrivateRoute exact path="/electronics" component={() => <PostCards />} /> 
    <PrivateRoute exact path="/apparel" component={() => <PostCards />} /> 
    <PrivateRoute exact path="/room-items" component={() => <PostCards />} /> 
    <PrivateRoute exact path="/plannedFeatures" component={() => <PlannedFeatures />} /> 


    
  </Switch>

</Router>



          </div>
        </div>
        </div>
    </div>
    </div>
    

</div>
</AuthProvider>
</div>

 
  );
}

export default (Home);