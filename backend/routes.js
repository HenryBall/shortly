const mongoose = require("mongoose");
const validUrl = require("valid-url");
const UrlShorten = mongoose.model("url");
const shortid = require("shortid");
const errorUrl='http://localhost/error';

module.exports = app => {

  app.get("/api/item/:code", async (req, res) => {
    const urlCode = req.params.code;
    const item = await UrlShorten.findOne({ urlCode: urlCode });
    if (item) {
      return res.redirect(item.url);
    } else {
      return res.redirect(errorUrl);
    }
  });

  app.post("/api/item", async (req, res) => {
    const { url, baseUrl } = req.body;
    // if base url is invalid return
    if (!validUrl.isUri(baseUrl)) {
      return res.status(400).json("Invalid Base Url");
    }

    const updatedAt = new Date();
    const urlCode = shortid.generate();
    // if original url is invalid return
    if (validUrl.isUri(url)) {
      try {
        // check if original url has already been shortened
        const item = await UrlShorten.findOne({ url: url });
        if (item) {
          res.status(200).json(item);
        } else {
          // attach unique code to the base url
          shortUrl = baseUrl + "/" + urlCode;
          const item = new UrlShorten({
            url,
            shortUrl,
            urlCode,
            updatedAt
          });
          // save the object and return to client
          await item.save();
          return res.status(200).json(item);
        }
      } catch (err) {
        return res.status(400).json("Unable to save url data");
      }
    } else {
      return res.status(400).json("Invalid Url");
    }
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
};




