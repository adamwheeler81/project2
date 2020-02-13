const db = require("../models");
const passport = require("../config/passport");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");
const categories = {
	col1: [
		{ title: "Business" },
		{ title: "Entertainment" },
		{ title: "Health" },
		{ title: "Science" }
	],
	col2: [{ title: "Sports" }, { title: "Technology" }, { title: "Everything!" }]
};

const countries = {
	col1: [
		{ name: "Argentina" },
		{ name: "Australia" },
		{ name: "Austria" },
		{ name: "Belgium" },
		{ name: "Brazil" },
		{ name: "Bulgaria" },
		{ name: "Canada" },
		{ name: "China" },
		{ name: "Colombia" },
		{ name: "Cuba" },
		{ name: "Czech Republic" },
		{ name: "Egypt" },
		{ name: "France" }
	],
	col2: [
		{ name: "Germany" },
		{ name: "Greece" },
		{ name: "Hong Kong" },
		{ name: "Hungary" },
		{ name: "India" },
		{ name: "Indonesia" },
		{ name: "Ireland" },
		{ name: "Israel" },
		{ name: "Italy" },
		{ name: "Japan" },
		{ name: "Latvia" },
		{ name: "Lithuania" },
		{ name: "Malaysia" }
	],
	col3: [
		{ name: "Mexico" },
		{ name: "Morocco" },
		{ name: "Netherlands" },
		{ name: "New Zealand" },
		{ name: "Nigeria" },
		{ name: "Norway" },
		{ name: "Phillipines" },
		{ name: "Poland" },
		{ name: "Portugal" },
		{ name: "Romania" },
		{ name: "Russia" },
		{ name: "Saudi Arabia" },
		{ name: "Serbia" }
	],
	col4: [
		{ name: "Singapore" },
		{ name: "South Africa" },
		{ name: "South Korea" },
		{ name: "Sweden" },
		{ name: "Switzerland" },
		{ name: "Taiwan" },
		{ name: "Thailand" },
		{ name: "Turkey" },
		{ name: "UAE" },
		{ name: "Ukraine" },
		{ name: "United Kingdom" },
		{ name: "United States" },
		{ name: "Venezuela" }
	]
};
module.exports = function(app) {
	// LOGIN AND SIGNUP FORMS
	app.get("/", (req, res) => {
		res.render("index", { login: true });
	});

	app.get("/login", (req, res) => {
		res.render("index", { login: true });
	});

	app.get("/signup", (req, res) => {
		res.render("index", { signup: true, userInfo: true });
	});

	app.get("/signup/categorySelect", (req, res) => {
		console.log('get signup categorySelect')
		console.log(req.body);
		res.render("index", { signup: true, categorySelect: true, categories: categories });
	})

	app.get("/signup/countrySelect", (req, res) => {
		console.log('get signup countrySelect')
		console.log(req.body);
		res.render("index", { signup: true, countrySelect: true, countries: countries });
	})

	app.post("/signup/categorySelect", (req, res) => {
		console.log('post signup categorySelect')
		console.log(req.body);
		res.redirect('/signup/categorySelect');
	});

	app.post("/signup/countrySelect", (req, res) => {
		console.log('post signup countrySelect')
		console.log(req.body);
		res.redirect("/signup/countrySelect");
	});

	// LOGGING IN AND SIGNING UP ROUTES
	app.post("/api/login", passport.authenticate("local"), (req, res) => {
		res.json(req.user);
	});

	// signup route
	app.post("/api/signup/", (req, res) => {
		console.log('html routes post api signup');
		db.User.create({
			email: req.body.email,
			password: req.body.password,
			firstName: req.body.firstName,
			lastName: req.body.lastName
		})
			.then(() => {
				console.log('html routes signup newuser')
				res.redirect(307, "/api/login");
			})
			.catch(err => {
				res.status(401).json(err);
			});
	});

	// USER / DATABASE ROUTES
	app.get("/profile", isAuthenticated, (req, res) => {
		console.log('html routes get profile')
		console.log("this should probably go in the user route file")
		// get favorites, categories, countries, etc. from user table then use them to build the custom feed...
		db.User.findOne({
			where: {
				id: req.user.id
			}
		}).then(result => {
			const userInfo = {
				firstName: result.firstName,
				lastName: result.lastName,
				email: result.email
			}
			console.log('get profile')
			res.render("index", {profile: true, user: userInfo});
		})
	})

	app.get("/api/user_data", (req, res) => {
		if (!req.user) {
		  // The user is not logged in, send back an empty object
		  res.json({});
		} else {
		  // Otherwise send back the user's info
		  // Sending back a password, even a hashed password, isn't a good idea
		  res.json({
			firstName: req.user.fistName,
			lastName: req.user.lastName,
			email: req.user.email,
			id: req.user.id
		  });
		}
	  });
};
