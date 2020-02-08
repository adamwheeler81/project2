var db = require("../models");


module.exports = function (app) {

    app.get('/db/saved', (req, res) => {
        db.Article.findAll({}).then(result => {
            console.log(result)
            res.render(
                "index", { category: false, articles: result }
            )
        });
    })

    // save an article to the articles table
    // us div id to identify article and grab its info for db 
    app.post('/db/save', (req, res) => {
        db.Article.create(req.body).then(result => {
            console.log('added to db');
            //res.json(result);
        });

    });

    getArticleObject = function (result) {
        let i = 0;
        return result.map(item => {
            const newObj = {
                apiId: i,
                title: item.title,
                author: item.author,
                url: item.url,
                urlToImage: item.urlToImage,
            }
            return newObj;
        });
    };

}