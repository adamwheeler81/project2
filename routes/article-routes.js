var db = require("../models");
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('49757bf9eb324e9190afc6ddb15b4eca');

/* 
    NewsApi routes:
    get: /api/top-articles - gets top articles all categories / countries / sources (default home page view?)
    get: /api/category/:category - takes argument from category drop down
    get: /api/search/:query - takes argument from search input element
    get: /api/article/:id - retrieve a saved article by id

    DB routes:
    post: /api/db/save/{data-object} - checks article table for previous saved articles, 
                        saves article to table if it's not there, adds fk to user profile
    get: /api/db/article/:id - gets a saved article from the db
    get: /api/db/favorites - gets all saved articles from profile
    get: /api/db/feed - gets all articles from the user's favorite categories

    Auth routes:
    post: /api/db/createUser - create new user
    get: /api/db/profile/:id - get user profile info
*/

module.exports = function (app) {

    // GET  /api/top-articles
    //      Gets the day's top headlines sorted by popularity
    app.get('/api/top-articles', (req, res) => {
        newsapi.v2.topHeadlines({
            from: '2020-02-01',
            to: '2020-02-02',
            sortBy: 'popularity',
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
            res.render(
                "index", { category: false, articles: resultObj }
            )
        }).catch((err) => console.log('Whoops! ' + err));
    })

    app.get("/api/category/:category", (req, res) => {
        newsapi.v2.topHeadlines({
            category: req.params.category,
            sortBy: 'popularity',
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
            res.render(
                "index", { category: true, categoryTitle: req.params.category, articles: resultObj }
            );
        }).catch((err) => console.log('Whoops! ' + err));
    });

    app.get("/api/articles/:search", function (req, res) {
        newsapi.v2.everything({
            q: req.params.search,
            sortBy: 'popularity',
            language: 'en'
        }).then(response => {
            console.log(response);
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
            res.render(
                "index", { articles: resultObj }
            );
        }).catch((err) => console.log('Whoops! ' + err));
    });

};
