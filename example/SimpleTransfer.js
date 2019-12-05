web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
other = web3.eth.accounts[1];

function assertEquals(actual, expected, reason) {
    if (actual !== expected) {
        formatError(actual, expected, reason);
    } else {
        console.log(reason + " ... OK");
    }
}

function assertNotEquals(actual, expected, reason) {
    if (actual === expected) {
        formatError(actual, expected, reason);
    } else {
        console.log(reason + " ... OK");
    }
}

function formatError(actual, expected, reason) {
        throw "\nActual: " + actual.toString() +
              "\nExpected: " + expected.toString() +
              "\n" +
              (reason === "" ? "" : reason + " ... FAIL");
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

var balance_A = Erc20_DKK.balanceOf(me);
var balance_B = Erc20_DKK.balanceOf(other);

var validApproveAmount = 1;

// Approve with sufficient amount and activate
// Confirm successful return value and that money has been moved to DC.
b_A = Erc20_DKK.approve( SimpleTransferAddress, validApproveAmount, {from: me, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

// Verify allowed amount (amount that was approved)
var allowedAmount = Erc20_DKK.allowance(me, SimpleTransferAddress).toNumber();
assertEquals(
    allowedAmount,
    validApproveAmount,
    "my allowance against DC must be " + validApproveAmount.toString());

var valueBeforeActivate = Erc20_DKK.balanceOf(me);

var eventWasActivated = false;
var activatedEvent = SimpleTransfer_.Activated({}, {fromBlock: 0, toBlock: 'latest'});
activatedEvent.watch(function(error, result) {
    eventWasActivated = true;
    assertEquals(eventWasActivated, true, "The Activated event was called.");
});

assertEquals(eventWasActivated, false, "The Activated event was not yet called.");
console.log("event not emitted yet: OK.");

// Call to activate
b_A = SimpleTransfer_.activate({from: me, gas: 3000000});
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

// Assert balances after activate but before execute
// Assert that the money has been moved from me to DC
assertEquals(
    parseInt(Erc20_DKK.balanceOf(me)),
    valueBeforeActivate - validApproveAmount,
    "My balance after activate must be decreased by " + validApproveAmount.toString());

//Check DC balance change
assertEquals(
    parseInt(Erc20_DKK.balanceOf(SimpleTransferAddress)),
    validApproveAmount,
    "DC balance after activate must be " + validApproveAmount.toString());

assertEquals(
    parseInt(Erc20_DKK.balanceOf(other)),
    0,
    "Other balance after activate must be 0");

// Execute and set memexp bit faulty to true, even though it shouldn't be allowed evaled yet.
cs  = SimpleTransfer_.execute({from: me, gas: 3000000});
tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

console.log("\nBalances after execute:");
var balance_A = Erc20_DKK.balanceOf(me);
console.log("My balance on token contract DKK is: " + balance_A);
balance_A = Erc20_DKK.balanceOf(other);
console.log("Other balance on token contract DKK is: " + balance_A);
balance_A = Erc20_DKK.balanceOf(SimpleTransferAddress);
console.log("DC balance on token contract DKK is: " + balance_A);
console.log();

// Assert that the right amount was sent back to me after execute
assertEquals(
    parseInt(Erc20_DKK.balanceOf(me)),
    valueBeforeActivate - validApproveAmount,
    "My balance after execute is decreased by " + validApproveAmount.toString());

// Assert that DC has no money left
assertEquals(
    parseInt(Erc20_DKK.balanceOf(SimpleTransferAddress)),
    0,
    "DC balance after execute is 0");

assertEquals(
    parseInt(Erc20_DKK.balanceOf(other)),
    validApproveAmount,
    "Other balance after execute is " + validApproveAmount.toString());

console.log("TEST COMPLETED SUCCESSFULLY");