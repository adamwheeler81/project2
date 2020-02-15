const db = require("../models");
const passport = require("passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");
// testing profile route:
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("49757bf9eb324e9190afc6ddb15b4eca");

module.exports = function(app) {
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

	// USER / DATABASE ROUTES
	// get the user profile.
	// triggered when user logs in through landing page or completes the signup process
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
			newsapi.v2
				.topHeadlines({
					sortBy: "popularity",
					language: "en",
					country: "us"
				})
				.then(result => {
					const resultObj = getResultObject(result);
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

	// Get user favorites
	app.get('/api/favorites', isAuthenticated, (req, res) => {
		db.User.findOne({ 
			where: {
				id: req.user.id
			}
		}).then(result => {
			// get just the favorites column
			let favorites = result.favorites
			// split in to array
			favorites = favorites.split(',');
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
				res.render("index", { profile: true, saved: true, articles: articlesArr } )
			})	 
		})
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

	// Add saved article to user favorites
	app.post('/api/update_favorites', isAuthenticated, (req, res) => {
        // get user favorites
        db.User.findOne({
            where: {
                id: req.user.id
            }
        }).then(result => {
			// get articleId
			let favorites = req.body.articleId;
			// if data already exists in favorites column append it
			if ( result.dataValues.favorites ) {
				favorites += ',';
            	favorites += result.dataValues.favorites;
			}
            // update value in table
            db.User.update(
                { favorites: favorites },
                {
                    where: {
                        id: req.user.id
                    }
                }
            ).then(() => {
                    // stay on page
            })
        })
    })

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
