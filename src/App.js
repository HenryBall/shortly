// npm imports
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

// component imports
import Home from './components/js/home';
import Login from './components/js/login';
import SignUp from './components/js/signup';

// style imports (will be global)
import './App.css';

// entire app rendered as one component
class App extends Component {
  render() {
    return (
    	<Switch>
    		<Route exact path='/' component={Home} />
    		<Route exact path='/login' component={Login} />
    		<Route exact path='/sign_up' component={SignUp} />
    	</Switch>
    );
  }
}

export default App;
