// npm imports
import React, { Component } from 'react';
import axios from 'axios';

// style imports
import '../../css/root_components/shorten.css'

// require dotenv package for managing env variables
require('dotenv').config();

// api and server variables
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL;
const baseUrl = process.env.NODE_ENV === 'production' ? 'https://zipurl.me' : 'http://localhost';

// shorten component
class Shorten extends Component {

	state = {
    url: '',
  };

  handleInputChange(event) {
    this.setState({url: event.target.value});
  }

  componentDidMount() {
    console.log("we're in " + process.env.NODE_ENV + " mode in the shorten component");
  }

  shortenUrl = () => {
    axios.post(apiUrl + '/api/shorten', {
      	url: this.state.url,
      	baseUrl: baseUrl,
        // if the user is not logged in the id will be null
        userId: this.props.userId,
    }).then( res => {
        // get the short url from the request body
      	const shortUrl = String(res.data.shortUrl);
        // set new url state to update UI with short url
      	this.setState({url: shortUrl});
        // get new num links if in home.js or user links if in user.js 
        this.props.updateLinks(res.data);
    }).catch( err => {
      console.log(err);
      	this.props.throwWarning(err.response.data);
    });
  }

	render() {
		return (
			<div className='shorten dark-blue-color-back'>
    			<div id='tag-line'>Shorten, Simplify, <span className='yellow-color'>Streamline</span>.</div>
    			<div id='inputContainer'>
        			<input
                  id='shorten-input'
                  className='dark-grey-color'
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