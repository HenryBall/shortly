// npm imports
import React, { Component } from 'react';
import axios from 'axios';

// component imports
import Nav from './root_components/nav';
import Shorten from './root_components/shorten';
import Footer from './root_components/footer';

// style imports
import '../css/home.css'

// require dotenv package for managing env variables
require('dotenv').config();

class Home extends Component {

  state= {
    numLinks: '',
    numRedirects: '',
  };

  componentDidMount() {
    this.getNumLinks();
    this.getNumRedirects();
    console.log("we're in " + process.env.NODE_ENV + " mode in the home component");
  }

  getNumLinks = () => {
    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL
    const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_SERVER : process.env.REACT_APP_LOCAL_SERVER
    axios.post(apiUrl + server + '/num_links', {
      // no data to send
    }).then( res => {
      console.log("hey")
      const count = String(res.data);
      this.setState({numLinks: count});
    })
    .catch( err => {
        console.log(err.response.data);
    });
  }

  getNumRedirects = () => {
    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL
    const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_SERVER : process.env.REACT_APP_LOCAL_SERVER
    axios.post(apiUrl + server + '/num_redirects', {
      // no data to send
    }).then( res => {
      console.log()
      const count = String(res.data);
      this.setState({numRedirects: count});
    })
    .catch( err => {
        console.log(err.response.data);
    });
  }

	render() {
		return (
			<div>
				<div className='top'>
          <Nav/>
          <Shorten updateNumLinks={this.getNumLinks}/>
        </div>
        <div className='bottom'>
          <Footer numLinks={this.state.numLinks} numRedirects={this.state.numRedirects}/>
        </div>
      </div>
		);
	}
}

export default Home;