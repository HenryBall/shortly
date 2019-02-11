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

/*
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };
*/

  render() {
    return (
        <div className="center">
          <h1>Get more out of your links. </h1>
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
    );
  }
}

export default App;
