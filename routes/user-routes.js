const db = require("../models");
const passport = require("passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {	

	// gets user data for use elsewhere..
	app.get("/api/user_data", isAuthenticated, (req, res) => {
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
