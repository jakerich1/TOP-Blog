import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import SinglePost from './components/SinglePost/SinglePost';

function App() {
  return (
    <div className="App">
      <Switch>

        <Route path="/login">
          <Login />
        </Route>

        <Route exact path="/Dashboard">
          <Dashboard />
        </Route>

        <Route exact path="/">
          <Dashboard />
        </Route>

        <Route exact path="/post/:id">
          <SinglePost />
        </Route>

      </Switch>
    </div>
  );
}

export default App;
