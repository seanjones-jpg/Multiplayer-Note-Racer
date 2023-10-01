function newNoteArray (raceLength){
    var noteArray = [];
    for(let i = 0; i < raceLength; i++){
        const note = Math.floor(Math.random() * 9);
        noteArray.push(note);
    }
    return noteArray;
}

function getNoteArray (noteArray, raceLength){
    const notes = ['e','f','g','a','b','c','d'];
    var noteLetterArray = []

    for(let i = 0; i < raceLength; i++){
        const noteValue = noteArray[i] % 7
        var noteLetter = notes[noteValue];
        noteLetterArray.push(noteLetter);
    }

    return noteLetterArray;
}

function notePlacement(noteArray){

    const TREBLE_CLEFF_OFFSET = 100;

    for(let i = 0; i < noteArray.length; i++){
        const noteLocation = noteArray[i]
        document.getElementById('note').style.top = String(parseInt(54 - (noteLocation * 6)))+ 'px';
        document.getElementById('note').style.left = String(TREBLE_CLEFF_OFFSET + i * 30)+ 'px';
    }
}

module.exports = {
    newNoteArray, 
    getNoteArray,
    notePlacement
};

