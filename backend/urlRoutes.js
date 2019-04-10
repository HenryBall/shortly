// npm imports
const mongoose = require("mongoose");
const validUrl = require("valid-url");
const sparkMD5 = require("spark-md5");
const _ = require('underscore-node');

// helper files
const charMap = require('./charMap');
const errorUrl = 'http://localhost/error';

// mongoose models
const urlModel = mongoose.model("url");
const userModel = mongoose.model("user");

module.exports = app => {

  app.get("/api/redirect/:code", async (req, res) => {
    // get url code from the request
    const urlCode = req.params.code;
    // look for the code in the db
    await urlModel.findOne({ urlCode: urlCode }, function (err, doc) {
      if (err) {
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
      return res.status(400).json("Uh oh, that's an invalid Url!");
    }
    // if original url is invalid return
    if (!validUrl.isUri(url)) {
      return res.status(400).json("Uh oh, that's an invalid Url!");
    }
    try {
      // generate shortUrl for original url
      var urlCode = generateUrlCode(url);
      // create a url obj with that code
      var urlToSave = makeUrlObj(url, baseUrl, urlCode);
      // check if the code generated already exists
      var alreadyUsedCode = await urlModel.findOne({ urlCode: urlToSave.urlCode });
      if (alreadyUsedCode) {
        // if the code was already generated from the same original url 
        if (alreadyUsedCode.url == urlToSave.url) {
          // return the url obj but do not save it
          addLinkToUser(userId, alreadyUsedCode._id);
          // we can return early because data is already in db
          return res.status(200).json(urlToSave);
        } else {
          // otherwise there was a collision, return an error
          while(alreadyUsedCode) {
            // re-hash the code which caused a collision
            urlCode = generateUrlCode(alreadyUsedCode.urlCode);
            // check if the re-hashed code has already been used
            alreadyUsedCode = await urlModel.findOne({ urlCode: urlCode });
          }
          // once we find a code which has not been used, create a new urlObj with that code
          urlToSave = makeUrlObj(url, baseUrl, urlCode);
          // save the unique short url
          await urlToSave.save();
        }
      } else {
        // save the unique short url
        await urlToSave.save();
      }
      // we just saved some data, make sure it's accurate
      const urlToCheck = await urlModel.findOne({ urlCode: urlToSave.urlCode });
      if (urlToCheck.url == urlToSave.url) {
        // if the two urls are consistent return
        addLinkToUser(userId, urlToSave._id);
        return res.status(200).json(urlToSave);
      } else {
        // otherwise the generated code matches a different long url
        return res.status(400).json("Unable to shorten url");
      }
    } catch(err) {
      console.log(err);
      return res.status(400).json("Unable to shorten url");
    }
  });

  app.post("/api/num_redirects", async (req, res) => {
    // get url code from the request
    urlModel.find({}, function(err, results){
      if (err) {
        return res.status(400).json("Unable to get count");
      } else {
        // use underscore-node to perform map reduce function
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
        // if there's a count, return it
        if (count) {
          return res.status(200).send(count.toString());
        } else {
          // no count means no links have been shortened
          return res.status(200).send("0");
        }
      }
    })
  });

  async function addLinkToUser(userId, linkId) {
    // if the user is not logged in, do nothing
    if (userId != null) {
      await userModel.findOne({ _id: userId }, function (err, doc) {
        if (err) {
          return res.status(500).json("Uh oh, something went wrong!");
        } else {
          // make sure id isn't already saved
          if (doc.links.indexOf(linkId) === -1) {
            doc.links.push(linkId);
            doc.save();
          }
        }
      });
    }
  }

  function makeUrlObj(url, baseUrl, urlCode) {
    const clicks = 0;
    const updatedAt = new Date();
    const shortUrl = baseUrl + "/" + urlCode;
    // create a new url obj based on our model in data.js
    const item = new urlModel({
          url,
          shortUrl,
          urlCode,
          updatedAt,
          clicks
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