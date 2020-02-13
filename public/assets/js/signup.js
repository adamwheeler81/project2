$(document).ready(function() {
	const userInfo = {};

	$("#signUpBtn").on("click", e => {
		console.log("signup /signup");
		renderPost("/signup", "");
	});

	// signup button on userInfo page
	$("#submit-1").click(() => {
		userInfo.firstName = $("#first-name-input").val();
		userInfo.lastName = $("#last-name-input").val();
		userInfo.password = $("#password-input").val();
		userInfo.passwordConfirm = $("#password-confirm").val();
		console.log("clicked submit-1");
		console.log(userInfo);
		renderNext("/signup", "categorySelect", userInfo);
	});

	$("#submit-2").click(function() {
		const checkboxes = $("input[type='checkbox']");
		const checkedCategories = checkboxes.map(item => {
			if (item.is(":checked")) {
				return { name: item.val() };
			}
		});
		console.log(checkedCategories);
		console.log(userInfo);
		renderNext("/signup", "countrySelect");
	});
	/* 
	$("#previous-1").click(function() {
		$(".form-1").show();
		$(".form-2").hide();
	});

	$("#previous-2").click(function() {
		$(".form-2").show();
		$(".form-3").hide();
	}); */

	renderNext = function(url, page, data) {
		if (typeof data == "undefined") {
			$.post(url, result => {
				window.location.href = url;
				return;
			});
		}
		url = url + "/" + page;
		$.post(url, data, result => {
			window.location.href = url;
		});
	};
});
