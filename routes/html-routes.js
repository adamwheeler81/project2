//const db = require("../models");
//const passport = require("../config/passport");
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

const countries = [	
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
		{ name: "France" },
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
		{ name: "Malaysia" },	
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
		{ name: "Serbia" },
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
		{ name: "Venezuela" },
];

module.exports = function(app) {
	// LOGIN AND SIGNUP FORMS
	app.get("/", (req, res) => {
		res.render("index", { login: true });
	});

	app.get("/login", (req, res) => {
		res.render("index", { login: true });
	});

	app.get("/loginFailed", (req, res) => {
		res.render("index", { login: true, failed: true });
	});

	app.get("/signup", (req, res) => {
		res.render("index", { signup: true, userInfo: true });
	});

	app.get("/signup/categorySelect", isAuthenticated, (req, res) => {
		res.render("index", { signup: true, categorySelect: true, categories: categories });
	});

	app.get("/signup/countrySelect", isAuthenticated, (req, res) => {
		res.render("index", { signup: true, countrySelect: true, countries: countries });
	});

	app.post("/signup/categorySelect", isAuthenticated, (req, res) => {
		// put categories in user table
		postCategories(req.body);
		res.redirect("/signup/countrySelect");
	});

	app.post("/signup/countrySelect", isAuthenticated, (req, res) => {
		res.redirect("/profile");
	});
};