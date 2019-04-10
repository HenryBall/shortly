// npm imports
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// style imports
import '../../css/root_components/nav.css'

// fixed height nav bar with flexible width
class Nav extends Component {

    handleLogout() {
        this.props.handleLogout();
    }

	render() {
        let links;
        if (this.props.isLoggedIn) {
            links = (
                <div id="links">
                   <button className='nav-btn'>
                        <Link to='/' id='login-btn' className='btn-hover react-link dark-blue-color'
                            onClick={() => this.handleLogout()}>
                            LOGOUT
                        </Link>
                   </button>
                </div>
            )
        } else {
            links = (
                <div id="links">
                   <button className='nav-btn'>
                        <Link to='/login' id='login-btn' className='btn-hover react-link dark-blue-color'>LOGIN</Link>
                   </button>
                    <button className='nav-btn'>
                        <Link to='/sign_up' className='btn-hover react-link dark-blue-color'>SIGN UP</Link>
                    </button>
                </div>
            )
        }

		return (
			<div className='nav'>
            	<div id='logo' className='dark-blue-color'>ZIP</div>
                {links}
    		</div>
		);
	}
}

export default Nav;