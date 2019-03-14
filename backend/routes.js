const mongoose = require("mongoose");
const validUrl = require("valid-url");
const urlModel = mongoose.model("url");
const userModel = mongoose.model("user");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const sparkMD5 = require("spark-md5");
const errorUrl = 'http://localhost/error';
const charMap = require('./charMap')
const _ = require('underscore-node');

module.exports = app => {

  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_URL : process.env.REACT_APP_LOCAL_URL;
  const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOSTED_SERVER : process.env.REACT_APP_LOCAL_SERVER;

  app.get("/redirect/:code", async (req, res) => {
    // get url code from the request
    const urlCode = req.params.code;
    // look for the code in the db
    await urlModel.findOne({ urlCode: urlCode }, function (err, doc) {
      if (err) {
        console.log("unable to find url code");
        return res.redirect(errorUrl);
      } else {
        console.log("found the url code");
        doc.clicks = doc.clicks + 1;
        doc.save();
        return res.redirect(doc.url);
      }
    });
  });



  app.post("/shorten", async (req, res) => {
    const { url, baseUrl } = req.body;
    // if base url is invalid return
    if (!validUrl.isUri(baseUrl)) {
      return res.status(400).json("Invalid Url");
    }
    // if original url is invalid return
    if (!validUrl.isUri(url)) {
      return res.status(400).json("Invalid Url");
    }

    try {
      // generate shortUrl for original url
      urlToSave = makeUrlObj(url, baseUrl);
      // check if the code generated already exists
      const alreadyUsedCode = await urlModel.findOne({ urlCode: urlToSave.urlCode });
      if (alreadyUsedCode) {
        // if the code was already generated from the same original url 
        if (alreadyUsedCode.url == urlToSave.url) {
          // return the url obj but do not save it
          return res.status(200).json(urlToSave);
        } else {
          // otherwise there was a collision, return an error
          return res.status(400).json("Unable to shorten url");
        }
      } else {
        // save the unique short url
        await urlToSave.save();
        // ensure the data saved is accurate
        const urlToCheck = await urlModel.findOne({ urlCode: urlToSave.urlCode });
        if (urlToCheck.url == urlToSave.url) {
          // if the two urls are consistent return
          return res.status(200).json(urlToSave);
        } else {
          // otherwise the generated code matches a different long url
          return res.status(400).json("Unable to shorten url");
        }
      }
    } catch(err) {
      console.log(err);
      return res.status(400).json("Unable to shorten url");
    }
    
  });



  app.post("/sign_up", async (req, res) => {
    const { username, email, password } = req.body;
    // perfrom second validation here
    // make user obj
    var userData = {
      username,
      email,
      password,
    }
    // try to create a new user, if any info is invalid based on the model return an error
    userModel.create(userData, function (err, user) {
      if (err) {
        return res.status(400).json("Unable to sign up");
      } else {
        console.log("created user!")
      }
    });
  });



  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // look for the user
    const user = await userModel.findOne({ email: email });
    // if user exists in db
    if (user) {
      // compare unencrypted password with encrypted password
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          // if they match we log the user in
          console.log(user.username)
          return res.redirect(apiUrl + "/user");
        } else {
          // otherwise return an error
          console.log(user)
          return res.status(400).json("Unable to login");
        }
      })
    } else {
      return res.status(400).json("Unable to login");
    }
  });



  app.post("/num_redirects", async (req, res) => {
    // get url code from the request
    urlModel.find({}, function(err, results){
      if (err) {
        return res.status(400).json("Unable to get count");
      } else {
        let sum = _.reduce(results, function(memo, reading){ return memo + reading.clicks; }, 0);
        return res.status(200).send(sum.toString());
      }
    })
  });



  app.post("/num_links", async (req, res) => {
    // get url code from the request
    urlModel.countDocuments({}, function(err, count){
      if (err) {
        return res.status(400).json("Unable to get count");
      } else {
        if (count) {
          return res.status(200).send(count.toString());
        } else {
          return res.status(200).send("0");
        }
      }
    })
  });



  function makeUrlObj(url, baseUrl) {
    const updatedAt = new Date();
    // generate unique url code
    const urlCode = generateUrlCode(url);
    // append url code to the base url
    shortUrl = baseUrl + "/" + urlCode;
    // create a new url obj based on our model in data.js
    clicks = 0;
    const item = new urlModel({
          url,
          shortUrl,
          urlCode,
          updatedAt,
          clicks,
    });
    return item;
  }



  /* Generates unique url code using the md5 hash function
  -- chars used are a-z, A-Z, 0-9, -, and _
  -- url codes are 8 chars long giving us 281474976710656 possible combos
  */
  function generateUrlCode(url) {
    var urlCode = "";
    var sliceIndex = 0;
    // get 32 char long hex string from url
    var hexHash = sparkMD5.hash(url);
    while (sliceIndex <= 28) {
      // grab 4 chars (2 bytes)
      const byteChunk = hexHash.slice(sliceIndex, sliceIndex+4);
      // convert to decimal
      const base10 = parseInt(byteChunk, 16);
      // get a number between 0-63 using modulo
      const mod64 = base10%64;
      // get code from the result of the mod operation
      const code = charMap.getCodeForNum(mod64)
      // append to the urlCode string and increment the slice index
      urlCode = urlCode + code;
      sliceIndex = sliceIndex + 4;
    }
    return urlCode;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  }

  

};