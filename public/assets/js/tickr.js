$(function () {

    // show articles button
    $('.savedBtn').on('click', (e) => {
        const url = '/db/saved';
        console.log('click show')
        $.get(url, result => {
            console.log(result);
            $('#article-container').empty();
            window.location.href = url;
        });
    });

    // save button 
    $('.saveBtn').on('click', (e) => {
        const newObject = {
            author: $(e.target).siblings('.author').text(),
            title: $(e.target).siblings('.title').text(),
            url: $(e.target).siblings('.url').text(),
            urlToImage: $(e.target).siblings('.urlToImage').text()
        };

        $.post("/db/save", newObject, () => {
            console.log('saved new article');
            window.location.href = '/db/saved';
        });
    });


});