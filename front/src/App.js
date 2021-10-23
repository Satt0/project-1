import {Switch,Route} from 'react-router'
import routes from 'pages/routes';
function App() {
  return (
    <div className="App">
      <Switch>
      {routes.map((route,index)=><Route key={'page-'+index} component={route.Page}></Route>)}
      </Switch>
    </div>
  );
}

export default App;
