const db = require("../models");
const passport = require("passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");
// testing profile route:
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("49757bf9eb324e9190afc6ddb15b4eca");

module.exports = function(app) {
	// USER / DATABASE ROUTES
	// get the user profile.
	// triggered when user logs in through landing page or completes the signup process
	// WORKS FOR THE MOST PART...COMMENTING SO I DON'T BREAK IT IN TESTING.
	/* app.get("/profile", isAuthenticated, (req, res) => {
		let userCategories = [];
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
			if (result.categories) {
				const newArr = result.categories.split(",");
				newArr.forEach(item => {
					userCategories.push({ title: item });
				});
			} else {
				userCategories.push({ title: "Everything" });
			}
			res.render("index", { profile: true, user: userInfo, categories: userCategories });
		});
	}); */

	// BREAK THIS ONE.
	app.get("/profile", isAuthenticated, (req, res) => {
		let userCategories = [];
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
			if (result.categories) {
				const newArr = result.categories.split(",");
				newArr.forEach(item => {
					userCategories.push({ title: item });
				});
			} else {
				userCategories.push({ title: "Everything" });
			}
			// newsapi call to get feed inside of profile
			console.log("user routes profile");
			newsapi.v2
				.topHeadlines({
					category: "Technology",
					sortBy: "popularity",
					language: "en",
					country: "us"
				})
				.then(result => {
					const resultObj = getResultObject(result);
					console.log("user routes profile resultObj");
					console.log(resultObj);
					// return results
					res.render("index", { profile: true, user: userInfo, articles: resultObj });
				});
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
	app.put("/api/user/categories", function(req, res) {
		db.User.update({ categories: req.body.categories }, { where: { id: req.user.id } }).then(
			rowsUpdated => {
				res.json(rowsUpdated);
			}
		);
	});

	// Put country data in user table when signing up
	app.put("/api/user/countries", function(req, res) {
		db.User.update({ countries: req.body.countries }, { where: { id: req.user.id } }).then(
			rowsUpdated => {
				res.json(rowsUpdated);
			}
		);
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
		console.log("user routes /login this user:");
		console.log(req.user.id);
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
