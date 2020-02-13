$(document).ready(function() {
	const userInfo = {};

	const firstName = $("#first-name-input");
	const lastName = $("#last-name-input");
	const email = $('#email-input');
	const password = $("#password-input");
	const passwordConfirm = $("#password-confirm");

	$("#signUpBtn").on("click", e => {
		console.log("signup /signup");
		renderNext("/signup", "");
	});

	$("#submit-1").click((event) => {
		event.preventDefault();
		console.log('signup submit-1 signupform!');
		var userData = {
		  email: email.val().trim(),
		  firstName: firstName.val().trim(),
		  lastName: lastName.val().trim(),
		  password: password.val().trim(),
		  passwordConfim: passwordConfirm.val().trim()
		};
	
		if (!userData.email || !userData.password) {
		  return;
		}
		// If we have an email and password, run the signUpUser function
		signUpUser(userData.email, userData.password, userData.firstName, userData.lastName);
		email.val("");
		password.val("");
		firstName.val("");
		lastName.val("");
		passwordConfirm.val("");
	  });

	$("#submit-2").click(function() {
		let newArr = [];
		const checkboxes = $("input[type='checkbox']");
		for ( let i = 0; i < checkboxes.length; i++ ) {
		  if ($(checkboxes[i]).prop("checked")) {
			  newArr.push( { title: $(checkboxes[i]).val() } );
		  }
		}
		renderNext("/signup", "countrySelect", newArr);
	});

	$("#submit-3").click(function() {
		let newArr = [];
		const checkboxes = $("input[type='checkbox']");
		for ( let i = 0; i < checkboxes.length; i++ ) {
		  if ($(checkboxes[i]).prop("checked")) {
			  newArr.push( { name: $(checkboxes[i]).val() } );
		  }
		}
		console.log('send user info to auth');
		console.log(req.body)
		// send all user info to the database and attempt to sign up
		$.post("/api/signup", req.body, () => {
			// 			
			window.location.href = '/profile';
		});
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
	  signUpUser = function (email, password, firstName, lastName) {
		  console.log('signupjs signupuser')
		$.post("/api/signup", {
		  email: email,
		  password: password,
		  firstName: firstName,
		  lastName: lastName
		})
		  .then(data => {
			  console.log('added user')
			  console.log(data);
			window.location.replace("/profile");
			
		  })
	  }
});
