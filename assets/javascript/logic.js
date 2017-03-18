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

// /trainRef references a specific location in our database.
// All of our connections will be stored in this directory.
var trainRef = database.ref("/trainData");

// --------------------------------------------------------------
// Initial Values
var name = "";
var destination = "";
var time = 0000;
var frequency = 00;

// --------------------------------------------------------------

// Whenever a user clicks the submit-train button
$("#submit").on("click", function() {
  event.preventDefault();
  // Grabs user input
  var trainName = $("#name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = moment($("#firstTrainTime").val().trim(), "HH:mm").format();
  var frequency = $("#frequency").val().trim();

   // Creates local "temporary" object for holding employee data
  var newTrn = {
        name: trainName,
        destination: destination,
        time: firstTrain,
        frequency: frequency
  }

  // Save the new train in Firebase
  database.ref("/trainData").push(newTrn);

 // Train Info
  console.log("___________user values_____________________");
  console.log(newTrn.name);
  console.log(newTrn.destination);
  console.log(newTrn.time);
  console.log(newTrn.frequency);
  console.log("_________________________________________");
  console.log("_________________________________________");

    // Alert
  //alert("Train successfully added");

  // Clears all of the text-boxes
  $("#name").val("");
  $("#destination").val("");
  $("#firstTrainTime").val("");
  $("#frequency").val("");

  // Prevents moving to new page
  //return false;
  
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref("/trainData").on("child_added", function(childSnapshot, prevChildKey) {
  console.log("+++++++++++++++++++");
  console.log(childSnapshot.val());
  console.log("+++++++++++++++++++");

  // Store everything into a variable, empname, emprole, empstart, emprate
  var trnName = childSnapshot.val().name;
  var trnDest = childSnapshot.val().destination;
  var trnTime = childSnapshot.val().time;
  var trnFreq = childSnapshot.val().frequency;

  console.log("___________snapshots_____________________");
  console.log(trnName);
  console.log(trnDest);
  console.log(trnTime);
  console.log(trnFreq);
  console.log("_________________________________________");
  console.log("_________________________________________");

  // First Train Time (pushed back 1 year to make sure it comes before current time)
  var trnTimeConverted = moment(trnTime, "HH:mm").subtract(1, "years");
  console.log(trnTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(trnTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var trnRemainder = diffTime % trnFreq;
  console.log(trnRemainder);

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
