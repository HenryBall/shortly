import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../css/login.css'

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			apiUrl: '',
    		email: '',
    		password: '',
  		};
  		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentDidMount() {
    	this.setNodeEnv();
    	console.log("we're in " + process.env.NODE_ENV + " mode");
  	}

	setNodeEnv() {
    	if (process.env.NODE_ENV === 'production') {
    		this.setState({apiUrl: 'https://zipurl.me'});
    	} else {
      		this.setState({apiUrl: 'http://localhost:5000'});
    	}
  	}

  	handleLogin() {
  		axios.post(this.state.apiUrl + '/login', {
      		email: this.state.email,
      		password: this.state.password,
    	}).then( res => {

    	})
    	.catch( err => {
      		console.log(err.response.data);
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
		return (
				<div id='login-container'>
					<div id='login-box'>
						<div id='signin-title' className='yellow-color'>ZipURL</div>
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
        				<div id='signin-footer'>Don't have an account?
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