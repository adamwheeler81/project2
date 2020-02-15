var db = require("../models");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("49757bf9eb324e9190afc6ddb15b4eca");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
	// GET  /api/top-articles
	//      Gets the day's top headlines sorted by popularity
	app.get("/api/feed", isAuthenticated, (req, res) => {
		newsapi.v2
			.topHeadlines({
				sortBy: "popularity",
				language: "en",
				country: "us"
			})
			.then(result => {
				const resultObj = getResultObject(result);
				// return results
				res.render("index", { profile: true, articles: resultObj });
			})
			.catch(err => console.log("Whoops! " + err));
	});

	app.get("/api/category/:category", (req, res) => {
		newsapi.v2
			.topHeadlines({
				category: req.params.category,
				sortBy: "popularity",
				language: "en",
				country: "us"
			})
			.then(result => {
				const resultObj = getResultObject(result);
				res.render("index", {
					profile: true,
					categoryTitle: req.params.category,
					articles: resultObj
				});
			})
			.catch(err => console.log("Whoops! " + err));
	});

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
	});

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
