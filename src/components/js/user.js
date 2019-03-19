// npm imports
import React, { Component } from 'react';
import axios from 'axios';

// component imports
import Nav from './root_components/nav';
import Shorten from './root_components/shorten';
import List from './root_components/list-elem';

// style imports
import '../css/user.css'

// require dotenv package for managing env variables
require('dotenv').config();

// api and server variables
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL;
const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_SERVER : process.env.REACT_APP_LOCAL_SERVER;

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      userToken: '',
      linkId: '',
      listItems: [],
      selectedLink: 'No link selected',
      date: '',
      shortUrl: '',
      clicks: '',
      deleteActive: false,
    };
  }

  componentDidMount() {
    // get the 'curUser' item from local storage
    const user = JSON.parse(localStorage.getItem('curUser'));
    const id = String(user._id);
    const token = String(user.token);
    if (user) { this.setUserInfo(id, token); }
    console.log("we're in " + process.env.NODE_ENV + " mode in the user component");
  }

  resetState() {
    this.setState({linkId: ''});
    this.setState({date: ''});
    this.setState({selectedLink: 'No link selected'});
    this.setState({shortUrl: ''});
    this.setState({clicks: ''});
    this.setState({deleteActive: false});
  }

  async setUserInfo(id, token) {
    await this.setState({userId: id});
    await this.setState({userToken: token});
    this.getUserLinks();
  }

  getUserLinks = () => {
    axios.post(apiUrl + server + '/user_links', {
      // send the user's token in the request headers
      headers: {
        'authorization': this.state.userToken,
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
      },
      userId: this.state.userId,
    }).then( res => {
        this.setState({listItems: res.data});
    }).catch( err => {
        console.log(err);
    });
  }

  setSelectedLink = (linkObj) => {
    console.log(linkObj)
    const d =  new Date(linkObj.createdAt).toDateString();
    this.setState({linkId: linkObj._id});
    this.setState({date: 'CREATED ON: ' + d});
    this.setState({selectedLink: linkObj.url});
    this.setState({shortUrl: linkObj.shortUrl});
    this.setState({clicks: 'TOTAL CLICKS: ' + linkObj.clicks});
    this.setState({deleteActive: true});
  }

  handleDelete() {
    axios.post(apiUrl + server + '/delete_user_link', {
      // send the user's token in the request headers
      headers: {
        'authorization': this.state.userToken,
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
      },
      userId: this.state.userId,
      linkId: this.state.linkId,
    }).then( res => {
        console.log(res.data);
        this.setState({listItems: res.data});
        this.resetState();
    }).catch( err => {
        console.log(err);
    });
  }

	render() {
		return (
      <div>
        <div className='top'>
          <Nav isLoggedIn={this.props.isLoggedIn} handleLogout={this.props.handleLogout}/>
				  <Shorten updateLinks={this.getUserLinks} userId={this.state.userId}/>
        </div>
        <div className='bottom-fixed'>
          <div className='third'>
            <List listItems={this.state.listItems} setSelectedLink={this.setSelectedLink}/>
          </div>
          <div className='two-thirds'>
            <div className='light-grey-color' id='date'>{this.state.date}</div>
            <div className='dark-grey-color' id='main-link'>{this.state.selectedLink}</div>
            <div className='yellow-color' id='short-url'>{this.state.shortUrl}</div>
            <div className='light-grey-color' id='clicks'>{this.state.clicks}</div>
            <div
              className={this.state.deleteActive ? 'delete-btn-active': 'delete-btn-not-active'}
              onClick={() => this.handleDelete()}>
              DELETE
            </div>
          </div>
        </div>
      </div>
		);
	}
}

export default Home;