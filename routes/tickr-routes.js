var db = require("../models");

module.exports = function (app) {
    // show saved articles when user clicks Saved Articles...
    // tie in to profile when authentication is added...
    app.get('/db/saved', (req, res) => {
        db.Article.findAll({}).then(result => {
            const resultObj = getArticleObject(result);
            res.render(
                "index", { saved: true, articles: resultObj }
            )
        });
    })

    // save an article to the articles table
    // us div id to identify article and grab its info for db 
    app.post('/db/save', (req, res) => {
        db.Article.create(req.body).then(result => {
            console.log('Article saved.');
            //res.json(result);
        });

    });

    // Helper functions for building response object from query result
    // parse article objects before sending them to handlebars
    getArticleObject = function (result) {
        let i = 0;
        return result.map(item => {
            const newObj = {
                apiId: i,
                title: item.title,
                author: item.author,
                url: item.url,
                urlToImage: item.urlToImage
            }
            return newObj;
        });
    };

}