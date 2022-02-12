import React from "react";
import { Switch, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Cart from "./Cart";
import OrderView from "components/OrderView";
export default function UserRouting({ match: { path } }) {
  return (
    <Switch>
      <Route exact path={`${path}/cart`} component={Cart} />
      <Route
        exact
        path={`${path}/history`}
        component={() => <OrderView type="user" />}
      />
      <Route exact path={`${path}`} component={() => <Redirect to="/" />} />
    </Switch>
  );
}
