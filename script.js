  var name;
  var destination;
  var frequency;
  var next;
  var min;
  var initialTime;
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAKsTGz-iujSCYaAHM6rJE5wrQb-Mi247U",
    authDomain: "traintimes-9becd.firebaseapp.com",
    databaseURL: "https://traintimes-9becd.firebaseio.com",
    projectId: "traintimes-9becd",
    storageBucket: "",
    messagingSenderId: "658219272931"
  };
  firebase.initializeApp(config);

var database = firebase.database();

$("#submit").on("click", function() {
    event.preventDefault();
    
    console.log("submit clicked");
    var row = $("<tr>");
    var data = $("<td>");

    name = $("#trainName").val().trim();
    destination = $("#destinationIn").val().trim();
    frequency = $("#frequencyIn").val().trim();
    initialTime = $("#firstTrain").val().trim();
    
    console.log("name " + name);
    console.log("destination " + destination);
    console.log("frequency " + frequency);
    console.log("first departure " + initialTime);

    database.ref().push({
        name: name,
        destination: destination,
        frequency: frequency,
        initialTime: initialTime,
      });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
      
      var snapVal = snapshot.val();

      console.log(snapVal.name);
      console.log(snapVal.destination);
      console.log(snapVal.frequency);
      console.log(snapVal.initialTime);

      // initialTime (pushed back 1 year to make sure it comes before current time)
      var initialTimeConverted = moment(initialTime, "HH:mm").subtract(1, "years");
      console.log(initialTimeConverted);

      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(initialTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % frequency;
      console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = frequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


      row.append("<td>" + snapVal.name + "</td>");
      row.append("<td>" + snapVal.destination + "</td>");
      row.append("<td>" + snapVal.frequency + "</td>");
      row.append("<td>" + nextTrain + "</td>");
      row.append("<td>" + tMinutesTillTrain + "</td>");

      $("#infoTable").append(row);
    });

   });