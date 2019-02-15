const mongoose = require("mongoose");
const Data = require("../backend/data");
const urlModel = mongoose.model("url");

const chai = require('chai');
const chaiHttp = require('chai-http');
const routes = require('../backend/routes');
const should = chai.should();

chai.use(chaiHttp);

describe('POST method', () => {

  beforeEach(function() {
    // ...some logic before each test is run
  })

  it('it should POST a valid url', (done) => {
    let url = {
      url: "https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai",
      baseUrl: "http://localhost"
    }
    chai.request("http://localhost:3001").post('/api/item').send(url).end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });

  it('it should not POST an invalid url', (done) => {
    let url = {
      url: "invalid url",
      baseUrl: "http://localhost"
    }
    chai.request("http://localhost:3001").post('/api/item').send(url).end((err, res) => {
      res.should.have.status(400);
      done();
    });
  });

});