import './App.css';
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import GuestHome from './components/js/guestHome';
import Login from './components/js/login';
import SignUp from './components/js/signup';

class App extends Component {
  render() {
    return (
    	<Switch>
    		<Route exact path='/' component={GuestHome} />
    		<Route exact path='/login' component={Login} />
    		<Route exact path='/sign_up' component={SignUp} />
    	</Switch>
    );
  }
}

export default App;
