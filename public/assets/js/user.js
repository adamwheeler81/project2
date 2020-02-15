$(function() {
	// get user info on profile load
	$.get("/api/user_data").then(data => {
		//console.log("public user js user data...");
	});

	// logout button
	$("#logout").on("click", e => {
		$.get("/api/logout", (req, res) => {
			// redirect to home page
			window.location.href = "/";
		});
	});
});
