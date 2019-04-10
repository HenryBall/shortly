// npm imports
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Odometer from 'react-odometerjs';

// style imports
import '../../css/root_components/footer.css'
import '../../css/root_components/odometer-theme-default.css'

class Footer extends Component {
      render() {
		return (
			<div className='content'>
				<div id='squeeze'>
					<div id='title' className='squeeze-more dark-grey-color'>GET MORE OUT OF YOUR LINKS</div>
					<div id='sub-text' className='squeeze-more light-grey-color'>Links are what drive the flow of information on the internet. Whether you want to simplify the link to your band's facebook profile or are running a small buisness, make sure your URLs are as efficient as possible with ZIP. Get started today!</div>
      				<Link to='/sign_up' id="footer-btn" className='react-link white-color dark-blue-color-back'>
                                    <div id='footer-btn-text'>GET STARTED</div>
                              </Link>
      				<div id='analytics'>
                                    <div id='count-shortened' className='stack-center'>
                                          <div className='top-container'>
                                                <div id='link-img'></div>
                                                <Odometer className='count' value={this.props.numLinks} format="(.ddd),dd"/>
                                          </div>
                                          <div className='analytics-title-text'>LINKS SHORTENED</div>
                                          <div className='analytics-sub-text light-grey-color'>ZIP links are short, unique and fast! Use them to streamline bulky URL's.</div>
                                    </div>
                                    <div id='count-redirects' className='stack-center'>
                                          <div className='top-container'>
                                                <div id='redirect-img'></div>
                                                <Odometer className='count' value={this.props.numRedirects} format="(.ddd),dd"/>
                                          </div>
                                          <div className='analytics-title-text'>TOTAL REDIRECTS</div>
                                          <div className='analytics-sub-text light-grey-color'>Shorter links generate more interest! Streamline your online presence with ZIP.</div>
                                    </div>
      				</div>
      			</div>
                        <div className='footer'>
                        </div>
      		</div>
		);
	}
}

export default Footer;