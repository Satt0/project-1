import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ViewProduct from "./ViewProduct";
export default function PublicRouting({ match: { path } }) {
  return (
    <Switch>
      <Route exact path={`${path}product/:slug`} component={ViewProduct} />
      <Route exact path={`/`} component={HomePage} />
    </Switch>
  );
}
