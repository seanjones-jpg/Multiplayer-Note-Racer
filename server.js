const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { userJoin, userLeave, getCurrentUser, getRoomUsers, updateStartTime, updateEndTime} = require('./utils/users');
const {newNoteArray, getNoteArray} = require('./utils/notes');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const RACE_LENGTH = 25;
var noteArray;
var noteLetterArray;



app.use(express.static(path.join(__dirname, 'public')));

const roomReadyCounts = {};
const roomRaceCompletes = {};

io.on('connection', socket => {
    console.log(`User connected with ID: ${socket.id}`);
    
    socket.on('joinRoom', ({ username, room, readyStatus})=>{
        const user = userJoin(socket.id, username, room, readyStatus);
        socket.join(user.room);



        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
            userReady: user.readyStatus
        });
           
        socket.on('ready', (socket, readyStatus) =>{
            //user.readyStatus = readyStatus
            
            if(readyStatus){
                console.log(`${username} is ready`)

                if (!roomReadyCounts[user.room]) {
                    roomReadyCounts[user.room] = 0;
                }
                roomReadyCounts[user.room]++;
            }else{
                console.log(`${username} is not ready`)
                roomReadyCounts[user.room]--;
            }
            
    
            if(roomReadyCounts[user.room] >= 2){
                index = 0;
                noteArray = newNoteArray(RACE_LENGTH);
                noteLetterArray = getNoteArray(noteArray, RACE_LENGTH);
                const startTime = new Date();
                updateStartTime(user.room, startTime)
                
                

                io.to(user.room).emit('startGame', noteArray, index );
            }
    
        });
        //console.log(room, username, roomNoteMap.get(user.room));
        console.log(noteArray);

        socket.on('noteGuess', (note, index) => {
            console.log(`${username} ${note} ${index}`)
            console.log(note == noteLetterArray[index])
            if(note ==  noteLetterArray[index] && index == RACE_LENGTH - 1){
                endTime = new Date();
                updateEndTime(user, endTime)
                const raceTime = Math.floor((user.endTime - user.startTime) / 1000)
                socket.emit('userRaceComplete', raceTime)

                if (!roomRaceCompletes[user.room]) {
                    roomRaceCompletes[user.room] = 0;
                }
                roomRaceCompletes[user.room]++

                if(roomRaceCompletes){
                    
                }
            }
            if(note == noteLetterArray[index]){
                console.log('correct')
                index++;
                console.log('Backend index is ' + index);
                io.to(user.room).emit('competitorPosition', username, index);
                socket.emit('success', index, noteArray);
            }
        });
        
    });

    

    

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            
            if (roomReadyCounts[user.room]) {
                roomReadyCounts[user.room]--;
            }

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