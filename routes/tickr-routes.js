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
    // create unique 
    app.post('/db/save', (req, res) => {
        const saveDate = new Date(req.body.publishedAt).toISOString();
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
                source: item.source.name,
                description: item.description,
                url: item.url,
                urlToImage: item.urlToImage,
                publishedAt: item.publishedAt
            }
            return newObj;
        });
    };

}