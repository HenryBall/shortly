// npm imports
import React, { Component } from 'react';

// component imports
import Nav from './nav';
import Shorten from './shorten';
import Footer from './footer';

// style imports
import '../css/home.css'

// split page into top and bottom and populate each
// top is a fixed height while bottom will scroll based on the amount of content
class Guest extends Component {
	render() {
		return (
			<div>
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