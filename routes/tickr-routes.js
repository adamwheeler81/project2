var db = require("../models");

module.exports = function (app) {
    // save an article to the articles table
    app.post('/db/save', (req, res) => {
        db.Article.create(req.body).then(result => {
            console.log('Article saved.');
        });

    });
}