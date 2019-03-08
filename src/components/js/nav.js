import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../css/nav.css'

class Nav extends Component {

	render() {
		return (
			<div className='nav'>
            	<div id='logo' className='white-color'>ZipURL</div>
                <div id="links">
            	   <button className='nav-btn'>
                        <Link to='/login' className='react-link white-color'>LOGIN</Link>
        	       </button>
                    <button className='nav-btn'>
                        <Link to='/sign_up' className='react-link white-color'>SIGN UP</Link>
                    </button>
                </div>
    		</div>
		);
	}
}

export default Nav;