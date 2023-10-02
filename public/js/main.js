const chatForm = document.getElementById('chat-form');
const noteGuess = document.querySelector('.note-guess');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');



const notes = ['e','f','g','a','b','c','d'];
var playerIndex = 0;
var maxNoteShown = 10;

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

var form = document.getElementById('chat-form');
var input = document.getElementById('note-guess');
const readyButton = document.getElementById('ready');
var readyStatus = false;


// join room and send username and room name to server
socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({ room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});






socket.on('noteLetters', noteLetterArray => {
    console.log(noteLetterArray);
   // return noteArray;
})


//Output room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Add users to DOM

function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

socket.on('noteArray', (noteArray, index) => {
    console.log(noteArray); 

    updateNotes(index, noteArray);
   // return noteArray;
});

socket.on('success', (index, noteArray) =>{
    console.log(noteArray[index])
    playerIndex = index;
    console.log('Player position is:' + playerIndex)
    updateNotes(index, noteArray);
})

document.getElementById('chat-form').addEventListener('keyup', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('noteGuess', input.value, playerIndex);
      input.value = '';
    }
});


readyButton.addEventListener('click', function() {
    readyStatus = !readyStatus;
    if(readyStatus){
        readyButton.textContent = "Readied!";
    }else{
        readyButton.textContent = "Ready";
    }
    socket.emit('ready', socket.id, readyStatus);
});

// Gameplay
function startGame(){
    
    reset();
    
    startTime = new Date().getTime();

    displayLetter();
}



//console.log(getNoteArray(noteArray, raceLength))

function updateNotes (index, noteArray){
    const TREBLE_CLEFF_OFFSET = 100;
    const VERTICAL_OFFSET = 64;
    const NOTE_HORIZONTAL_OFFSET = 30;

    if(index == 0){
        var prevIndex = false;
    }else{
        var prevIndex = index - 1;
    }

    console.log(prevIndex)

    if(prevIndex){
        document.getElementById(`note-${prevIndex}`).remove();
    }

    for(let i = index; i < Math.min(noteArray.length, index + 5); i++){
        const div = document.createElement('div');
        const noteLocation = noteArray[i];

        div.classList.add('note');
        div.setAttribute('id', `note-${i}`); 
        document.querySelector('.staff').appendChild(div);
        document.getElementById(`note-${i}`).style.top = String(parseInt(VERTICAL_OFFSET - (noteLocation * 6)))+ 'px';
        document.getElementById(`note-${i}`).style.left = String(parseInt(TREBLE_CLEFF_OFFSET + (i - index) * NOTE_HORIZONTAL_OFFSET))+ 'px';
    
    }
}

function displayLetter() {

    iterations++;

    if(iterations > raceLength){
        endTime = new Date().getTime(); // set end time

        var elapsedTime = (endTime - startTime) / 1000; // determine time elapsed
        
    } else {
        var noteLocation = Math.floor(Math.random() * 9);
        var index = noteLocation%7;
        note = notes[index];
        document.getElementById('noteSpan').innerHTML = note;
        document.getElementById('note').style.top = String(parseInt(54 - (noteLocation * 6)))+ 'px';
        document.getElementById('note-guess').value = '';
        document.getElementById('note-guess').focus();
    }

}