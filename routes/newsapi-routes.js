const db = require("../models");
const moment = require("moment");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("49757bf9eb324e9190afc6ddb15b4eca");
const isAuthenticated = require("../config/middleware/isAuthenticated");

function getUrlVars() {
    const vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    const urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

	// parse results of newsapi queries
const getResultObject = function(result) {
	return result.articles.map(item => {
		const newObj = {
			title: item.title,
			author: item.author,
			source: item.source.name,
			description: item.description,
			url: item.url,
			urlToImage: item.urlToImage,
			publishedAt: item.publishedAt,
			formattedDate: moment(item.publishedAt).format("dddd, MMMM Do YYYY hh:mm A")
		};
		return newObj;
	});
};

// reusable profile feed request
const getFeed = function (req, res, searchParams) {
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
			/* const newArr = result.countries.split(",");
			console.log('newsapi routes countries');
			console.log(newArr);
			console.log(JSON.parse(result.countries));
			var userCountries = newArr.map(item => {
				return { code: item };
			}) */
			var userCountries = JSON.parse(result.countries);
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
			}).catch(err => console.log(err))
	}).catch(err => console.log(err))
}

module.exports = function(app) {
	// get the user profile.
	// triggered when user logs in through landing page or completes the signup process
	app.get("/profile", isAuthenticated, (req, res) => {
		const searchParams = {
			sortBy: "popularity",
			language: "en"
		};
		getFeed(req, res, searchParams);
	});

	app.get("/profile/:country", isAuthenticated, (req, res) => {
		const searchParams = {
			sortBy: "popularity",
			language: "en",
			country: req.params.country
		};
		getFeed(req, res, searchParams);
	});

	app.get("/api/category/:category", isAuthenticated, (req, res) => {
		const searchParams = {
			sortBy: "popularity",
			language: "en",
			category: req.params.category
		};
		getFeed(req, res, searchParams);
	});

	// custom query using search button
	app.get("/api/search/:query", isAuthenticated, function(req, res) {
		const apiSource = 'everything';
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

	// Get user favorites
	app.get('/api/favorites', isAuthenticated, (req, res) => {
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
			// get just the favorites column
			let favorites = result.favorites
			// split in to array
			favorites = favorites.split(',');
			// get rest of user info
			db.Article.findAll({
				where: {
					articleId: favorites
				}
			}).then(result => {
				// send result to profile 
				const articlesArr = result.map( item=> {
					return newObj = {
						title: item.title,
						author: item.author,
						source: item.source,
						description: item.description,
						url: item.url,
						urlToImage: item.urlToImage,
						publishedAt: item.publishedAt
					}
				});
				//const resultObj = getResultObject(result);
				res.render("index", { 
					profile: true, 
					saved: true, 
					articles: articlesArr, 
					user: userInfo, 
					categories: userCategories, 
					countries: userCountries 
				} )
			})	 
		})
	});

	/*****************************************************************/
	// test url param parsing
	/*****************************************************************/
	app.get("/profile/:country/:category", isAuthenticated, function(req, res) {
		console.log('newsapi routes test url params');
		let country = 'us';
		let category = '';
		if (req.params.country) {
			country = req.params.country;
		}
		if (req.params.category) {
			category = req.params.category;
		}
		console.log(req.params.country);
		console.log(req.params.category);
		const searchParams = {
			sortBy: "popularity",
			language: "en",
			country: country,
			category: category
		};
		getFeed(req, res, searchParams);
	});

	
};