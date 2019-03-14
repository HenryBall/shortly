// npm imports
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

// component imports
import Home from './components/js/home';
import User from './components/js/user';
import Login from './components/js/root_components/login';
import SignUp from './components/js/root_components/signup';

// style imports (will be global)
import './App.css';

// entire app rendered as one component
class App extends Component {
  render() {
    return (
    	<Switch>
    		<Route exact path='/' component={Home} />
    		<Route exact path='/user' component={User} />
    		<Route exact path='/login' component={Login} />
    		<Route exact path='/sign_up' component={SignUp} />
    	</Switch>
    );
  }
}

export default App;
