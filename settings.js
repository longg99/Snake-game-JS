$(document).ready(function() {
    $('form').on('submit', function(e) {
        //prevent the default submitting
        e.preventDefault();

        //to array
        let prefArray = $('form').serializeArray();
        
        //to JSON string, ready to be sent or stored
        let preferences = JSON.stringify(prefArray);

        //store the JSON locally and pass it to other JS file
        //check if the browser supports local storage
        if(typeof(Storage) !== "undefined") {
            //this will store the JSON string 
            localStorage.setItem("preferences", preferences);
        }
        else {
            console.log("No web storage support.")
        }

        //after finishing, redirect to the home page
        window.location.replace("index.html");
    })  
})