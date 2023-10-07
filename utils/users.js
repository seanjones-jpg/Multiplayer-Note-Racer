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

function userPlacements(room){
    const userPlacementArray = [];
    users.forEach(function(user){
        if(user.room === room){
            const raceTime = user.endTime - user.startTime;
            const displayTime = Math.floor(raceTime / 1000);
            const username = user.username
            userPlacementArray.push({ username, displayTime});
        }
       })
    
    userPlacementArray.sort((a, b) => {
        if(a.raceTime < b.raceTime) return -1;
        if(a.raceTime > b.raceTime) return 1;
        return 0; 
    })
    return userPlacementArray;
}


module.exports = {
    userJoin,
    userLeave,
    getCurrentUser,
    getRoomUsers,
    updateStartTime,
    updateEndTime,
    userPlacements
};