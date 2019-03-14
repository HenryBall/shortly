// npm imports
import React, { Component } from 'react';
import axios from 'axios';

// component imports
import Nav from './root_components/nav';
import Shorten from './root_components/shorten';

// style imports
import '../css/user.css'

// require dotenv package for managing env variables
require('dotenv').config();

class Home extends Component {

  state= {
    
  };

  componentDidMount() {
    console.log("we're in " + process.env.NODE_ENV + " mode in the user component");
  }

	render() {
		return (
			<div>
				Hey
      </div>
		);
	}
}

export default Home;