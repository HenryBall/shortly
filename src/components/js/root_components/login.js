// npm imports
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// style imports
import '../../css/root_components/login.css'

// require dotenv package for managing env variables
require('dotenv').config();

// api and server variables
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL;
const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_SERVER : process.env.REACT_APP_LOCAL_SERVER;
const url = ( server === "" ) ? String(apiUrl) : String(apiUrl) + String(server);

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
    	email: '',
    	password: '',
      redirect: '',
  	};
  	this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentDidMount() {
    console.log("we're in " + process.env.NODE_ENV + " mode in the login component");
  }

  handleLogin() {
  	axios.post('https://zipurl.me' + '/login', {
      email: this.state.email,
      password: this.state.password,
    }).then( res => {
      const user = res.data.user;
      if (user) {
        localStorage.setItem('curUser', JSON.stringify(res.data.user));
        this.props.handleLogin();
      } else {
        console.log('unable to log in');
      }
    })
    .catch( err => {
      	console.log(err);
    });
  }

  handleInputChange(event) {
  	const target = event.target;
  	const value = target.value;
  	const name = target.name;
    this.setState({
      [name]: value
    });
  }

	render() {
    // if the user logs in or is already logged in redirect to the user component

		return (
			<div id='login-container'>
				<div id='login-box'>
					<div id='signin-title' className='yellow-color'>ZIP</div>
					<div id='signin-subtitle' className='dark-grey-color'>SIGN IN & GET STARTED</div>
					<input
						className='signin-input'
						placeholder='email'
						name='email'
						value={this.state.email}
						onChange={this.handleInputChange}
					/>
					<input
						className='signin-input'
						placeholder='password'
						type='password'
						name='password'
						value={this.state.password}
						onChange={this.handleInputChange}
					/>
        	<button 
        		id='signin-btn'
            className='yellow-color-back'
        		onClick={() => this.handleLogin()}>
        			sign in
        	</button>
        	<div id='signin-footer' className='dark-grey-color'>Don't have an account?
        		<Link 
        			to='/sign_up'
        			className='react-link yellow-color'
        			> Sign Up
        		</Link>
        	</div>
				</div>
			</div>
		);
	}
}

export default Login;