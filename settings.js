$(document).ready(function () {
  $("form").on("submit", function (e) {
    //prevent the default submitting
    e.preventDefault();

    //to array
    let prefArray = $("form").serializeArray();

    //to JSON string, ready to be sent or stored
    let preferences = JSON.stringify(prefArray);

    //store the JSON locally and pass it to other JS file
    //check if the browser supports local storage
    if (typeof Storage !== "undefined") {
      //this will store the JSON string
      localStorage.setItem("preferences", preferences);
    } else {
      console.log("No web storage support.");
    }

    //after finishing, redirect to the home page
    window.location.replace("index.html");
  });
});

$(document).ready(function () {
  //load the preferences from the local storage
  //so it won't be reset when reloading this page
  //check if the browser supports local storage
  if (typeof Storage !== "undefined") {
    //get the data from local storage under the name "preferences"
    let pref = JSON.parse(localStorage.getItem("preferences"));
    //if not null we will use the data
    //else just leave it as the default
    if (pref !== null) {
      //set the field data
      $("#speed").val(pref[0]["value"]);
      $("#lives").val(pref[1]["value"]);
      $("#bColor").val(pref[2]["value"]);
      $("#sColor").val(pref[3]["value"]);
      $("#fColor").val(pref[4]["value"]);
    }
  }
});
