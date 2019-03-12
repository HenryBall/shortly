// npm imports
import React, { Component } from 'react';
import axios from 'axios';

// component imports
import Nav from './nav';
import Shorten from './shorten';
import Footer from './footer';

// style imports
import '../css/home.css'

// split page into top and bottom and populate each
// top is a fixed height while bottom will scroll based on the amount of content
class Guest extends Component {

  state= {
    links: '',
    apiUrl: '',
  };

  componentDidMount() {
      this.setNodeEnv();
      this.getNumLinks();
      console.log("we're in " + process.env.NODE_ENV + " mode in the home component");
  }

  setNodeEnv() {
      if (process.env.NODE_ENV === 'production') {
        this.setState({apiUrl: 'https://zipurl.me'});
      } else {
          this.setState({apiUrl: 'http://localhost:5000'});
      }
  }

  getNumLinks() {
    axios.post(this.state.apiUrl + '/num_links', {
      // no data to send
    }).then( res => {
      const count = String(res.data);
      this.setState({links: count});
    })
    .catch( err => {
        console.log('shit!')
        console.log(err.response.data);
    });
  }

  handleShorten = () => {
    this.getNumLinks();
  }

	render() {
		return (
			<div>
				<div className='top'>
          <Nav/>
          <Shorten updateNumLinks={this.handleShorten}/>
        </div>
        <div className='bottom'>
          <Footer numLinks={this.state.links}/>
        </div>
      </div>
		);
	}
}

export default Guest;