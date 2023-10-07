const chatForm = document.getElementById('chat-form');
const noteGuess = document.querySelector('.note-guess');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');




var playerIndex = 0;
var maxNoteShown = 10;
RACE_LENGTH = 25;
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//console.log(username, room);

const socket = io();

var form = document.getElementById('chat-form');
var input = document.getElementById('note-guess');
const readyButton = document.getElementById('ready');
var readyStatus = false;


// join room and send username and room name to server
socket.emit('joinRoom', {username, room, readyStatus} );

socket.on('roomUsers', ({ room, users, userReady}) => {
    outputRoomName(room);
    outputUsers(users);
    //console.log(room)
    console.log(users)
    console.log(userReady)
});

//Output room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Add users to DOM

function outputUsers(users, playerIndex){
    var progress = Math.floor(playerIndex / RACE_LENGTH);
    userList.innerHTML = `
    ${users.map(user => `
    <div id="${user.username}-container" class="user-container">
        <div id="${user.username}" class="${user.username}-progress-bar progress-bar">${user.username}</div>
        
    </div>`
).join('')}
`;
    
}

socket.on('competitorPosition', (username, index) =>{
    const userElement = document.querySelector(`.user-container#${username}-container`);
    const progressBar = userElement.querySelector('.progress-bar');
    const progress = (index / RACE_LENGTH) * 100; // Calculate progress as a percentage
    progressBar.style.width = `${progress}%`;
    console.log(username + ' is at ' + index)
   // document.getElementById(username).style.width = `${Math.floor(index / RACE_LENGTH)}%`

})

readyButton.addEventListener('click', function() {
    readyStatus = !readyStatus;
    if(readyStatus){
        readyButton.textContent = "Readied!";
    }else{
        readyButton.textContent = "Ready";
    }
    socket.emit('ready', socket.id, readyStatus);
});

socket.on('startGame', (noteArray, index) => {
    console.log(noteArray); 

    updateNotes(index, noteArray);
    document.getElementById('note-guess').removeAttribute('readonly');
    document.getElementById("note-guess").focus();
   // return noteArray;
});

socket.on('success', (index, noteArray) =>{
    playerIndex = index;
    //console.log('Player position is:' + playerIndex)
    updateNotes(index, noteArray);
})

socket.on('userRaceComplete', (raceTime) =>{
    console.log(raceTime)
})

document.getElementById('chat-form').addEventListener('keyup', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('noteGuess', input.value, playerIndex);
      input.value = '';
    }
});







//console.log(getNoteArray(noteArray, raceLength))

function updateNotes (index, noteArray){
    const TREBLE_CLEFF_OFFSET = 100;
    const VERTICAL_OFFSET = 64;
    const NOTE_HORIZONTAL_OFFSET = 30;
    
    document.querySelector('.noteContainer').innerHTML = '';

    for(let i = index; i < Math.min(noteArray.length, index + maxNoteShown); i++){
        const div = document.createElement('div');
        const noteLocation = noteArray[i];

        div.classList.add('note');
        div.setAttribute('id', `note-${i}`); 

        
        document.querySelector('.noteContainer').appendChild(div);
        
        const note = document.getElementById(`note-${i}`);

        note.style.top = `${parseInt(VERTICAL_OFFSET - (noteLocation * 6))}px`;
        note.style.left = `${parseInt(TREBLE_CLEFF_OFFSET + (i - index) * NOTE_HORIZONTAL_OFFSET)}px`;
        
        
    }
}
