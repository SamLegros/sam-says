// What's left: add sounds

var strictMode = "off";
var turn = 0;
var colorPick = ["colors", "green", "red", "yellow", "blue"];
var gameSequence = [];
var mySequence = [];
var canPlay = false;
var waitTime = 1000;

$(document).ready(function() {
    toggleButtons();
    //console.log("document ready");
});

$("#strictButton").click(function() {
    if (strictMode == "off") {
        $("#strictButton").css("background-color", "#679436");
        $("#strictButton").css("box-shadow", "0 0px #679436");
        $("#strictButton").css("border-bottom", "5px solid #679436");
        $("#strictButton").css("transform", "translateY(4px)");
        strictMode = "on";
    } else {
        $("#strictButton").css("background-color", "#BBBBBB");
        $("#strictButton").css("box-shadow", "0 5px #808080");
        $("#strictButton").css("border-bottom", "5px solid #BBBBBB");
        $("#strictButton").css("transform", "translateY(0px)");
        strictMode = "off";
    }
});

$("#startButton").click(function() {
    newGame();
});

function newGame() {
    strictMode = "off";
    $("#strictButton").css("background-color", "#BBBBBB");
    $("#strictButton").css("box-shadow", "0 5px #808080");
    $("#strictButton").css("border-bottom", "5px solid #BBBBBB");
    $("#strictButton").css("transform", "translateY(0px)");

    $("#green").removeClass("activate");
    $("#red").removeClass("activate");
    $("#yellow").removeClass("activate");
    $("#blue").removeClass("activate");
    canPlay = false;
    toggleButtons();
    turn = 0;
    gameSequence = [];
    mySequence = [];
    $("#gameDisplayText").html("0" + turn);
    //newTurn();
    setTimeout(function() {
        newTurn();
    }, waitTime);
}

function newTurn() {
    // add one to the turn value (new turn) and reset mySequence
    mySequence = [];
    turn++;
    if (turn < 10) {
        turn = "0" + turn;
        // display the turn
    }

    // display turn
    $("#gameDisplayText").html(turn);

    // (re)disable buttons
    canPlay = false;
    toggleButtons();

    // start a new sequence
    newSequence();
} // end of newTurn()

function delayFunction(j) {
    setTimeout(function() {
        $("#" + gameSequence[j]).addClass("activate");
        if (gameSequence[j] == "green") {
            greenAudio.play();
        } else if (gameSequence[j] == "red") {
            redAudio.play();
        } else if (gameSequence[j] == "yellow") {
            yellowAudio.play();
        } else if (gameSequence[j] == "blue") {
            blueAudio.play();
        }
    }, waitTime * (j + 1));
} // end of delayFunction()

function delayFunctionTwo(j) {
    setTimeout(function() {
        $("#" + gameSequence[j]).removeClass("activate");

        // (re)enable the buttons on last color to allow the user to play
        if (turn == j+1) {
            canPlay = true;
            toggleButtons();
        } // end of if statement
    }, waitTime * (j + 1.5));
} // end of delayFunction()

function newSequence() {
    // Randomly pick a color
    var randomPick = Math.floor(Math.random() * (4 - 1 + 1)) + 1;

    // Push it to the gameSequence array
    gameSequence.push(colorPick[randomPick]);
    //console.log("gameSequence: " + gameSequence);

    // Loop through array, display the colors one at a time
    for (var i = 0; i < gameSequence.length; i++) {
        //$("#" + gameSequence[i]).addClass("activate");
        delayFunction(i);
        delayFunctionTwo(i);
    } // end of for loop
} // end of newSequence()

function replayLastSequence() {
    canPlay = false;
    toggleButtons();
    $("#gameDisplayText").html(turn);
    // Loop through array, display the colors one at a time
    for (var i = 0; i < gameSequence.length; i++) {
        //$("#" + gameSequence[i]).addClass("activate");
        delayFunction(i);
        delayFunctionTwo(i);
    } // end of for loop
} // end of replayLastSequence()

function buildSequence(color) {
    // push color to mySequence
    mySequence.push(color);

    // loop through mySequence and gameSequence
    for (var i = 0; i < mySequence.length; i++) {
        // if both sequences are the same
        if (mySequence[i] == gameSequence[i]) {
            //console.log("they match!");
        } else {
            // if you get one wrong, with strictMode off, you can try again
            if (strictMode == "off") {
                //console.log("try again!");
                $("#gameDisplayText").html("!!");
                $("#gameDisplayText")
                .bind(
                    "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
                    function() {
                        $(this).removeClass("animated flash");
                    }
                )
                .addClass("animated flash");
                mySequence = [];
                setTimeout(function() {
                    replayLastSequence();
                }, waitTime);
            } else {
                // if you get one wrong, with strictMode on, you lose
                //console.log("you lose!");
                $("#gameDisplayText").html("XX");
                $("#gameDisplayText")
                .bind(
                    "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
                    function() {
                        $(this).removeClass("animated flash");
                    }
                )
                .addClass("animated flash");
                setTimeout(function() {
                    newGame();
                }, waitTime);
            } // end of second else
        } // end of first else
    } // end of mySequence for loop

    // if you entered the correct number of colors in the correct sequence
    if (mySequence.length == gameSequence.length) {
        var ourSequence = mySequence.join(",");
        var theirSequence = gameSequence.join(",");
        if (ourSequence == theirSequence) {
            if (turn == 20) {
                $("#gameDisplayText").html("WIN");
                $("#gameDisplayText")
                .bind(
                    "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
                    function() {
                        $(this).removeClass("animated flash");
                    }
                )
                .addClass("animated flash");
                setTimeout(function() {
                    newGame();
                }, waitTime);
            } else {
                console.log("full sequence match!");
                $("#gameDisplayText")
                .bind(
                    "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
                    function() {
                        $(this).removeClass("animated flash");
                    }
                )
                .addClass("animated flash");
                setTimeout(function() {
                    newTurn();
                }, waitTime);
            }
        } // end of second if statement
    } // end of first if statement
} // end of buildSequence(color)

// toggle between enabled and disabled buttons
function toggleButtons() {
    if (canPlay == false) {
        document.getElementById("green").disabled = true;
        document.getElementById("red").disabled = true;
        document.getElementById("yellow").disabled = true;
        document.getElementById("blue").disabled = true;
        //console.log("buttons are disabled");
    } else if (canPlay == true) {
        document.getElementById("green").disabled = false;
        document.getElementById("red").disabled = false;
        document.getElementById("yellow").disabled = false;
        document.getElementById("blue").disabled = false;
        //console.log("buttons are enabled");
    }
}

$("#green").click(function() {
    greenAudio.play();
    buildSequence("green");
});

$("#red").click(function() {
    redAudio.play();
    buildSequence("red");
});

$("#yellow").click(function() {
    yellowAudio.play();
    buildSequence("yellow");
});

$("#blue").click(function() {
    blueAudio.play();
    buildSequence("blue");
});
