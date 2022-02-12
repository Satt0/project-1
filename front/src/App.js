import { Switch, Route } from 'react-router'
import routes from 'pages/routes';
import Layout from 'components/Layout';

function App() {
 
  return (
    <div className="App">
     
      <Layout>
        <Switch>
          {routes.map((route, index) => <Route path={route.path} key={'page-' + index} component={route.Page}></Route>)}
        </Switch>

      </Layout>
    </div>
  );
}

export default App;
