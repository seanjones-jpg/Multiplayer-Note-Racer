const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { userJoin, userLeave, getCurrentUser, getRoomUsers } = require('./utils/users');
const {newNoteArray, getNoteArray} = require('./utils/notes');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const RACE_LENGTH = 10;
const noteArray = newNoteArray(RACE_LENGTH);
const notes = ['e','f','g','a','b','c','d'];
const noteLetterArray = getNoteArray(noteArray, RACE_LENGTH);
var readyCount = 0;


app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log(`User connected with ID: ${socket.id}`);
    
    socket.on('joinRoom', ({ username, room})=>{
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
           
        socket.on('ready', (socket, readyStatus) =>{
            console.log(`${username} is ready`)
            if(readyStatus){
                readyCount++;
            }else{
                readyCount--;
            }
            
    
            if(readyCount >= 2){
                io.to(user.room).emit('startCountDown', 3);
                io.to(user.room).emit('noteArray', noteArray);
                io.to(user.room).emit('noteLetters', noteLetterArray)
            }
    
        });
        //console.log(room, username, roomNoteMap.get(user.room));
        console.log(noteArray);

        socket.on('noteGuess', (note, index) => {
            console.log(`${username} ${note} ${index}`)
            console.log(note == noteLetterArray[index])
            // if(index = RACE_LENGTH - 1){
            //     socket.emit('gameOver', gametime => {
                    
            //     })
            // }
            if(note == noteLetterArray[index]){
                console.log('correct')
                index++;
                console.log('Backend index is' + index);
                socket.emit('success', index, noteLetterArray[index]);
            }
        });
        
    });

    

    

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            

            //Send room and users 
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        //learning note: io.emit emits to all users
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))