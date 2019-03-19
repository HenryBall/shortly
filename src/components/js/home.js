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

// api and server variables
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL;
const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_SERVER : process.env.REACT_APP_LOCAL_SERVER;

// axios cancel token
const cancelToken = axios.CancelToken;
const source = cancelToken.source();

class Home extends Component {
  // keeps track of mounted state so we don't try to call setState in async functions after the component has benn unmounted
  _isMounted = false;


  state= {
    numLinks: '',
    numRedirects: ''
  };

  componentDidMount() {
    this._isMounted = true;
    // get the total number of links with a post request
    this.getNumLinks();
    // get the total number of clicks with a post request
    this.getNumRedirects();
    console.log("we're in " + process.env.NODE_ENV + " mode in the home component");
  }

  componentWillUnmount() {
    this._isMounted = false;
    // cancel all asyc operations when the component is unmounted
    // source.cancel('operation canceled');
  }

  getNumLinks = () => {
    axios.post(apiUrl + server + '/num_links', {
      // no data to send
    }, {
      // send cancel token in case the component is unmounted
      cancelToken: source.token
    }).then( res => {
      const count = String(res.data);
      if (this._isMounted) { this.setState({numLinks: count}); }
    })
    .catch( err => {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        console.log(err);
      }
    });
  }

  getNumRedirects = () => {
    axios.post(apiUrl + server + '/num_redirects', {
      // no data to send
    }, {
      // send cancel token in case the component is unmounted
      cancelToken: source.token
    }).then( res => {
      const count = String(res.data);
      if (this._isMounted) { this.setState({numRedirects: count}); }
    })
    .catch( err => {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        console.log(err);
      }
    });
  }

	render() {
		return (
			<div>
				<div className='top'>
          <Nav isLoggedIn={this.props.isLoggedIn}/>
          <Shorten updateLinks={this.getNumLinks} userId={null}/>
        </div>
        <div className='bottom'>
          <Footer numLinks={this.state.numLinks} numRedirects={this.state.numRedirects}/>
        </div>
      </div>
		);
	}
}

export default Home;