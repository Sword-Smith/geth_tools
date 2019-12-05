web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
other = web3.eth.accounts[1];

function assertEquals(actual, expected, reason) {
    if (actual !== expected) {
        formatError(actual, expected, reason);
    }
}

function assertNotEquals(actual, expected, reason) {
    if (actual === expected) {
        formatError(actual, expected, reason);
    }
}

function formatError(actual, expected, reason) {
        throw "\nActual: " + actual.toString() +
              "\nExpected: " + expected.toString() +
              "\n" +
              (reason === "" ? "" : reason);
}

function sleep(ms) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < ms);
}

var SimpleTransferAddress = SimpleTransfer_.address;
console.log("My address is: " + me);
console.log("Other address is: " + other);
console.log("SimpleTransfer address is: " + SimpleTransferAddress);

console.log("********* BEFORE EXECUTION OF TIME TEST *********");
var balance_A = Erc20_DKK.balanceOf(me);
console.log("My balance on token contract DKK is: " + balance_A);
var balance_B = Erc20_DKK.balanceOf(other);
console.log("Other balance on token contract DKK is: " + balance_B);

var validApproveAmount = 1;

// Approve with sufficient amount and activate
// Confirm successful return value and that money has been moved to DC.
b_A = Erc20_DKK.approve( SimpleTransferAddress, validApproveAmount, {from: me, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

console.log("Approve done");

var valueBeforeActivate = Erc20_DKK.balanceOf(me);

var eventWasActivated = false;
var activatedEvent = SimpleTransfer_.Activated({}, {fromBlock: 0, toBlock: 'latest'});
activatedEvent.watch(function(error, result) {
    eventWasActivated = true;
    console.log("----------------------------------------------\n");
    console.log("AN EVENT!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log("error: " + error);
    console.log("result: " + result);
    console.log("arguments: " + arguments);
    console.log("----------------------------------------------\n");
});

assertEquals(eventWasActivated, false, "The Activated event was not yet called.");
console.log("event not emitted yet: OK.");

// Call to activate
b_A = SimpleTransfer_.activate({from: me, gas: 3000000});
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}
console.log("activate transaction mined in block " + t0_A.blockNumber + " with txid = " + b_A);
// assertEquals(eventWasActivated, true, "The Activated event was called.");

// Assert that the money has been moved from me to DC
// Check my balance change
assertEquals(
    parseInt(Erc20_DKK.balanceOf(me)),
    valueBeforeActivate - validApproveAmount,
    "\nReason: Check my balance after activate");

//Check DC balance change
assertEquals(
    parseInt(Erc20_DKK.balanceOf(SimpleTransferAddress)),
    validApproveAmount,
    "\nReason: Check DC balance after activate");

// Execute and set memexp bit faulty to true, even though it shouldn't be allowed evaled yet.
cs  = SimpleTransfer_.execute({from: me, gas: 3000000});
tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

console.log("Balances before sleep: ");
var balance_A = Erc20_DKK.balanceOf(me);
console.log("My balance on token contract DKK is: " + balance_A);
balance_A = Erc20_DKK.balanceOf(other);
console.log("Other balance on token contract DKK is: " + balance_A);
balance_A = Erc20_DKK.balanceOf(SimpleTransferAddress);
console.log("DC balance on token contract DKK is: " + balance_A);

// Assert that the right amount was sent back to me after execute
assertEquals(
    parseInt(Erc20_DKK.balanceOf(me)),
    valueBeforeActivate - validApproveAmount,
    "\nReason: Check my balance after execute");

// Assert that DC has no money left
assertEquals(
    parseInt(Erc20_DKK.balanceOf(SimpleTransferAddress)),
    0,
    "\nReason: Check DC balance after execute");

assertEquals(
    parseInt(Erc20_DKK.balanceOf(other)),
    validApproveAmount,
    "\nReason: Check other balance after execute");

