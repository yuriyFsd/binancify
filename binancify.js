alert(1)
console.log(101010)
let i = 1

test1()

function test1() {
    //beep()    
    console.log("start")    
    //for (let i = 0; i < 30; i++) {
        setInterval(() => {
           beep(20) 
        }, 2000);
        // setTimeout(() => {
        //     beep(i)
        // }, 20000)
    //}        
}

function beep(i) {
    console.log('beep ' + i)
    if(window.AudioContext){
        var audioCtx = new AudioContext();
        oscilator=audioCtx.createOscillator();
        oscilator.connect(audioCtx.destination);
    
        oscilator.frequency.value= i * 10;
        oscilator.detune.value=150;
        oscilator.type='sawtooth';
        oscilator.start();
        oscilator.stop(0.5);
    
    }else alert('Ваш браузер не підтримує Web Audio');
}

function newTimeTest(i) {
    console.log('newtimeTest ' + i++ )
}

function tableToArray(tableId) { 
    let table = document.getElementById(tableId); 
    let result = []; 
    for (let row of table.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            rowData.push(cell.innerText); 
        } 
        result.push(rowData); } return result; 
    } 

    // Example usage: 
// Assume your table has an ID of "myTable" 
let tableArray = tableToArray("myTable"); console.log