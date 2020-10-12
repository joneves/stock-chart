import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Application from "application/Application";

const Root = () => (
  <BrowserRouter>
    <Route path="/" component={Application} />
  </BrowserRouter>
);

export default Root;
