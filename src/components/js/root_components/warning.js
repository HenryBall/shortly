// npm imports
import React, { Component } from 'react';

// style imports
import '../../css/root_components/warning.css'

class Warning extends Component {

    render() {
        if (!this.props.warn) {
            return null;
        }

        return (
            <div className='warning'>
                <div className='message dark-grey-color'>{this.props.message}</div>
                <div className='dismiss-btn dark-grey-color' onClick={() => this.props.dismiss()}>X</div>
            </div>
        );
    }
}

export default Warning;
