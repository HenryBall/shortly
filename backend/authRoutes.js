// npm imports
const mongoose = require("mongoose");
const passport = require('passport');
const jwt = require('jsonwebtoken');

// mongoose models
const urlModel = mongoose.model("url");
const userModel = mongoose.model("user");

module.exports = app => {

  app.get("/login"), async (req, res) => {
    return res.redirect("https://zipurl.me/");
  }

  app.post("/api/verify_token", async (req, res, next) => {
  	// get the token from the request headers
    const token = getTokenFromHeaders(req);
    // check if the token in still valid
    const authorized = verifyToken(token);
    if (authorized) {
    	// if it is return OK
      	return res.status(200).json("Web token valid!");
    } else {
    	// if it's not return unauthorized
      	return res.status(401).json("Please log in!");
    }
  });

	app.post("/api/sign_up", async (req, res, next) => {
		// get user from request
    	const user = req.body;
    	// validate form was filled out correctly
    	const message = validateSignUpInfo(user)
    	// if we have an error message, return it to the client
    	if (message != "") { return res.status(400).json(message); }
    	// instantiate a new user
    	const curUser = new userModel(user);
    	// hash and salt password
    	curUser.setPassword(user.password);
    	// save the user to db
    	curUser.save(function(err) {
    		if (err) {
    			// if there is a duplicate key error, throw an error
    			if (err.name === 'MongoError' && err.code === 11000) {
    				return res.status(400).json("That email/username is already in use!");
    			} else {
    				// generic error status if there's an unknown error
    				return res.status(500).json("Uh oh, something went wrong!");
    			}
    		}
    		// toAuthJSON will generate a web token
    		return res.status(200).json({ user: curUser.toAuthJSON() });
    	});
	});

	app.post("/api/login", async (req, res, next) => {
		// get user from request
    	const user = req.body;
    	return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
			if (err) {
				// generic error status if there's an unknown error
				return res.status(500).json("Uh oh, something went wrong!");
			}
			// if we find a user, generate a JSON token and log them in
			if (passportUser) {
        		const user = passportUser;
        		// toAuthJSON will generate a web token
        		return res.status(200).json({ user: user.toAuthJSON() });
      		}
      		// if the user credentials aren't recognized, throw an error
      		return res.status(400).json("Uh oh, invalid username/password!");
    	})(req, res, next);
	});

	app.post("/api/get_user_links", async (req, res) => {
		// get user id from request
		const { userId } = req.body;
		// verify the user's token
		const token = getTokenFromHeaders(req);
    	const authorized = verifyToken(token);
    	if (!authorized) { return res.status(401).json("Please log in!"); }
    	// get url code from the request
    	const user = await userModel.findOne({ _id: userId });
    	if (user) {
    		// get array of user links
      		const links = user.links;
      		// initialize array to hold link objs
      		var linkObjs = [];
      		// use link ids to get the link objects
      		for (var i = 0; i < links.length; i++) {
      			// find a link with the id
        		const link = await urlModel.findOne({ _id: links[i] });
        		if (link) { linkObjs.push(link); }
      		}
      		// send link objs as JSON
      		return res.send(JSON.stringify(linkObjs));
    	} else {
    		// shouldn't ever get here
      		return res.status(500).json("Uh oh, something went wrong!");
    	}
	});

	app.post("/api/delete_user_link", async (req, res) => {
		// get user id and link id from request
    	const { userId, linkId } = req.body;
    	// verify the user's token
    	const token = getTokenFromHeaders(req);
    	const authorized = verifyToken(token);
    	if (!authorized) { return res.status(401).json("Please log in!"); }
    	// get url code from the request
    	await userModel.findOne({ _id: userId }, async function (err, doc) {
      		if (err) {
      			// return a generic error
        		return res.status(500).json("Uh oh, something went wrong!");
      		} else {
      			// get the links array
        		const links = doc.links;
        		// filter out the link with the matching id
        		const filteredLinks = links.filter(link => link != linkId);
        		// update the links array
        		doc.links = filteredLinks;
        		// no need for await
        		doc.save();
        		// initialize array to hold link objs
        		var linkObjs = [];
        		// use link ids from filteredLinks to get the link objects
        		for (var i = 0; i < filteredLinks.length; i++) {
        			// find a link with the id
          			const link = await urlModel.findOne({ _id: filteredLinks[i] });
          			if (link) { linkObjs.push(link); }
        		}
        		// return filtered links
        		return res.send(JSON.stringify(linkObjs));
      		}
    	});
  	});

  	function validateSignUpInfo(user) {
  		// catch blank username
  		if (user.username == '') {
    		return "That's an invalid username!";
    	}
    	// catch invalid email format
    	if (!validateEmail(user.email)) {
    		return "That's an invalid email!";
    	}
    	// catch short password
    	if (user.password.length < 8) {
    		return "Password must have at least 8 characters!";
    	}
    	// catch non-matching passwords 
    	if (user.password != user.passwordd) {
    		return "Passwords do not match!";
    	}
    	// good to go
    	return "";
  	}

  	function validateEmail(email) {
		// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  		var re = /\S+@\S+\.\S+/;
  		return re.test(email);
	}

  	function verifyToken(token) {
  		// initialize return value
  		var isValid = false;
  		// use jwt to check if the token is valid
    	jwt.verify(token, 'secret', (err, authorizedData) => {
      		if(err){
        		isValid = false;
      		} else {
        		isValid = true;
      		}
    	});
    	return isValid;
  	}

  	const getTokenFromHeaders = (req) => {
  		// get the token key:val from the request headers
  		const { headers: { authorization } } = req;
  		// if there is a token, return it 
  		if (authorization) {
    		return authorization;
  		}
  		// if no token, return null
  		return null;
	}

};