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
	{ name: "Argentina", code: "ar" },
	{ name: "Australia", code: "au" },
	{ name: "Austria", code: "at" },
	{ name: "Belgium", code: "be" },
	{ name: "Brazil", code: "br" },
	{ name: "Bulgaria", code: "bg" },
	{ name: "Canada", code: "ca" },
	{ name: "China", code: "cn" },
	{ name: "Colombia", code: "co" },
	{ name: "Cuba", code: "cu" },
	{ name: "Czech&nbsp;Republic", code: "cz" },
	{ name: "Egypt", code: "eg" },
	{ name: "France", code: "fr" },
	{ name: "Germany", code: "de" },
	{ name: "Greece", code: "gr" },
	{ name: "Hong&nbsp;Kong", code: "hk" },
	{ name: "Hungary", code: "hu" },
	{ name: "India", code: "in" },
	{ name: "Indonesia", code: "id" },
	{ name: "Ireland", code: "ie" },
	{ name: "Israel", code: "il" },
	{ name: "Italy", code: "it" },
	{ name: "Japan", code: "jp" },
	{ name: "Latvia", code: "lv" },
	{ name: "Lithuania", code: "lt" },
	{ name: "Malaysia" , code: "my"},	
	{ name: "Mexico", code: "mx" },
	{ name: "Morocco", code: "ma" },
	{ name: "Netherlands", code: "nl" },
	{ name: "New&nbsp;Zealand", code: "nz" },
	{ name: "Nigeria", code: "ng" },
	{ name: "Norway", code: "no" },
	{ name: "Phillipines", code: "ph" },
	{ name: "Poland", code: "pl" },
	{ name: "Portugal", code: "pt" },
	{ name: "Romania", code: "ro" },
	{ name: "Russia", code: "ru" },
	{ name: "Saudi&nbsp;Arabia", code: "sa" },
	{ name: "Serbia", code: "rs" },
	{ name: "Singapore", code: "sg" },
	{ name: "South&nbsp;Africa", code: "za" },
	{ name: "South&nbsp;Korea", code: "kr" },
	{ name: "Sweden", code: "se" },
	{ name: "Switzerland", code: "ch" },
	{ name: "Taiwan", code: "tw" },
	{ name: "Thailand", code: "th" },
	{ name: "Turkey", code: "tr" },
	{ name: "UAE", code: "ae" },
	{ name: "Ukraine", code: "ua" },
	{ name: "United&nbsp;Kingdom", code: "gb" },
	{ name: "United&nbsp;States", code: "us" },
	{ name: "Venezuela", code: "ve" }		
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