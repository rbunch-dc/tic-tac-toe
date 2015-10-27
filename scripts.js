//****************************** 
// Tic Tac Toe - Scripts
//******************************

var activeClass = 'ttt-active';
var activeRegEx = /(?:^|\s)ttt-active(?!\S)/g;

// All possible wining combinations
var winners = [
    ['ttt_A1', 'ttt_A2', 'ttt_A3'],
    ['ttt_B1', 'ttt_B2', 'ttt_B3'],
    ['ttt_C1', 'ttt_C2', 'ttt_C3'],
    ['ttt_A1', 'ttt_B1', 'ttt_C1'],
    ['ttt_A2', 'ttt_B2', 'ttt_C2'],
    ['ttt_A3', 'ttt_B3', 'ttt_C3'],
    ['ttt_A1', 'ttt_B2', 'ttt_C3'],
    ['ttt_A3', 'ttt_B2', 'ttt_C1']
];

// Arrays of selected squares
var playSqrs = [];
var compSqrs = [];

// Variables for Computer's turn
var compOut   = 1500;
var compTimer = 0;
var compWait  = false;

// DOM Variables
var body    = document.getElementsByTagName('body')[0];
var message = document.getElementById('ttt_message');
var board   = document.getElementById('ttt_board');
var buttons = board.getElementsByTagName('button');

// Globals
var randButton = {};
var mark       = '';
var won        = false;

// CHECKWINS()
// Following selection ~
// Check to see if there are any winning row
function checkWins(sqrs, isPlayer) {
    var thisWin = [];
    var rowCount = 0;

    // Loop through possible winning combinations
    for (var i = 0; i < winners.length; i++) {
        thisWin = winners[i];
        rowCount = 0;
        // Loop through the IDs within the current combination
        for (var j = thisWin.length - 1; j >= 0; j--) {

            // Check for matches in current player's active squares
            if(sqrs.indexOf(thisWin[j]) > -1) {

                // Add '1' to the match count
                rowCount++;
            }
        };

        // if the match count === 3...
        if(rowCount === 3) {

            // Update 'won' variable to 'true'
            won = true;

            // Run 'gameOver'~
            // passing the winning combination and isPlayer
            gameOver(thisWin, isPlayer);

            // Stop the loop
            return;
        }
    };

    // If game hasn't been won...
    if(!won) {

        // Check for a draw
        checkDraw(isPlayer);
    }
};

// FINISHGAME()
// Set the board for the end of the game
function finishGame() {

    // Remove Click events from buttons
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].removeEventListener('click', btnBinding);
        buttons[i].blur();
    };

    // Add 'ttt_winner' class to board
    board.className += ' ttt_winner';

    // Remove active class from message
    message.className = message.className.replace(activeRegEx, '' );

    // Create 'Play Again' button
    var reloadBtn = document.createElement('button');
    reloadBtn.className = 'ttt_reloadBtn';
    reloadBtn.innerHTML = 'Play Again';

    // Bind reload to 'Play Again' button
    reloadBtn.addEventListener('click', function() {
        location.reload();
    });

    // Add 'Play Again' button to page
    body.appendChild(reloadBtn);
};

// CHECKDRAW()
// Following selection ~
// Check to see if the game is a draw
function checkDraw(isPlayer) {

    // Get all active squares ~
    // Concatenate both arrays
    var activeBtns = playSqrs.concat(compSqrs);

    // If all buttons are active...
    if(activeBtns.length >= buttons.length) {

        // Update message
        message.innerHTML = 'It\'s a Draw!';
        message.className += ' ttt_message-draw';

        // Set board for end of the game
        finishGame();
    } else {

        // Next player's turn
        isPlayer? compTurn(): playTurn();
    }
};

// GAMEOVER()
// Announce winner
function gameOver(winRow, isPlayer) {

    // Update message
    if(isPlayer) {
        board.className += ' ttt_winner-play';
        message.className += ' ttt_message-play';
        message.innerHTML = 'You won!';
    } else {
        board.className += ' ttt_winner-comp';
        message.className += ' ttt_message-comp';
        message.innerHTML = 'You lost.';
    }

    // Highlight the winning squares
    for (var j = 0; j < winRow.length; j++) {
        document.getElementById(winRow[j]).className += ' ttt_winSqr';
    };

    // Set board for end of the game
    finishGame();
};

// RANDOMSQR()
// Computer selects a random unselected square to mark
function randomSqr() {

    // Get random button between 1 and 9 (buttons.length)
    randButton = buttons[Math.floor((Math.random() * buttons.length) + 1) - 1];

    // If button is already active...
    if( randButton.className.match(activeRegEx) ) {

        // Run again...
        randomSqr();

    } else {

        // Mark the square
        markSqr(randButton, true);
    }
};

// COMPTURN()
// Computer's turn to play
function compTurn() {

    // Set variable to indicate computer is 'thinking'
    compWait = true;

    // Update board and message to indicate computer's turn
    board.className += ' ' + activeClass;
    message.innerHTML = 'My Turn...';
    message.className += ' ' + activeClass;

    // Set timer for computer's turn
    compTimer = setTimeout(function() {

        // Select a random square
        randomSqr();

        // Reset 'thinking' variable
        compWait = false;

    }, compOut);

};

// PLAYTURN()
// Player's turn to play
function playTurn() {

    // Update message
    message.innerHTML = 'Your Turn...';

    // Remove active class from board and message
    board.className = board.className.replace(activeRegEx, '' );
    message.className = message.className.replace(activeRegEx, '' );
};

// MARKSQR()
// Mark a square as selected (with an 'X' or 'O')
function markSqr(button, comp) {

    // Set mark to 'X' or 'O'
    mark = comp? 'O': 'X';

    // Update text of button to 'X' or 'O'
    button.querySelector('.ttt_status').innerHTML = mark;

    // Make button active so it can no longer be selected
    button.className += ' ' + activeClass;

    // Add button to player's array and check for wins
    if(!comp) {
        playSqrs.push(button.id);
        checkWins(playSqrs, true);
    } else {
        compSqrs.push(button.id);
        checkWins(compSqrs, false);
    }
};

// BTNBINDING()
// Define actions for button clicks
function btnBinding(button) {

    // If computer's turn...
    if(compWait) {

        // Notify user to wait
        alert("Please, wait your turn.");

        // Stop event
        return;
    }

    // If button doesn't have active class...
    if( !this.className.match(activeRegEx) ) {

        // Mark the square
        markSqr(this);

    } else {

        // Inform the user the spot is already taken
        alert("Sorry, this spot is taken. Try another.");
    }
};

// Bind Events to all buttons (game squares)
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', btnBinding);
};

// Begin game with Player's turn
playTurn();

// ALGORITHIM PROBLEM MAKE A TIC TAC TOE GRID THAT WILL GIVE YOU ALL THE POSSIBLE WINNING SOLUTIONS NO MATTER THE SIZE OF THE GRID

// var gridSize = 0;
// var winnerHoriz =[];
// var winnerVert = [];
// var winnerDiag = [];
// var winner = [];
// var totalSquares = gridSize*gridSize;

// for (i = 0; i < gridSize <= gridSize*gridSize; i++) {
//     // Horozontl winners
//     winnerHoriz.push(i)
//     if(i % gridSize == 0) {
//         winner.push(winnerHoriz);
//         winnerHoriz = [];
//     }
// }

// for (i = 1; i <= gridSize; i++) {
//     for (j = 0; j < gridSize; j++) {
//         winnerVert.push(j + gridSize + i);
//     }
//     winner.push(winnerVert);
//     winnerVert =[];
// }
// for (i=1; i <=gridSize; i++) {
//     winnerDiag((i-1)*gridSize);
// }

// for (i=1; i <=gridSize; i++) {
//     winnerDiag((i*gridSize)- (i-1));
// }

// for(i =1; i<= totalSquares; i+= gridSize+1) {
//     winnerDiag.push(i)
// }
// winner.push(winnerDiag);
// winnerDiag = [];

// for(i = gridSize; i == totalSquares; i+= gridSize+1) {
//     winnerDiag.push(i)
// }

// winner.push(winnerDiag)

// for (i = 1; i <= totalSquares; i += gridSize) {
//     winnerDiag.push(i);
// }
// winner.push(winnerDiag);
// winnerDiag = [];

// for (i = gridSize; i <= totalSquares)