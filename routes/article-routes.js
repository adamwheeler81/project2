var db = require("../models");
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('49757bf9eb324e9190afc6ddb15b4eca');

module.exports = function (app) {

    // To query /v2/top-headlines
    // All options passed to topHeadlines are optional, but you need to include at least one of them
    app.get('/api/top-articles', (req, res) => {
        newsapi.v2.topHeadlines({
            category: 'business',
            language: 'en',
            country: 'us'
        }).then(response => {
            const resultObj = response.articles.map(item => {
                const newObj = {
                    title: item.title,
                    author: item.author,
                    url: item.url,
                    urlToImage: item.urlToImage,
                    publishedAt: item.publishedAt
                }
                return newObj;
            });
            //console.log(resultObj);
            res.render(
                "index", { example: resultObj }
            )
            /*
              {
                status: "ok",
                articles: [...]
              }
            */
        }).catch(() => console.log('Whoops!'));
    })

    app.get("/api/articles", function (req, res) {
        // 1. Add a join to include all of each Author's Posts
        db.Article.findAll({ include: [db.Post] }).then(function (dbArticle) {
            res.json(dbArticle);
        });
    });

    app.get("/api/articles/:id", function (req, res) {
        /* db.Article.findOne({
            where: {
                id: req.params.id
            }, include: [db.Post]
        }).then(function (dbArticle) {
            res.json(dbArticle);
        }); */
    });

    app.post("/api/Articles", function (req, res) {
        /* db.Article.create(req.body).then(function (dbArticle) {
            res.json(dbArticle);
        }); */
    });

    app.delete("/api/Articles/:id", function (req, res) {
        /*  db.Article.destroy({
             where: {
                 id: req.params.id
             }
         }).then(function (dbArticle) {
             res.json(dbArticle);
         }); */
    });

};
