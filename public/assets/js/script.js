// helper function for showing results of GET requests 
// clears article-container div and loads the given url
renderGet = function (url) {
    $.get(url, result => {
        //console.log(result);
        $('#article-container').empty();
        window.location.href = url;
    });
};

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

// parse results of newsapi queries
getResultObject = function (result) {
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
        }
        i++;
        return newObj;
    });
};