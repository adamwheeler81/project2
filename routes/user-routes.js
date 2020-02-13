const db = require("../models");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function(app) {
	// Route for logging user out
	app.get("/logout", function(req, res) {
		req.logout();
		res.redirect("/");
	});

	// Using the passport.authenticate middleware with our local strategy.
	// If the user has valid login credentials, send them to the members page.
	// Otherwise the user will be sent an error
	app.post("/login", passport.authenticate("local"), (req, res) => {
		res.json(req.user);
	});

	// signup route
	app.post("/signup", function(req, res) {
		db.User.create({
			email: req.body.email,
			password: req.body.password
		})
			.then(() => {
				res.redirect("/db/saved");
			})
			.catch(err => {
				res.status(401).json(err);
			});
	});

	// Route for getting some data about our user to be used client side
	app.get("/profile", function(req, res) {
		if (!req.user) {
			// The user is not logged in, send back an empty object
			res.json({});
		} else {
			// Otherwise send back the user's email and id
			// Sending back a password, even a hashed password, isn't a good idea
			res.json({
				email: req.user.email,
				id: req.user.id
			});
		}
	});
};
