// npm imports
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// style imports
import '../../css/root_components/nav.css'

// fixed height nav bar with flexible width
class Nav extends Component {
	render() {
		return (
			<div id='nav'>
            	<div id='logo' className='dark-blue-color'>ZIP</div>
                <div id="links">
            	   <button className='nav-btn'>
                        <Link to='/login' id='login-btn' className='react-link dark-blue-color'>LOGIN</Link>
        	       </button>
                    <button className='nav-btn'>
                        <Link to='/sign_up' className='react-link dark-blue-color'>SIGN UP</Link>
                    </button>
                </div>
    		</div>
		);
	}
}

export default Nav;