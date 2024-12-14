alert("Run orders monitor")
run()

function run() {
    console.log("start")    
    const amount = 10000 //UAH amount
    checkTimeInterval = 5000 //miliSeconds
    setInterval(() => {
        checkIfThereAreGoodOrders(0, amount, "over-rate");
    }, checkTimeInterval);     
}

function beep() {
    console.log('beep ')
    if(window.AudioContext){
        var audioCtx = new AudioContext();
        oscilator=audioCtx.createOscillator();
        oscilator.connect(audioCtx.destination);
    
        oscilator.frequency.value= 100 * 10;
        oscilator.detune.value=1500;//150;
        oscilator.type='sawtooth';
        oscilator.start();
        oscilator.stop(0.005);
    
    }else alert('Ваш браузер не підтримує Web Audio');
}

//-----

function checkIfThereAreGoodOrders(rateLimit, amount, checkOption = "over-rate" ) {
    const ordersOnPage = getPageOrders()
    rateLimit = rateLimit || getTopRateAsLimit(ordersOnPage)
    console.log({rateLimit})
    const lessAmountOrders = filterLessAmountOrders(ordersOnPage, amount)
    if (checkOption == "over-rate") {
        const goodOrders = checkIfRightAmountHasEqualOrOverRate(rateLimit, lessAmountOrders)
        console.log({goodOrders})
        if (goodOrders.length) beep()
    }
    getOrderOverMarket(ordersOnPage)
}

function getTopRateAsLimit(orders) {
    return parseFloat(Object.keys(orders[0])[0])
}

function checkIfRightAmountHasEqualOrOverRate(rateLimit, lessAmountOrders) {
    return lessAmountOrders.filter((order) => parseFloat(Object.keys(order)[0]) >= rateLimit * 0.999)
}


function getPageOrders() {    
    console.log('extractColumnValues');
    let orderRows = Array.from(document.getElementsByClassName("bn-web-table-row bn-web-table-row-level-0"));
    const numOfPriceColumn = 1;
    const numOfLimitsColumn = 2;
    const orders = []
    orderRows.forEach(orderRow => {
        const price = parseFloat(orderRow.cells[numOfPriceColumn].innerText);
        const orderLimitsTxt = orderRow.cells[numOfLimitsColumn].innerText.replace('\n-', '').split('\n');
        const orderLimits = orderLimitsTxt.map((value) => {
           return parseInt(value.replace(/\₴|\,/gi, ''));
        })
        orders.push({[price]: [orderLimits[1], orderLimits[2]]});
    });
    return orders;
}

function filterLessAmountOrders(orders, amountToBuy) {
    const filteredOrders = [];
    orders.forEach((order, key) => {
        const amountLimits = Object.values(order)[0];
        if(amountLimits[0] <= amountToBuy) {
            const rate = Object.keys(order)[0]
            filteredOrders.push({[rate]: amountLimits});
        }
    })
    console.log({size: filteredOrders.length})
    console.log({filteredOrders});
    return filteredOrders;    
}

function getOrderOverMarket(orders) {
}
