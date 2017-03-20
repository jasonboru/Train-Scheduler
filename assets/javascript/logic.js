// Initialize Firebase
var config = {
  apiKey: "AIzaSyDwiH0c_hIXE8yzyqnmdGOBdo4wOhnKIyU",
  authDomain: "train-scheduler-b4f7b.firebaseapp.com",
  databaseURL: "https://train-scheduler-b4f7b.firebaseio.com",
  storageBucket: "train-scheduler-b4f7b.appspot.com",
  messagingSenderId: "1004822903996"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// /trainRef references in database. All will be stored in this directory.
var trainRef = database.ref("/trainData");

// Initial Values
var name = "";
var destination = "";
var time = 0000;
var frequency = 00;

$("#submit").on("click", function() {     // upon click of submit button
  event.preventDefault();                 // prevents the page from default behavior of submit input reloading page 

  // Grabs user input
  var trainName = $("#name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = moment($("#firstTrainTime").val().trim(), "HH:mm").format();
  var frequency = $("#frequency").val().trim();

  var newTrn = {                          // Creates local object for holding train data
        name: trainName,
        destination: destination,
        time: firstTrain,
        frequency: frequency
  }

  database.ref("/trainData").push(newTrn);  // push the new train data into Firebase

  // clear input fields after submit
  $("#name").val("");
  $("#destination").val("");
  $("#firstTrainTime").val("");
  $("#frequency").val("");
  
});

$("#clearDB").on("click", function() {     // upon click of submit button
  var emptyFirebase = confirm("Are you sure you want to clear out the database? Once you have the train has left station and there is no going back.");

  if (emptyFirebase) {  //if the user hits confirm then remove the trainRef data from firebase
    trainRef.remove();
  }  
});

//Create Firebase event when adding train to the database then add a row in the html table
database.ref("/trainData").on("child_added", function(childSnapshot, prevChildKey) {

  // Store snapshots from the db as variables
  var trnName = childSnapshot.val().name;
  var trnDest = childSnapshot.val().destination;
  var trnTime = childSnapshot.val().time;
  var trnFreq = childSnapshot.val().frequency;

  console.log("________"+ trnName + " info________________________");

  // First Train Time minus 1 year so that it always comes before current time
  var trnTimeConverted = moment(trnTime, "HH:mm").subtract(1, "years");
  console.log("The first train time minus 1 year:" + trnTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(trnTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var trnRemainder = diffTime % trnFreq;
  console.log("Time apart (remainder)" + trnRemainder);

  // Minute Until Train
  var trnMinutesTill = trnFreq - trnRemainder;
  console.log("MINUTES TILL TRAIN: " + trnMinutesTill);

  // Next Train
  var nextTrain = moment().add(trnMinutesTill, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));

  // Add each train's data into the table
  $("#current-trains > tbody").append("<tr><td>" + trnName + "</td><td>" + trnDest + "</td><td>" +
  trnFreq + "</td><td>" + moment(nextTrain).format("hh:mm a") + "</td><td>" + trnMinutesTill + "</td></tr>");
  
});