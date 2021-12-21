import React from "react";
import { Navigation } from "./"

function About() {
  return (
    <div className="about">
      <Navigation />
      <div class="container">
      <div class="row align-items-center my-5">
          
          <div class="col-md-6 offset-md-3">
            <h1 class="font-weight-light">About</h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;