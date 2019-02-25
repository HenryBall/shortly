import React, { Component } from 'react';
import axios from "axios";
import './App.css';

class App extends Component {
 
  state = {
    url: "",
    baseUrl: "",
    reqUrl: "",
  };

  setNodeEnv() {
    if (process.env.NODE_ENV === 'production') {
      this.setState({baseUrl: "https://zipurl.me"});
      this.setState({reqUrl: "https://zipurl.me"});
    } else {
      this.setState({baseUrl: "http://localhost"});
      this.setState({reqUrl: "http://localhost:5000"});
    }
  }

  componentDidMount() {
    this.setNodeEnv();
    console.log("we're in " + process.env.NODE_ENV + " mode");
  }

  componentWillUnmount() {
    
  }

  handleInputChange(event) {
    this.setState({url: event.target.value});
  }

  shortenUrl = () => {
    const url = this.state.url;
    const baseUrl = this.state.baseUrl
    axios.post(this.state.reqUrl + "/shorten", {
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
            <span id="logo-img"></span>
            <span id="logo">ZipURL</span>
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
