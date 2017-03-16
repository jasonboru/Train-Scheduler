/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase

// 2. Create button for adding new employees - then update the html + update the database

      // Grabbed values from text boxes

// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
  var config = {
    apiKey: "AIzaSyDwiH0c_hIXE8yzyqnmdGOBdo4wOhnKIyU",
    authDomain: "train-scheduler-b4f7b.firebaseapp.com",
    databaseURL: "https://train-scheduler-b4f7b.firebaseio.com",
    storageBucket: "train-scheduler-b4f7b.appspot.com",
    messagingSenderId: "1004822903996"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#submit").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
      name = $("#name").val().trim();
      destination = $("#destination").val().trim();
      firstTrain = $("#firstTrainTime").val().trim();
      frequency = $("#frequency").val().trim();
  
  // Creates local "temporary" object for holding employee data

  	  /*var trainData = {
  	  	name: name,
  	  	destination: destination,
  	  	firstTrain: firstTrain,
  	  	frequency: frequency
  	  }*/
  
  // Uploads employee data to the database - "push"
        database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
      });
  

  // Logs everything to console


  // Alert "employee added"
 

  // Clears all of the text-boxes
  	 $("#name").val("");
     $("#destination").val("");
     $("#firstTrainTime").val("");
     $("#frequency").val("");
  
  // Prevents moving to new page
  //  return false;
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {


  // Store everything into a variable, empname, emprole, empstart, emprate
  var trnName = childSnapshot.val().name;
  var trnDest = childSnapshot.val().destination;
  var trnTime = childSnapshot.val().firstTrain;
  var trnFreq = childSnapshot.val().frequency;


  // Log Employee Info
      console.log(trnName);
      console.log(trnDest);
      console.log(trnTime);
      console.log(trnFreq);

  // Format the employee start

  var convertedDate = moment(new Date(trnTime));
  var empStartPretty = moment(convertedDate).format("h:mm a");

  // Calculate the months worked using hardcore math
  // To calculate the months worked

  var minAway = (moment().diff(moment(convertedDate), "hour"));

  // Calculate the total billed rate

  var nextArrival = 0; //placeholder until I work out the code for this one

  //var empBilled = empMonths * empRate;


  // Add each train's data into the table
   $("#current-trains > tbody").append("<tr><td>" + trnName + "</td><td>" + trnDest + "</td><td>" +
 trnFreq + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");
  
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use mets this test case