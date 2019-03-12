import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../css/footer.css'

class Footer extends Component {
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
							>{this.props.numLinks}</div>
      					<div id='link-count-text'>LINKS SHORTENED AND COUNTING</div>
      				</div>
      			</div>
      		</div>
		);
	}
}

export default Footer;