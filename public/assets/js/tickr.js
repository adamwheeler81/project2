$(function () {

    // show articles button
    $('.showSavedBtn').on('click', (e) => {
        const url = '/db/saved';
        renderGet(url);
    });

    // save button 
    $('.saveBtn').on('click', (e) => {
        $(e.target).text('Saved!');
        const newObject = {
            author: $(e.target).siblings('.author').text(),
            title: $(e.target).siblings('.title').text(),
            url: $(e.target).siblings('.url').attr('href'),
            urlToImage: $(e.target).siblings('.urlToImage').attr('src')
        };
        $.post("/db/save", newObject, () => {
            window.location.href = '/';
        });
    });

    // helper function for showing results of GET requests 
    // clears article-container div and loads the given url
    renderGet = function (url) {
        $.get(url, result => {
            //console.log(result);
            $('#article-container').empty();
            window.location.href = url;
        });
    };

});