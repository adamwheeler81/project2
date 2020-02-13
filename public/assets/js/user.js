$(function () {
  $.get("/api/user_data").then(data => {
    console.log('load profile for ' + data.firstName + " " + data.lastName);
  });
});