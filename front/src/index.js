import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import {store} from './store'
import {BrowserRouter as Router} from 'react-router-dom';
import 'assets/css/global.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <Provider store={store}>
      <ApolloProvider client={client}>
      <App />
      </ApolloProvider>
    </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
