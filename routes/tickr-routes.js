var db = require("../models");

module.exports = function (app) {
    // save an article to the articles table
    app.post('/db/save', (req, res) => {
        db.Article.create(req.body).then(result => {
            console.log('Article saved.');
        });

    });

    // Helper functions for building response object from query result
    // parse article objects before sending them to handlebars
    /* getArticleObject = function (result) {
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
    }; */

}