// npm imports
import React, { Component } from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      userToken: '',
      linkId: '',
      listItems: [],
      selectedLink: '',
      date: '',
      shortUrl: '',
      clicks: '',
      copyActive: false,
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
    this.setState({selectedLink: ''});
    this.setState({shortUrl: ''});
    this.setState({clicks: ''});
    this.setState({copyActive: false});
    this.setState({deleteActive: false});
  }

  setSelectedLink = (linkObj) => {
    const d =  new Date(linkObj.createdAt).toDateString();
    this.setState({linkId: linkObj._id});
    this.setState({date: 'CREATED ON: ' + d});
    this.setState({selectedLink: linkObj.url});
    this.setState({shortUrl: linkObj.shortUrl});
    this.setState({clicks: 'TOTAL CLICKS: ' + linkObj.clicks});
    this.setState({copyActive: true});
    this.setState({deleteActive: true});
  }

  async setUserInfo(id, token) {
    await this.setState({userId: id});
    await this.setState({userToken: token});
    this.getUserLinks();
  }

  getUserLinks = () => {
    axios.post(apiUrl + '/api/get_user_links', {
      // send the user id in the post data
      userId: this.state.userId 
    }, {
      // send the user's token in the request headers
      headers: {
        'authorization': this.state.userToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then( res => {
        this.setState({listItems: res.data});
        if (res.data.length > 0) {
          this.setSelectedLink(res.data[0]);
        }
    }).catch( err => {
      // catch error
      if (err.response.status === 401) {
        // if the user token is no longer valid, log them out
        this.props.handleLogout();
        this.props.throwWarning(err.response.data);
      } else {
        // otherwise throw generic warning
        this.props.throwWarning(err.response.data);
      }
    });
  }

  handleDelete() {
    axios.post(apiUrl + '/api/delete_user_link', {
      // send the user id and link to delete in the post data
      userId: this.state.userId,
      linkId: this.state.linkId
    }, {
      // send the user's token in the request headers
      headers: {
        'authorization': this.state.userToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then( res => {
        this.setState({listItems: res.data});
        if (res.data.length > 0) {
          this.setSelectedLink(res.data[0]);
        } else {
          this.resetState();
        }
    }).catch( err => {
      // catch error
      if (err.response.status === 401) {
        // if the user token is no longer valid, log them out
        this.props.handleLogout();
        this.props.throwWarning(err.response.data);
      } else {
        // otherwise throw generic warning
        this.props.throwWarning(err.response.data);
      }
    });
  }

	render() {
		return (
      <div>
        <div className='top'>
          <Nav isLoggedIn={true} handleLogout={this.props.handleLogout}/>
				  <Shorten updateLinks={this.getUserLinks} userId={this.state.userId} throwWarning={this.props.throwWarning}/>
        </div>
        <div className='bottom-fixed'>
          <div className='third'>
            <List listItems={this.state.listItems} setSelectedLink={this.setSelectedLink}/>
          </div>
          <div className='two-thirds'>
            <div className='light-grey-color' id='date'>{this.state.date}</div>
            <div id='main-link'><a className='dark-grey-color linky' href={this.state.selectedLink}>{this.state.selectedLink}</a></div>
            <div className='one-line'>
              <div className='yellow-color' id='short-url'>{this.state.shortUrl}</div>
                <CopyToClipboard text={this.state.shortUrl}>
                  <div className={this.state.copyActive ? 'copy-btn-active': 'copy-btn-not-active'}>COPY</div>
                </CopyToClipboard>
            </div>
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