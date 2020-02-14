$(function() {
	// helper function for showing results of GET requests
	// clears article-container div and loads the given url
	renderGet = function(url) {
		$.get(url, result => {
			$("#article-container").empty();
			window.location.href = url;
		});
	};

	// show top-articles when the home button is clicked
	$(".homeBtn").on("click", e => {
		const url = "/profile";
		renderGet(url);
	});

	// show category when a user clicks that category's button
	$(".categoryBtn").on("click", e => {
		const targetEl = $(e.target).data("category");
		const url = "/api/category/" + targetEl;
		renderGet(url);
	});

	// send contents of search box to search route
	$("#searchBtn").on("click", e => {
		const searchVal = $("#search").val();
		const url = "/api/search/" + searchVal;
		renderGet(url);
	});
	
	// get default feed when the profile page opens
	/* $.get('/api/feed', result => {
		window.location.href = '/profile';
	}); */

});
