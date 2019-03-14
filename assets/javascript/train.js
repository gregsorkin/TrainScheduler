// Initialize Firebase + Variables
var config = {
    apiKey: "AIzaSyB1fsd_eUzUGswNXTSNpCBzvHHYpFlpLog",
    authDomain: "traintime-7c17f.firebaseapp.com",
    databaseURL: "https://traintime-7c17f.firebaseio.com",
    projectId: "traintime-7c17f",
    storageBucket: "traintime-7c17f.appspot.com",
    messagingSenderId: "500258609736"
  };

firebase.initializeApp(config);

let database = firebase.database();

let trainName = "";
let trainDest = "";
let firstTrain = "";
let frequency = 0;
let newTrain;
let trainTime;

database.ref().on("value", function(snapshot) {
    //console.log(snapshot.val());
    dbLoad();
});

function currentTime() {
    const currentTime = moment().format("LT");
    $("#currentTime").text(currentTime);
}

setTimeout(currentTime, 60000);

// Button for adding trains
$("#submitBtn").on("click", function(event) {
    event.preventDefault();

    // Grab user input
    let trainName = $("#trainName").val().trim();
    let trainDest = $("#destination").val().trim();
    let firstTrain = $("#firstTrain").val().trim();
    let frequency = $("#frequency").val().trim();
    let timeArr = firstTrain.split(":");
    let trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);

    console.log(trainTime);

    // Create local "temp" object for holding train data
    const newTrain = {
        trainName: trainName,
        trainDest: trainDest,
        firstTrain: firstTrain,
        frequency: frequency,
        //dateAdded: firebase.database.ServerValue.TIMESTAMP
    }

    // Uploads train data to the database and console log it all
    database.ref().push(newTrain);

    console.log(newTrain.trainName);
    console.log(newTrain.trainDest);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    // Clear out the input boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

    dbLoad();
});
    
// Create Firebase event-based function that can be called later in which we 
// add train to the database and a row in the HTML when a user adds an entry
function dbLoad() {    
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything as a variable and log it all
        trainName = childSnapshot.val().trainName;
        trainDest = childSnapshot.val().trainDest;
        firstTrain = childSnapshot.val().firstTrain;
        frequency = childSnapshot.val().frequency;
        let key = childSnapshot.key

        console.log(trainName);
        console.log(trainDest);
        console.log(firstTrain);
        console.log(frequency);

        // Calculate the amount of time between first train and now
        let trainTimeDiff = moment().diff(trainTime, "minutes");
        console.log(trainTimeDiff);

        // Calculate the time apart (remainder)
        let timeRemainder = trainTimeDiff % frequency;
        console.log(timeRemainder);

        // Calculate minutes until next train
        let minutesUntilTrain = frequency - timeRemainder;
        console.log(minutesUntilTrain);

        // Next Train
        let nextTrain = moment().add(minutesUntilTrain, "minutes").format("hh:mm A");

        // Create new row in the table
        $("#train-table > tbody").append($("<tr>").append(
            $("<td class='text-center'>").html("<i class='fas fa-trash-alt' data-key='" + key + "'></i>"),
            $("<td class='text-center'>").text(trainName),
            $("<td class='text-center'>").text(trainDest),
            $("<td class='text-center'>").text(firstTrain),
            $("<td class='text-center'>").text(frequency),
            $("<td class='text-center'>").text(nextTrain),
            $("<td class='text-center'>").text(minutesUntilTrain)
        ));
    });
};

// Remove an entry row by clicking the trash icon
$(document).on("click", ".fa-trash-alt", function() {
    let keyRef = $(this).attr("data-key");
    database.ref().child(keyRef).remove();
    window.location.reload();
});

// Was trying to update the page every minute and reflect the change in the table, but didn't work. Future edit.
//setTimeout(window.reload, 60000);

currentTime();