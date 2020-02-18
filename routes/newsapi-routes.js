const db = require("../models");
const moment = require("moment");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("aa366fc4d5714b86974438befb7fc974");
const isAuthenticated = require("../config/middleware/isAuthenticated");

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
		// convert categories in to an array of strings
		if (result.categories) {
			const newArr = result.categories.split(",");
			var userCategories = newArr.map(item => {
				return { title: item };
			})
		}
		// convert countries to array of JSON objects
		if (result.countries) {
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

	app.get("/profile/:country", isAuthenticated, (req, res) => {
	//app.get("/profile/:country", (req, res) => {
		let searchParams = {
			sortBy: "popularity",
			language: "en"
		};
		if ( req.params.country != "all" ){
			searchParams.country = req.params.country
		}
		getFeed(req, res, searchParams);
	});

	// custom query using search button
	app.get("/profile/:country/search/:query", isAuthenticated, function(req, res) {
		let searchParams = {
			sortBy: "popularity",
			language: "en",
			q: req.params.query,
			country: req.params.country
		};
		getFeed(req, res, searchParams);
	});

	app.get("/profile/:country/:category", isAuthenticated, function(req, res) {
		let searchParams = {
			sortBy: "popularity",
			language: "en",
		};
		// default values redirect to 'us' homepage 
		let country = 'us';
		let category = '';
		if (req.params.country) {
			country = req.params.country;
		}
		if (req.params.category) {
			category = req.params.category;
		}
		searchParams.country = country;
		searchParams.category = category;
		getFeed(req, res, searchParams);
	});

	// Get user favorites
	app.get('/favorites', isAuthenticated, (req, res) => {
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
		// convert countries to array of JSON objects
		if (result.countries) {
			var userCountries = JSON.parse(result.countries);
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
						publishedAt: item.publishedAt,
						formattedDate: moment(item.publishedAt).format("dddd, MMMM Do YYYY hh:mm A")
					}
				});
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
	
};