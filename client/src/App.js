import React, { Component } from 'react';
import axios from "axios";
import './App.css';

class App extends Component {
  // initialize our state 
  state = {
    url: "",
  };

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }

  handleInputChange(event) {
    this.setState({url: event.target.value});
  }

  shortenUrl = () => {
    const url = this.state.url;
    const baseUrl = "http://localhost"
    axios.post("http://localhost:3001/api/item", {
      url: url,
      baseUrl: baseUrl
    }).then( res => {
      const shortUrl = String(res.data.shortUrl);
      console.log(res);
      this.setState({url: shortUrl});
    })
    .catch( err => {
      console.log(err.response.data);
    });
  }

  getBaseUrl(url) {
    var pathArray = url.split( '/' );
    var protocol = pathArray[0];
    var host = pathArray[2];
    return protocol + '//' + host;
  }

  render() {
    return (
        <div className="fill">
          <div className="logo">
            <div id="logo">Minly</div>
          </div>
          <div className="center">
            <div id="tag-line">Shorten, Simplify, <span id="tag-line-color">Streamline</span>.</div>
            <div id="inputContainer">
              <input
                type="text"
                value={this.state.url}
                onChange={this.handleInputChange.bind(this)}
                placeholder="Paste a link to shorten it"
              />
              <button
                id="shortenBtn"
                onClick={() => this.shortenUrl()}>
                Shorten
              </button>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
