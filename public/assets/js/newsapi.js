$(function () {
    // show top-articles when the home button is clicked
    $('.homeBtn').on('click', (e) => {
        const url = "/"
        renderGet(url);
    });

    // show category when a user clicks that category's button
    $('.categoryBtn').on('click', (e) => {
        const targetEl = $(e.target).data('category');
        const url = "/api/category/" + targetEl;
        renderGet(url);
    });

    // send contents of search box to search route
    $('#searchBtn').on('click', (e) => {
        const searchVal = $('#search').val();
        const url = '/api/search/' + searchVal;
        renderGet(url);
    });

    // helper function for showing results of GET requests 
    // clears article-container div and loads the given url
    renderGet = function (url) {
        $.ajax({
            method: "GET",
            url: url
        }).then(result => {
            $('#article-container').empty();
            window.location.href = url;
        });
    }
})