$(function () {
    console.log('loaded user.js');
    $('#submitBtn').on('click', (e) => {
        // user authentication route
        console.log('click...')
    });

    // copied:
    // Getting references to our form and input
  const signUpForm = $("form.signup");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    console.log('signupform!');
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  signUpUser = function (email, password) {
    $.post("/signup", {
      email: email,
      password: password
    })
      .then(data => {
          console.log('added user')
          console.log(data);
        window.location.replace("/db/saved");
        
      })
      //.catch(handleLoginErr);
  }

  /* function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  } */
    
});