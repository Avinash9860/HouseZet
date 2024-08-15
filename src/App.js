import { Route, Switch } from "react-router-dom";
import "./App.css";
import Authenticated from "./Components/Authenticated";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard}>
        <Authenticated>
          <Dashboard />
        </Authenticated>
      </Route>
      <Route exact path="/login" component={Login}>
        <Authenticated nonAuthenticated={true}>
          <Login />
        </Authenticated>
      </Route>
      <Route path="*" render={() => "404 Not found"} />
    </Switch>
  );
}

export default App;
