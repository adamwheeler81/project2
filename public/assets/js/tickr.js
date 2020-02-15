
$(function () {
    // show saved articles button
    $('.get-saved-btn').on('click', (e) => {
        // when user clicks get favorites column, convert it to array and loop through it
        // get the article matching articleId from the articles table
        $.get('/api/favorites', (req, res) => {
            console.log(res);
        })
    });

     // save article button
     $('.save-btn').on("click", (e) => {
        $(e.target).text('Saved!');
        // save article info to Article table, get articleId and update User favorites
        const saveAuthor = $(e.target).siblings('.author').html();
        //const saveSource = $(e.target).siblings('.title').data('source');
        const saveSource = $(e.target).siblings('.source').html();
        const savePulishedAt = $(e.target).siblings('.publishedAt').text();
        const articleId = savePulishedAt + saveAuthor + saveSource;
        const newObject = {
            author: saveAuthor,
            source: saveSource,
            description: $(e.target).siblings('.title').data('description'),
            publishedAt: savePulishedAt,
            title: $(e.target).siblings('.title').text(),
            url: $(e.target).siblings('.url').attr('href'),
            urlToImage: $(e.target).siblings('.srcImg').attr('src'),
            articleId: articleId.replace(/[-,:\.\s]/g, '')
        };
        updateUserFavorites(newObject.articleId);
        // post route on article-routes
        $.post("/db/save", newObject, () => {
            window.location.href = '/';
        });
    });

    // helper function for showing results of GET requests 
    // clears article-container div and loads the given url
    renderGet = function (url) {
        $.get(url, result => {
            $('#article-container').empty();
            window.location.href = url;
        });
    };

    // user update faves route
    updateUserFavorites = function (articleId) {
        $.post('/api/update_favorites', {articleId: articleId}, () => {
            window.location.href = '/'
        })
    }

});
