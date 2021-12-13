import React from "react";
import { Switch, Route } from "react-router-dom";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";
export default function AdminRouting({ match:{path} }) {
  
  return (
      <Switch>
        <Route
          exact
          path={`${path}/create-product`}
          component={CreateProduct}
        />
        <Route
          exact
          path={`${path}/edit-product/:id`}
          component={EditProduct}
        />
        <Route path="/">
          <h1>404</h1>
        </Route>
      </Switch>
  );
}
