// npm imports
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import axios from 'axios';

// component imports
import Home from './components/js/home';
import User from './components/js/user';
import Login from './components/js/root_components/login';
import SignUp from './components/js/root_components/signup';

// style imports (will be global)
import './App.css';

// api and server variables
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL;

// entire app rendered as one component
class App extends Component {

    state = {
        isLoggedIn: false,
    };

    // called on page refresh
    componentDidMount() {
        // get the 'curUser' item from local storage
        const user = JSON.parse(localStorage.getItem('curUser'));
        // if there is a user, verify web token on page refresh
        if (user) { this.verifyToken(user); }
        console.log("we're in " + process.env.NODE_ENV + " mode in the App component");
    }

    verifyToken(user) {
        axios.post(apiUrl + '/api/verify_token', {
            token: user.token,
        }).then( res => {
            this.setState({isLoggedIn: true});
        }).catch( err => {
            console.log(err);
        });
    }

    renderProps = (Component, props) => {
        return (
            <Component {...props} />
        );
    }

    checkAuth = (Component, props) => {
        if (this.state.isLoggedIn) {
            return <Component {...props} />
        } else {
            return <Redirect to='/' />
        }
    }

    checkUnAuth = (Component, props) => {
        if (!this.state.isLoggedIn) {
            return <Component {...props} />
        } else {
            return <Redirect to='/user' />
        }
    }

    handleLogin = () => {
        this.setState({isLoggedIn: true});
    }

    handleLogout = () => {
        localStorage.removeItem('curUser');
        this.setState({isLoggedIn: false});
    }

    render() {
        return (
            <div>

                <Switch>

                    <Route exact path="/user" render={ () => this.checkAuth(User, { isLoggedIn: this.state.isLoggedIn, handleLogout: this.handleLogout })} />

                    <Route exact path='/' render={ () => this.checkUnAuth(Home, { isLoggedIn: this.state.isLoggedIn })} />

                    <Route exact path='/login' render={ () => this.checkUnAuth(Login, { handleLogin: this.handleLogin })} />

                    <Route exact path='/sign_up' render={ () => this.checkUnAuth(SignUp, { handleLogin: this.handleLogin })} />
                
                </Switch>
            </div>
        );
    }
}

export default App;
