const db = require("../models");
const passport = require("passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
	// USER / DATABASE ROUTES
	// get the user profile. 
	// triggered when user logs in through landing page or completes the signup process
	app.get("/profile", isAuthenticated, (req, res) => {
		// get favorites, categories, countries, etc. from user table then use them to build the custom feed...
		db.User.findOne({
			where: {
				id: req.user.id
			}
		}).then(result => {
			const userInfo = {
				firstName: result.firstName,
				lastName: result.lastName,
				email: result.email,
				countries: result.countries
			};
			
			// convert categories in to an array so we can loop through it...
			const newArr = result.categories.split(',');
			const userCategories = newArr.map(item => {
				return { title: item }
			});
			//getUserFeed(userCategories);
			res.render("index", { profile: true, user: userInfo, categories: userCategories });
		});
	});

	// gets user data for use elsewhere..
	app.get("/api/user_data", (req, res) => {
		if (!req.user) {
			// The user is not logged in, send back an empty object
			res.json({});
		} else {
			// Otherwise send back the user's info
			res.json({
				firstName: req.user.fistName,
				lastName: req.user.lastName,
				email: req.user.email,
				id: req.user.id
			});
		}
	});

	// Put category data in user table when signing up
	app.put('/api/user/categories', function (req, res) {
		db.User.update(
		  {categories: req.body.categories},
		  {where: {id: req.user.id}}
		)
		.then(rowsUpdated => {
		  res.json(rowsUpdated)
		})
	   });

	// Put country data in user table when signing up
	app.put('/api/user/countries', function (req, res) {
		db.User.update(
		  {countries: req.body.countries},
		  {where: {id: req.user.id}}
		)
		.then(rowsUpdated => {
		  res.json(rowsUpdated)
		})
	   });

	// Interact with newsapi to get feed
	const getUserFeed = function(userInfo) {
		app.get("/api/feed", (req, res) => {
			//res.render("index", { profile: true, user: userInfo, articles: res.articles });
			console.log(res.articles);
		});
	};

	// LOGON, LOGOFF, AND SIGNUP
	// User log out
	app.get("/api/logout", function(req, res) {
		req.logout();
		res.redirect("/");
	});

	// User login
	app.post("/api/login", passport.authenticate("local"), (req, res) => {
		res.json(req.user);
	});

	// Initial sign up route
	// Just name, email, and password
	// Add feed details in separate routes
	app.post("/api/signup/", (req, res) => {
		db.User.create({
			email: req.body.email,
			password: req.body.password,
			firstName: req.body.firstName,
			lastName: req.body.lastName
		})
			.then(() => {
				res.redirect(307, "/api/login");
			})
			.catch(err => {
				res.status(401).json(err);
			});
	});
};
