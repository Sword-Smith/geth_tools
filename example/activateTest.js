web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
other = web3.eth.accounts[1];

function formatError(actual, expected, reason) {
        throw "\nActual: " + actual.toString() +
              "\nExpected: " + expected.toString() +
              (reason === "" ? "" : reason);
}

function assertEquals(actual, expected, reason) {
    if (actual != expected) {
        formatError(actual, expected, reason);
    }
}

function assertNotEquals(actual, expected, reason) {
    if (actual == expected) {
        formatError(actual, expected, reason);
    }
}

var dataFeedValue = 43;
var EPAddress = EuropeanOption_.address;
var valueBeforeActivate = Erc20_DKK.balanceOf(me);

// Set data feed value
console.log("Now setting data feed value to 43");
var df = DataFeed0_.set( 0, dataFeedValue, {from: me, gas: 3000000});
var t1 = web3.eth.getTransaction(df);
while(t1.blockNumber === null){
    t1 = web3.eth.getTransaction(df);
}

console.log("********* BEFORE EXECUTION OF EUROPEAN OPTION *********");
var balance_A = Erc20_DKK.balanceOf(me);
console.log("My balance on token contract DKK is: " + balance_A);
balance_A = Erc20_DKK.balanceOf(other);
console.log("Other balance on token contract DKK is: " + balance_A);

// Call to activate without approval of money
// Confirm failure
var b_A = EuropeanOption_.activate({from: me, gas: 3000000});
var t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

// TODO: Assert return value!


// Call execute before successful activation
// Verify no actions took place
var cs  = EuropeanOption_.execute({from: me, gas: 3000000});
var tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

//TODO: Assert return value!

// Call approve with an insufficient amount and call active
// Confirm failure
console.log("Call approve with insufficient amount and attempt to activate contract.");
b_A = Erc20_DKK.approve( EPAddress, 10, {from: me, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

//Call to activate
b_A = EuropeanOption_.activate({from: me, gas: 3000000});
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

// TODO: Assert return value!

var validApproveAmount = 100;

// Approve with sufficient amount and activate
// Confirm successful return value and that money has been moved to DC.
console.log("Call approve with sufficient amount and attempt to activate contract.");
b_A = Erc20_DKK.approve( EPAddress, validApproveAmount, {from: me, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

assertEquals(
    Erc20_DKK.allowance(me, EPAddress),
    validApproveAmount,
    "\nReason: Check allowance after correct approve call..");

// Attempt to execute before activation
// Confirm failure to execute
cs  = EuropeanOption_.execute({from: me, gas: 3000000});
tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

// TODO: Assert return value

assertEquals(
    Erc20_DKK.balanceOf(EPAddress),
    0,
    "\nReason: Check DC balance before activate.");
assertEquals(
    Erc20_DKK.balanceOf(other),
    0,
    "\nReason: Check other balance before activate.");
// assertEquals(
//     Erc20_DKK.balanceOf(me),
//     valueBeforeActivate,
//     "\nReason: Check own balance before activate.");

// Call to activate
b_A = EuropeanOption_.activate({from: me, gas: 3000000});
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

assertEquals(
    Erc20_DKK.balanceOf(EPAddress),
    validApproveAmount,
    "\nReason: Check DC balance after approve and activate.");

// TODO: Assert return value

// Assert that the money has been moved from me to DC
// Check my balance change
assertEquals(
    Erc20_DKK.balanceOf(me),
    valueBeforeActivate - validApproveAmount,
    "\nReason: Check my balance after activate");

// Execute the European option contract
cs  = EuropeanOption_.execute({from: me, gas: 3000000});
tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

// TODO: Assert ret val

//Assert that the right amount was sent back to me after execute
assertEquals(
    Erc20_DKK.balanceOf(me),
    valueBeforeActivate - dataFeedValue,
    "\nReason: Check my balance after execute");

// Assert that DC has no money left
assertEquals(
    Erc20_DKK.balanceOf(EPAddress),
    0,
    "\nReason: Check DC balance after execute");

// Assert that recipient has received the correct amount
assertEquals(
    Erc20_DKK.balanceOf(other),
    dataFeedValue,
    "\nReason: Check other balance after execute");

// Execute the DC again
// Confirm failure and no balances was altered
cs  = EuropeanOption_.execute({from: me, gas: 3000000});
tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

//Assert that no changes has occured after repeated execute
assertEquals(
    Erc20_DKK.balanceOf(me),
    valueBeforeActivate - dataFeedValue,
    "\nReason: Check my balance after execute");

assertEquals(
    Erc20_DKK.balanceOf(EPAddress),
    0,
    "\nReason: Check DC balance after execute");

assertEquals(
    Erc20_DKK.balanceOf(other),
    dataFeedValue,
    "\nReason: Check other balance after execute");

console.log("Test completed with no errors.\n\n");

console.log("Printing balances:\n");
console.log("My balance: " + Erc20_DKK.balanceOf(me));
console.log("Other balance: " + Erc20_DKK.balanceOf(other));
console.log("DC balance: " + Erc20_DKK.balanceOf(EPAddress));

// TODO: Assert ret val
