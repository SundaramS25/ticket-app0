$(document).ready(function () {
  $("#mytable").DataTable();
});

function confirmAction() {
  var result = confirm("Do you want to proceed?");

  if (result) {
    // User clicked OK/Yes
    console.log("Proceeding with action...");
    // Perform further actions here
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
