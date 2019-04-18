// npm imports
import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';

// require dotenv package for managing env variables
require('dotenv').config();

// api and server variables
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL;

const options = {
    animation: {
        duration: 2000
    },
    scales: {
        yAxes: [{
            display: true,
            gridLines: {
                display: false,
                drawBorder: false
            },
            pointLabels: {
                fontFamily: "Lato"
            },
            ticks: {
              fontFamily: "Lato",
            }
        }],
        xAxes: [{
          gridLines: {
            display: true,
          },
          ticks: {
            fontFamily: "Lato",
            fontSize: 14,
          }
        }],
    },
};

class Chart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      urlId: '',
      endDate: new Date(),
      data: {
        labels: [],
        datasets: [{
          label: "Clicks",
          backgroundColor: '#f4b504',
          borderColor: '#f4b504',
          fill: false,
          data: [],
        }]
      }
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.urlId === '') {
      return;
    }

    if (newProps.urlId !== this.state.urlId) {
      this.getChartData(newProps.urlId, this.state.endDate);
      this.setState({urlId: newProps.urlId});
    }
  }

  setChartState(labels, data) {
    const dataObj = {
      labels: labels,
      datasets: [{
        label: "Clicks",
        backgroundColor: '#f4b504',
        borderColor: '#f4b504',
        fill: false,
        data: data,
      }]
    }
    this.setState({data: dataObj});
  }

  getChartData(urlId, endDate) {
    axios.post(apiUrl + '/api/get_chart_data', {
      // send the user id and link to delete in the post data
      urlId: urlId,
      endDate: endDate,
    }).then( res => {
      this.setChartState(res.data.labels, res.data.data)
    }).catch( err => {

    });
  }

	render() {
		return (
      <Line data={this.state.data} options={options}/>
		);
	}
}

export default Chart;