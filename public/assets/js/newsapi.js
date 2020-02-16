$(function() {
	// helper function for showing results of GET requests
	// clears article-container div and loads the given url
	renderGet = function(url) {
		$.get(url, result => {
			$("#article-container").empty();
			window.location.href = url;
		});
	};

	getUrlPath = function() {
		// get current country
		let url = window.location.pathname;
		url = url.split('/');
		if (url[1] === "profile") {
			url = "/profile/" + url[2];
		} else {
			// default to us 
			url = "/profile/us";
		}
		
		return url
	}

	// show top-articles when the home button is clicked
	$(".homeBtn").on("click", e => {
		renderGet(getUrlPath());
	});

	// show category when a user clicks that category's button
	$(".categoryBtn").on("click", e => {
		const targetEl = $(e.target).data("category");
		// get current country
		let url = getUrlPath()
		url = url + "/" + targetEl	
		renderGet(url);
	});

	// send contents of search box to search route
	$("#search-button").on("click", e => {
		const searchVal = $("#search").val();
		//const url = "/api/search/" + searchVal;
		let url = getUrlPath();
		url += "/search/" + searchVal;
		renderGet(url);
	});
});