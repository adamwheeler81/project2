$(function () {
    // show top-articles when the home button is clicked
    $('.homeBtn').on('click', (e) => {
        const url = "/api/top-articles"
        renderGet(url);
    });

    // show category when a user clicks that category's button
    $('.categoryBtn').on('click', (e) => {
        const targetEl = $(e.target).data('category');
        const url = "/api/category/" + targetEl;
        renderGet(url);
    });

    $('#searchBtn').on('click', (e) => {
        const searchVal = $('#search').val();
        console.log(searchVal);
        const url = '/api/articles/' + searchVal;
        renderGet(url);
    });

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