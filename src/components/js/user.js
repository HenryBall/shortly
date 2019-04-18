// npm imports
import React, { Component } from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// component imports
import Nav from './root_components/nav';
import Shorten from './root_components/shorten';
import ListElem from './root_components/list-elem';
import Chart from './root_components/chart';

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
      listItems: [],
      sortBy: 'date',
      selectedIndex: 0,
      copyActive: false,
      deleteActive: false,
      dropDownActive: false,
      urlObj: {
        urlId: '',
        origUrl: '',
        shortUrl: '',
        date: '',
        clicks: '',
      },
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('curUser'));
    const id = String(user._id);
    const token = String(user.token);
    if (user) { this.setUserInfo(id, token); }
    console.log("we're in " + process.env.NODE_ENV + " mode in the user component");
  }

  async setUserInfo(id, token) {
    await this.setState({userId: id});
    await this.setState({userToken: token});
    this.getUserLinks();
  }

  makeUrlObj(urlId, origUrl, shortUrl, date, clicks) {
    const urlObj = {
      urlId: urlId,
      origUrl: origUrl,
      shortUrl: shortUrl,
      date: date,
      clicks: clicks
    }
    return urlObj;
  }

  resetState() {
    const emptyUrl = this.makeUrlObj('', '', '', '', '');
    this.setState({urlObj: emptyUrl});
    this.setState({copyActive: false});
    this.setState({deleteActive: false});
  }

  setSelectedUrl(urlObj) {
    const selectedUrl = this.makeUrlObj(
      urlObj._id, 
      urlObj.url, 
      urlObj.shortUrl,
      'CREATED ON: ' + new Date(urlObj.createdAt).toDateString(), 
      'TOTAL CLICKS: ' + urlObj.clicks);
    this.setState({urlObj: selectedUrl});
    this.setState({copyActive: true});
    this.setState({deleteActive: true});
  }

  sortList(list, selection) {
    var sorted = [];
    if (selection === 'clicks') {
      sorted = list.sort((a, b) => (a.clicks < b.clicks) ? 1 : -1)
    } else if (selection === 'date') {
      sorted = list.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1)
    } else {
      sorted = list.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1)
    }
    return sorted;
  }

  pluralize(count) {
    if (Number(count) === 1) {
      return 'LINK'
    }
    return 'LINKS'
  }

  handleClick(index, value) {
    this.setState({selectedIndex: index['index']});
    this.setSelectedUrl(value['value']);
  }

  handleDropdownSelection(selection) {
    if (this.state.listItems.length === 0){ return }
    const sorted = this.sortList(this.state.listItems, selection);
    this.setState({listItems: sorted});
    this.setState({sortBy: selection});
    this.setSelectedUrl(sorted[0]);
    this.setState({selectedIndex: 0});
    this.setState({dropDownActive: false});
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
        if (res.data.length > 0) {
          const sorted = this.sortList(res.data, this.state.sortBy);
          this.setState({listItems: sorted});
          this.setSelectedUrl(sorted[0]);
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
      linkId: this.state.urlObj.urlId
    }, {
      // send the user's token in the request headers
      headers: {
        'authorization': this.state.userToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then( res => {
      // sort the urls returned
      const sorted = this.sortList(res.data, this.state.sortBy);
      // update the list
      this.setState({listItems: sorted});
      if (sorted.length > 0) {
        // reset the selected element
        this.setState({selectedIndex: 0})
        this.setSelectedUrl(sorted[0]);
      } else {
        // if we delete the last link, set state to be empty
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

        { /* this is where the shorten and nav components go */ }
        <div className='top'>
          <Nav isLoggedIn={true} handleLogout={this.props.handleLogout}/>
				  <Shorten updateLinks={this.getUserLinks} userId={this.state.userId} throwWarning={this.props.throwWarning}/>
        </div>

        { /* this is the bottom component, it will fill up the remainder of the page */ }
        <div className='bottom-fixed'>
          { /* this is the left third */ }
          <div className='third'>
            <div className='whole-list'>

              { /* this is the list title and dropdown menu */ }
              <div id='list-title-container'>
                <div id='list-title' className='light-grey-color'>{this.state.listItems.length} {this.pluralize(this.state.listItems.length)}</div>
                <div className='sort-by' onClick={() => this.setState({dropDownActive: !this.state.dropDownActive})}>
                  <div className='sort-by-img'></div>
                  <div className='light-grey-color'>SORT BY</div>
                </div>
              </div>
              <div className={this.state.dropDownActive ? 'drop-down-active' : 'hide'}>
                <div className='drop-down-item light-grey-color' onClick={() => this.handleDropdownSelection('date')}>Most recent</div>
                <div className='drop-down-item light-grey-color' onClick={() => this.handleDropdownSelection('clicks')}>Most clicks</div>
              </div>

              { /* this is the list of user links */ }
              <ul>
                {this.state.listItems.map((value, index) => {
                  return <div key={index} onClick={() => this.handleClick({index}, {value})}>
                    <ListElem
                      value={value}
                      index={index} 
                      isSelected={index === this.state.selectedIndex ? true : false}
                    />
                  </div>
                })}
              </ul>
            </div>
          </div>

          { /* this is the rigth 2 thirds */ }
          <div className='two-thirds'>
            <div className='light-grey-color' id='date'>{this.state.urlObj.date}</div>
            <div id='main-link'><a className='dark-grey-color linky' href={this.state.urlObj.origUrl}>{this.state.urlObj.origUrl}</a></div>
            <div className='one-line'>
              <div className='yellow-color' id='short-url'>{this.state.urlObj.shortUrl}</div>
                <CopyToClipboard text={this.state.urlObj.shortUrl}>
                  <div className={this.state.copyActive ? 'copy-btn-active': 'copy-btn-not-active'}>COPY</div>
                </CopyToClipboard>
            </div>
            <div className='light-grey-color' id='clicks'>{this.state.urlObj.clicks}</div>
            <div
              className={this.state.deleteActive ? 'delete-btn-active': 'delete-btn-not-active'}
              onClick={() => this.handleDelete()}>
              DELETE
            </div>
            <div className='chart-container'>
              <Chart className='dark-blue-color' urlId={this.state.urlObj.urlId}/>
            </div>
          </div>
        </div>
      </div>
		);
	}
}

export default Home;