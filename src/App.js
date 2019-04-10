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
import WarningBanner from './components/js/root_components/warning';

// style imports (will be global)
import './App.css';

// api and server variables
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL;

// entire app rendered as one component
class App extends Component {

    state = {
        isLoggedIn: false,
        showWarning: false,
        warningMessage: '',
    };

    // called on page refresh
    componentDidMount() {
        // get the 'curUser' item from local storage
        const user = JSON.parse(localStorage.getItem('curUser'));
        // if there is a user, verify web token on page refresh
        if (user) { this.verifyToken(user.token); }
        console.log("we're in " + process.env.NODE_ENV + " mode in the App component");
    }

    verifyToken(token) {
        // must set post data as null to send headers properly
        axios.post(apiUrl + '/api/verify_token', null, {
            // send the token in the request headers
            headers: {
                'authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            } 
        }).then( res => {
            // if the token is valid, log the user in
            this.setState({isLoggedIn: true});
        }).catch( err => {
            // if the token is no longer valid, tell them to log in again
            this.throwWarning(err.response.data)
            // remove the user from local storage
            this.handleLogout();
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

    throwWarning = (message) => {
        this.setState({showWarning: true, warningMessage: message});
    }

    dismissWarning = () => {
        this.setState({showWarning: false, warningMessage: ''});
    }

    render() {
        return (
            <div>
                <WarningBanner warn={this.state.showWarning} message={this.state.warningMessage} dismiss={this.dismissWarning} />
                <Switch>
                    <Route exact path="/user" render={ () => this.checkAuth(User, { 
                        handleLogout: this.handleLogout,
                        throwWarning: this.throwWarning,
                    })} />

                    <Route exact path='/' render={ () => this.checkUnAuth(Home, { 
                        isLoggedIn: this.state.isLoggedIn ,
                        throwWarning: this.throwWarning,
                    })} />

                    <Route exact path='/login' render={ () => this.checkUnAuth(Login, { 
                        handleLogin: this.handleLogin,
                        throwWarning: this.throwWarning,
                    })} />

                    <Route exact path='/sign_up' render={ () => this.checkUnAuth(SignUp, { 
                        handleLogin: this.handleLogin,
                        throwWarning: this.throwWarning,
                    })} />
                </Switch>
            </div>
        );
    }
}

export default App;
