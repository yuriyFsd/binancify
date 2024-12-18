// TODO: add UI form for: run. stop, set rate and amount, type of checking
// TODO: make monitoring by overmarker rate and normal amount

run()
const highLightBackGroundColor = 'cadetblue'

function run() {
    notifyUserAboutStart()
    console.log("start") 
    const rateLimit = 4.05//42.97
    const amount = 1000//20000 //UAH amount
    checkTimeInterval = 5000 //miliSeconds
    setInterval(() => {
        checkIfThereAreGoodOrders(rateLimit, amount, "over-rate");
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

function notifyUserAboutStart() {
    console.log("content script sending message");
    browser.runtime.sendMessage({"content": 'Run good orders monitoring...'});    
}
//-----

function checkIfThereAreGoodOrders(rateLimit, amount, checkOption = "over-rate" ) {
    const ordersOnPage = getPageOrders()
    rateLimit = rateLimit || getTopRateAsLimit(ordersOnPage)
    console.log({rateLimit})
    const lessAmountOrders = filterLessAmountOrders(ordersOnPage, amount)
    if (checkOption == "over-rate") {
        const goodOrders = checkIfRightAmountHasEqualOrOverRate(rateLimit, lessAmountOrders)
        highlightGoodOrdersRows(goodOrders)
        console.log({goodOrders})
        if (goodOrders.length) beep()
    }
    getOrderOverMarket(ordersOnPage)
}

function getTopRateAsLimit(orders) {
    const max = orders.reduce((accumulator, currentVal) => {
        return Math.max(accumulator, parseFloat(Object.keys(currentVal)[0]))
    }, parseFloat(Object.keys(orders[0])[0]))
    return max
}

function checkIfRightAmountHasEqualOrOverRate(rateLimit, lessAmountOrders) {
    console.log({'0999limit': rateLimit * 0.999})
    const filteredByRate =  lessAmountOrders.filter((order) => parseFloat(Object.keys(order)[0]) >= rateLimit * 0.999)
    console.log({filteredByRate})
    return filteredByRate
}


function getPageOrders(ordersToHighLight) {    
    console.log({ordersToHighLight})
    let orderRows = Array.from(document.getElementsByClassName("bn-web-table-row bn-web-table-row-level-0"));
    const numOfPriceColumn = 1;
    const numOfLimitsColumn = 2;
    const orders = [];
    orderRows.forEach((orderRow) => {
        const price = parseFloat(orderRow.cells[numOfPriceColumn].innerText);
        const orderLimitsTxt = orderRow.cells[numOfLimitsColumn].innerText.replace('\n-', '').split('\n');
        const orderLimits = orderLimitsTxt.map((value) => {
           return parseInt(value.replace(/\₴|zł|\,/gi, ''));
        })
        orders.push({[price]: [orderLimits[1], orderLimits[2]]});
        if(ordersToHighLight !== undefined && ordersToHighLight.length) {
           const myfound = ordersToHighLight.find((goodOrder) => Object.entries(goodOrder).join() === `${price},${orderLimits[1]},${orderLimits[2]}`)
           if(myfound !== undefined) orderRow.style.background = highLightBackGroundColor
        }
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

function highlightGoodOrdersRows(orders) { //background
    console.log('highlightGoodOrdersRows!!!!')
    getPageOrders(orders)
}
