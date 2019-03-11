import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../css/footer.css'

class Footer extends Component {

	state = {
		numLinks: '',
		apiUrl: '',
	};

	handleInputChange(event) {
    	this.setState({numLinks: event.target.value});
  	}


	// MOVE SOMEWHERE GLOBALLY!!!!!!!!!!!
	componentDidMount() {
    	this.setNodeEnv();
    	this.getNumLinks();
    	console.log("we're in " + process.env.NODE_ENV + " mode");
  	}

	setNodeEnv() {
    	if (process.env.NODE_ENV === 'production') {
    		this.setState({apiUrl: 'https://zipurl.me'});
    	} else {
      		this.setState({apiUrl: 'http://localhost:5000'});
    	}
  	}

  	getNumLinks() {
  		console.log("hahahahahah")
  		axios.post(this.state.apiUrl + '/num_links', {

    	}).then( res => {
    		const count = String(res.data);
      		this.setState({numLinks: count});
    	})
    	.catch( err => {
      		console.log(err.response.data);
    	});
  	}

	render() {
		return (
			<div className='footer'>
				<div id='squeeze'>
					<div id='title' className='dark-grey-color'>GET MORE OUT OF YOUR LINKS</div>
					<div id='sub-text' className='light-grey-color'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
      				<button id="footer-btn" className="dark-blue-color-back white-color">
      					<Link to='/sign_up' className='react-link white-color'>GET STARTED</Link>
      				</button>
      				<div>
      					<div 
      						id='link-count'
      						name='numLinks'
							>{this.state.numLinks}</div>
      					<div id='link-count-text'>LINKS SHORTENED AND COUNTING</div>
      				</div>
      			</div>
      		</div>
		);
	}
}

export default Footer;