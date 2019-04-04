// npm imports
const mongoose = require("mongoose");
const validUrl = require("valid-url");
const shortid = require("shortid");
const sparkMD5 = require("spark-md5");
const _ = require('underscore-node');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// helper files
const auth = require('./auth');
const charMap = require('./charMap');
const errorUrl = 'http://localhost/error';

// mongoose models
const urlModel = mongoose.model("url");
const userModel = mongoose.model("user");

module.exports = app => {

  app.get("/api/redirect/:code", async (req, res) => {
    console.log("in redirect");
    // get url code from the request
    const urlCode = req.params.code;
    // look for the code in the db
    await urlModel.findOne({ urlCode: urlCode }, function (err, doc) {
      if (err) {
        console.log("unable to find url code");
        return res.redirect(errorUrl);
      } else {
        doc.clicks = doc.clicks + 1;
        doc.save();
        return res.redirect(doc.url);
      }
    });
  });



  app.post("/api/shorten", async (req, res) => {
    const { url, baseUrl, userId } = req.body;
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
          addLinkToUser(userId, alreadyUsedCode._id);
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
          addLinkToUser(userId, urlToSave._id);
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



  app.post("/api/sign_up", async (req, res, next) => {
    const user = req.body;
    // TODO: perfrom second validation here
    // TODO: handle duplicate key exception
    const curUser = new userModel(user);
    curUser.setPassword(user.password);
    return curUser.save()
    .then(() => res.json({ user: curUser.toAuthJSON() }));
  });



  app.post("/api/login", async (req, res, next) => {
    const user = req.body;
    // TODO: perfrom second validation here

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return res.status(400).json("Unable to login");
      }

      if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      }

      return res.status(400).info;
    })(req, res, next);
  });



  // token verification function
  app.post("/api/verify_token", async (req, res, next) => {
    console.log("in verify token");
    const authorizedData = verifyToken(req.body.token);
    if (authorizedData != false) {
      return res.status(200).json(authorizedData);
    } else {
      return res.status(400).json("web token expired");
    }
  });



  app.post("/api/num_redirects", async (req, res) => {
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



  app.post("/api/num_links", async (req, res) => {
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



  app.post("/api/user_links", async (req, res) => {
    const { userId } = req.body;
    // get url code from the request
    const user = await userModel.findOne({ _id: userId });
    if (user) {
      const links = user.links;
      var linkObjs = [];
      for (var i = 0; i < links.length; i++) {
        const link = await urlModel.findOne({ _id: links[i] });
        if (link) { linkObjs.push(link); }
      }
      return res.send(JSON.stringify(linkObjs));
    } else {
      console.log("can't find user");
    }
  });



  app.post("/api/delete_user_link", async (req, res) => {
    const { userId, linkId } = req.body;
    // get url code from the request
    await userModel.findOne({ _id: userId }, async function (err, doc) {
      if (err) {
        console.log("unable to find user");
      } else {
        const links = doc.links;
        const filteredLinks = links.filter(link => link != linkId);
        doc.links = filteredLinks;
        doc.save();
        var linkObjs = [];
        for (var i = 0; i < filteredLinks.length; i++) {
          const link = await urlModel.findOne({ _id: filteredLinks[i] });
          if (link) { linkObjs.push(link); }
        }
        return res.send(JSON.stringify(linkObjs));
      }
    });
  });



  async function addLinkToUser(userId, linkId) {
    console.log(userId);
    console.log(linkId);
    if (userId != null) {
      await userModel.findOne({ _id: userId }, function (err, doc) {
        if (err) {
          console.log("Unable to get links");
        } else {
          doc.links.push(linkId);
          doc.save();
        }
      });
    }
  }



  function verifyToken(token) {
    jwt.verify(token, 'secret', (err, authorizedData) => {
      if(err){
        //If error send Forbidden (403)
        return false;
      } else {
        //If token is successfully verified, we can send the autorized data
        return authorizedData;
      }
    })
  }



  function makeUrlObj(url, baseUrl) {
    clicks = 0;
    const updatedAt = new Date();
    // generate unique url code
    const urlCode = generateUrlCode(url);
    // append url code to the base url
    shortUrl = baseUrl + "/" + urlCode;
    // create a new url obj based on our model in data.js
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