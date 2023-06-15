$(document).ready(function () {
  $("#mytable").DataTable();
});

function confirmAction() {
  var result = confirm("Do you want to proceed?");

  if (result) {
    // User clicked OK/Yes
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/logout", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        // Perform further actions here
        console.log("Request successful.");
      } else {
        console.log("Request failed.");
      }
    };

    xhr.send();
    console.log("Request sent.");
  } else {
    // User clicked Cancel/No
    console.log("Action canceled.");
    // Perform alternative actions or do nothing
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", confirmAction);
});
