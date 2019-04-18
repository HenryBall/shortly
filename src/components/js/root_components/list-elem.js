// npm imports
import React, { Component } from 'react';

// style imports
import '../../css/root_components/list-elem.css'

// require dotenv package for managing env variables
require('dotenv').config();

class ListElem extends Component {

  cleanUpDate(date) {
    const d =  new Date(date)
    return String(d.getMonth() + 1) + ' / ' + String(d.getDate());
  }

	render() {
		return (
      <li key={this.props.index} className={this.props.isSelected ? 'selected' : ''}>
        <div className='cell-content'>
          <div className='light-grey-color date'>{this.cleanUpDate(this.props.value.createdAt)}</div>
          <div className='dark-grey-color url'>{this.props.value.url}</div>
          <div className='yellow-color shortUrl'>{this.props.value.shortUrl}</div>
        </div>
      </li>
		);
	}
}

export default ListElem;