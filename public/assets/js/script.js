$(function () {

    $('.homeBtn').on('click', (e) => {
        const url = "/api/top-articles"
        $.ajax({
            method: "GET",
            url: url
        }).then(result => {
            $('#article-container').empty();
            window.location.href = url;
        });
    })


    $('.categoryBtn').on('click', (e) => {
        const targetEl = $(e.target).data('category');
        const url = "/api/category/" + targetEl;
        $.ajax({
            method: "GET",
            url: url
        }).then(result => {
            $('#article-container').empty();
            //$('#article-container').html(result);
            window.location.href = url;
        });
    })
})