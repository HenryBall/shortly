import React, { Component } from 'react';
import axios from 'axios';

import '../css/shorten.css'

class Shorten extends Component {

	state = {
    url: '',
    baseUrl: '',
    reqUrl: '',
  };

	setNodeEnv() {
    if (process.env.NODE_ENV === 'production') {
    	this.setState({baseUrl: 'https://zipurl.me'});
      this.setState({reqUrl: 'https://zipurl.me'});
    } else {
      this.setState({baseUrl: 'http://localhost'});
      this.setState({reqUrl: 'http://localhost:5000'});
    }
  }

  componentDidMount() {
    this.setNodeEnv();
    console.log("we're in " + process.env.NODE_ENV + " mode");
  }

  handleInputChange(event) {
    this.setState({url: event.target.value});
  }

  shortenUrl = () => {
    const url = this.state.url;
    const baseUrl = this.state.baseUrl
    axios.post(this.state.reqUrl + '/shorten', {
      	url: url,
      	baseUrl: baseUrl
    }).then( res => {
      	const shortUrl = String(res.data.shortUrl);
      	this.setState({url: shortUrl});
    })
    .catch( err => {
      	console.log(err.response.data);
    });
  }

	render() {
		return (
			<div className='shorten'>
    			<div id='tag-line'>Shorten, Simplify, <span className='yellow-color'>Streamline</span>.</div>
    			<div id='inputContainer'>
        			<input
                  id='shorten-input'
            			type='text'
            			value={this.state.url}
            			onChange={this.handleInputChange.bind(this)}
            			placeholder='Paste a link to shorten it'
        			/>
        			<button
            			id='shorten-btn'
                  className='yellow-color-back white-color'
            			onClick={() => this.shortenUrl()}>
            			SHORTEN
        			</button>
    			</div>
			</div>
		);
	}
}

export default Shorten;