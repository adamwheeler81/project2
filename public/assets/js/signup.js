$(document).ready(function() {
	const firstNameInput = $("#first-name-input");
	const lastNameInput = $("#last-name-input");
	const emailInput = $("#email-input");
	const passwordInput = $("#password-input");
	const passwordConfirmInput = $("#password-confirm");

	renderNext = function(url, page, data) {
		if (typeof data == "undefined") {
			$.get(url, result => {
				window.location.href = url;
				return;
			});
		} else {
			url = url + "/" + page;
			$.post(url, data, result => {
				window.location.href = url;
			});
		}
	};

	// Does a post to the signup route. If successful, we are redirected to the members page
	// Otherwise we log any errors
	signUpUser = function(email, password, firstName, lastName) {
		$.post("/api/signup", {
			email: email,
			password: password,
			firstName: firstName,
			lastName: lastName
		}).then(data => {
			window.location.replace("/signup/categorySelect");
		});
	};

	loginUser = function(email, password) {
		$.post("/api/login", {
			email: email,
			password: password
		}).then(data => {
			window.location.href = "/profile/us";
		});
	};

	// EVENT HANDLERS
	// login button on home screen to login with existing account
	$("#loginBtn").on("click", e => {
		const userData = {
			email: emailInput.val().trim(),
			password: passwordInput.val().trim()
		};

		if (!userData.email || !userData.password) {
			return;
		}
		// If we have an email and password we run the loginUser function and clear the form
		loginUser(userData.email, userData.password);
		emailInput.val("");
		passwordInput.val("");
	});

	//
	$("#signUpBtn").on("click", e => {
		renderNext("/signup", "");
	});

	// Sign Up button on homepage
	$("#submit-1").click(event => {
		event.preventDefault();
		var userData = {
			email: emailInput.val().trim(),
			firstName: firstNameInput.val().trim(),
			lastName: lastNameInput.val().trim(),
			password: passwordInput.val().trim(),
			passwordConfim: passwordConfirmInput.val().trim()
		};

		if (!userData.email || !userData.password) {
			return;
		}
		// If we have an email and password, run the signUpUser function
		signUpUser(userData.email, userData.password, userData.firstName, userData.lastName);
		emailInput.val("");
		passwordInput.val("");
		firstNameInput.val("");
		lastNameInput.val("");
		passwordConfirmInput.val("");
	});

	// Next button on category select screen
	// put selected categories in user table and navigate to country select screen
	$("#submit-2").click(function() {
		let newArr = [];
		const checkboxes = $("input[type='checkbox']");
		// create new array to store categories
		for (let i = 0; i < checkboxes.length; i++) {
			if ($(checkboxes[i]).prop("checked")) {
				newArr.push($(checkboxes[i]).val());
			}
		}
		//put category data in db 
		// convert array to string
		$.ajax({
			url: '/api/user/categories',
			type: 'PUT',
			data: {categories: newArr.toString()}
		 }).then(result => {
			window.location.href = "/signup/countrySelect";
		 });
	});

	// Next button on country select screen
	// put country in user table and show profile with custom feed
	$("#submit-3").click(function() {
		let newArr = [];
		const checkboxes = $("input[type='checkbox']");
		// create new array to store countries
		for (let i = 0; i < checkboxes.length; i++) {
			if ($(checkboxes[i]).prop("checked")) {
				// gets data-code attr of checkbox
				const newObj = { name: $(checkboxes[i]).val(), code: $(checkboxes[i]).data('code').slice(0, -1) };
				newArr.push(newObj);
			}
		}
		$.ajax({
			url: '/api/user/countries',
			type: 'PUT',
			data: {countries: JSON.stringify(newArr)}
		 }).then(result => {
			window.location.href = "/profile/us";
		 });
	});
	
	 
	$("#previous-1").click(function() {
		renderNext("/signup", "");
	});

	
	$("#previous-2").click(function() {
		console.log('go back');
		window.location.href = "/signup/categorySelect";
	});

});