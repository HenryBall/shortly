// npm imports
import React, { Component } from 'react';
import axios from 'axios';

// style imports
import '../../css/root_components/shorten.css'

// require dotenv package for managing env variables
require('dotenv').config();

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
    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL
    const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_SERVER : process.env.REACT_APP_LOCAL_SERVER
    axios.post(apiUrl + server + '/shorten', {
      	url: this.state.url,
      	baseUrl: apiUrl
    }).then( res => {
      	const shortUrl = String(res.data.shortUrl);
      	this.setState({url: shortUrl}); 
        this.props.updateNumLinks();
    })
    .catch( err => {
      	console.log(err.response);
    });
  }

	render() {
		return (
			<div className='shorten'>
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