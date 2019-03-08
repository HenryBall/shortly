import React, { Component } from 'react';

import Nav from './nav';
import Shorten from './shorten';
import Footer from './footer';

import '../css/guestHome.css'

class Guest extends Component {

	render() {
		return (
			<div className='whole-page'>
				<div className='top'>
          			<Nav/>
          			<Shorten/>
          		</div>
          		<div className='bottom'>
          			<Footer/>
          		</div>
      		</div>
		);
	}
}

export default Guest;