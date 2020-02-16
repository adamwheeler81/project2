var db = require("../models");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("49757bf9eb324e9190afc6ddb15b4eca");
const isAuthenticated = require("../config/middleware/isAuthenticated");

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

module.exports = function(app) {



	// get the user profile.
	// triggered when user logs in through landing page or completes the signup process
	app.get("/profile", isAuthenticated, (req, res) => {
		const searchParams = {
			sortBy: "popularity",
			language: "en"
		};
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
				countries: result.countries,
				categories: result.categories
			};
			// convert categories in to an array so we can loop through it in handlebars...
			if (result.categories) {
				const newArr = result.categories.split(",");
				var userCategories = newArr.map(item => {
					return { title: item };
				})
			}
			// same for countries
			if (result.countries) {
				const newArr = result.countries.split(",");
				var userCountries = newArr.map(item => {
					return { code: item };
				})
			}
			// newsapi call to get feed inside of profile
			newsapi.v2
				.topHeadlines(searchParams)
				.then(result => {
					const resultObj = getResultObject(result);
					// return results
					res.render("index", { 
						profile: true, 
						user: userInfo, 
						categories: userCategories, 
						countries: userCountries, 
						articles: resultObj 
					});
				});
		});
	});

	app.get("/profile/:country", isAuthenticated, (req, res) => {
		const searchParams = {
			sortBy: "popularity",
			language: "en",
			country: req.params.country
		};
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
				countries: result.countries,
				categories: result.categories
			};
			// convert categories in to an array so we can loop through it...
			if (result.categories) {
				const newArr = result.categories.split(",");
				var userCategories = newArr.map(item => {
					return { title: item };
				})
			}
			// same for countries
			if (result.countries) {
				const newArr = result.countries.split(",");
				var userCountries = newArr.map(item => {
					return { code: item };
				})
			}
			// newsapi call to get feed inside of profile
			newsapi.v2
				.topHeadlines(searchParams)
				.then(result => {
					const resultObj = getResultObject(result);
					// return results
					res.render("index", { 
						profile: true, 
						user: userInfo, 
						categories: userCategories, 
						countries: userCountries, 
						articles: resultObj 
					});
				});
		});
	});

	app.get("/api/category/:category", isAuthenticated, (req, res) => {
		const searchParams = {
			category: req.params.category,
			sortBy: "popularity",
			language: "en"
		};
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
				countries: result.countries,
				categories: result.categories
			};
			// convert categories in to an array so we can loop through it...
			if (result.categories) {
				const newArr = result.categories.split(",");
				var userCategories = newArr.map(item => {
					return { title: item };
				})
			}
			// same for countries
			if (result.countries) {
				const newArr = result.countries.split(",");
				var userCountries = newArr.map(item => {
					return { code: item };
				})
			}
			// newsapi call to get feed inside of profile
			newsapi.v2
				.topHeadlines(searchParams)
				.then(result => {
					const resultObj = getResultObject(result);
					// return results
					res.render("index", { 
						profile: true, 
						user: userInfo, 
						categories: userCategories, 
						countries: userCountries, 
						articles: resultObj 
					});
				});
		});
	});

	// custom query using search button
	app.get("/api/search/:query", isAuthenticated, function(req, res) {
		newsapi.v2
			.everything({
				q: req.params.query,
				sortBy: "popularity",
				language: "en"
			})
			.then(result => {
				resultObj = getResultObject(result);
				res.render("index", { profile: true, articles: resultObj });
			})
			.catch(err => console.log("Whoops! " + err));
	});

	// test url param parsing
	app.get("/profile/ctry/:country/:category", function(req, res) {
		console.log('newsapi routes test url params');
		console.log(req.params.country);
		console.log(req.params.category);

	});
/* 
	app.get("/api/favorites/:userId", function(req, res) {
		db.Users.findOne({ where: { id: userId } }).then(result => {
			newsapi.v2
				.everything({
					q: result.favorites,
					sortBy: "popularity",
					language: "en"
				})
				.then(result => {
					resultObj = getResultObject(result);
					res.render("index", { articles: resultObj });
				})
				.catch(err => console.log("Whoops! " + err));
		});
	}); */

	// Helper functions for building response object from query result
	// parse results of newsapi queries
	getResultObject = function(result) {
		let i = 0;
		return result.articles.map(item => {
			const newObj = {
				apiId: i,
				title: item.title,
				author: item.author,
				source: item.source.name,
				description: item.description,
				url: item.url,
				urlToImage: item.urlToImage,
				publishedAt: item.publishedAt
			};
			i++;
			return newObj;
		});
	};
};