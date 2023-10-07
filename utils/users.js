const users = [];

function userJoin( id, username, room, readyStatus, startTime, endTime){
    const user = { id, username, room, readyStatus, startTime, endTime };

    users.push(user);

    return user;
}

function userLeave(id){
    const index = users.find(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

function getCurrentUser(id){
    return users.find(user => user.id === id);
}

function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

function updateStartTime(room, startTime){
   users.forEach(function(user){
    if(user.room === room){
        user.startTime = startTime;
    }
   })
}

function updateEndTime(user, endTime){
    user.endTime = endTime;
}




module.exports = {
    userJoin,
    userLeave,
    getCurrentUser,
    getRoomUsers,
    updateStartTime,
    updateEndTime
};