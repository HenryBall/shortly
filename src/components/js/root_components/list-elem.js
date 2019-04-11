// npm imports
import React, { Component } from 'react';

// component imports


// style imports
import '../../css/root_components/list-elem.css'

// require dotenv package for managing env variables
require('dotenv').config();

class List extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  componentWillReceiveProps(props) {
    // if we delete an element, such that our selected index is no longer valid
    if (this.state.selectedIndex >= this.props.listItems.length) {
      this.setState({selectedIndex: 0});
    }
  }

  handleClick(index, value) {
    this.setState({selectedIndex: index['index']});
    this.props.setSelectedLink(value['value']);
  }

  pluralize(count) {
    if (Number(count) === 1) {
      return 'LINK'
    }
    return 'LINKS'
  }

  beautifyDate(date) {
    const d =  new Date(date)
    return String(d.getMonth()) + ' / ' + String(d.getDate());
  }

	render() {
		return (
      <div>
        <div id='list-title-container'>
          <div id='list-title' className='light-grey-color'>{this.props.listItems.length} {this.pluralize(this.props.listItems.length)}</div>
        </div>
        <ul>
          {this.props.listItems.map((value, index) => {
            return <li key={index} className={this.state.selectedIndex === index ? 'selected' : ''} onClick={() => this.handleClick({index}, {value})}>
              <div className='cell-content'>
                <div className='light-grey-color date'>{this.beautifyDate(value.createdAt)}</div>
                <div className='dark-grey-color url'>{value.url}</div>
                <div className='yellow-color shortUrl'>{value.shortUrl}</div>
              </div>
            </li>
          })}
        </ul>
      </div>
		);
	}
}

export default List;