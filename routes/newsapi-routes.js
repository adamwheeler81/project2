var db = require("../models");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("49757bf9eb324e9190afc6ddb15b4eca");

/* 
    NewsApi routes:
    get: /api/top-articles - gets top articles all categories / countries / sources (default home page view?)
    get: /api/category/:category - takes argument from category drop down
    get: /api/search/:query - takes argument from search input element
    
    DB routes:
    post: /api/db/save/:apiId - checks article table for previous saved articles, 
                        saves article to table if it's not there, adds fk to user profile
                        -- appId generated from article UTC_date + author + source
    get: /api/db/article/:id - gets a saved article from the db
    get: /api/db/favorites - gets all saved articles from profile
    get: /api/db/feed - gets all articles from the user's favorite categories

    Auth routes:
    post: /api/db/createUser - create new user
    get: /api/db/profile/:id - get user profile info
*/

module.exports = function(app) {
	console.log('newsapi route get api feed');
	// GET  /api/top-articles
	//      Gets the day's top headlines sorted by popularity
	app.get("/api/feed", (req, res) => {
		console.log('newsapi route get api feed');
		console.log(req.body)
		newsapi.v2
			.topHeadlines({
				sortBy: "popularity",
				language: "en",
				country: "us"
			})
			.then(result => {
				let i = 0;
				const resultObj = getResultObject(result);
				// return results
				//res.render("index", { articles: resultObj });
				res.json({ articles: resultObj });
				
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
					category: true,
					categoryTitle: req.params.category,
					articles: resultObj
				});
			})
			.catch(err => console.log("Whoops! " + err));
	});

	app.get("/api/search/:query", function(req, res) {
		newsapi.v2
			.everything({
				q: req.params.query,
				sortBy: "popularity",
				language: "en"
			})
			.then(result => {
				resultObj = getResultObject(result);
				res.render("index", { articles: resultObj });
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
