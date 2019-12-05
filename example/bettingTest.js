web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
other = web3.eth.accounts[1];
console.log(""); // Print an extra line to make output look nicer

var t0 = web3.eth.sendTransaction({ from: me, to: other, value: web3.toWei(1, "ether") });
var t1 = web3.eth.getTransaction(t0);
while(t1.blockNumber === null) {
    t1 = web3.eth.getTransaction(t0);
}

var t0 = Erc20_CHF.transfer(other, 10000);
var t1 = web3.eth.getTransaction(t0);
while(t1.blockNumber === null) {
    t1 = web3.eth.getTransaction(t0);
}

var dataFeedValue = 0;
var BettingAddress = BettingExample2_.address;
var valueBeforeActivate = Erc20_CHF.balanceOf(me);


function printBalances() {
    var my_balance = Erc20_CHF.balanceOf(me);
    console.log("My balance on token contract CHF is: " + my_balance);
    var other_balance = Erc20_CHF.balanceOf(other);
    console.log("Other balance on token contract CHF is: " + other_balance);
    var betting_balance = Erc20_CHF.balanceOf(BettingAddress);
    console.log("Derivative contract balance on token contract CHF is: " + betting_balance);
}

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
              (reason === "" ? "" : reason + " ... FAIL");
}

function sleep(ms) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < ms);
}

var df = DataFeed0_.set( 0, dataFeedValue, {from: me, gas: 3000000});
var t1 = web3.eth.getTransaction(df);
while(t1.blockNumber === null){
    t1 = web3.eth.getTransaction(df);
}

console.log("\n\n\n********* Before bet *********");
printBalances();

var validApproveAmount = 10000;

b_A = Erc20_CHF.approve( BettingAddress, validApproveAmount, {from: me, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}
assertEquals(
    Erc20_CHF.allowance(me, BettingAddress).toNumber(),
    validApproveAmount,
    "Check allowance after correct approve call..");


b_A = Erc20_CHF.approve( BettingAddress, validApproveAmount, {from: other, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

assertEquals(
    Erc20_CHF.allowance(other, BettingAddress).toNumber(),
    validApproveAmount,
    "Check allowance after correct approve call..");


// Call to activate
b_A = BettingExample2_.activate({from: me, gas: 3000000});
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

console.log("\n\n\n********* Funds transferred to blockchain *********");
printBalances();

assertEquals(
    Erc20_CHF.balanceOf(BettingAddress).toNumber(),
    2 * validApproveAmount,
    "Check Derivative contract balance after approve and activate.");

// Assert that the money has been moved from me and other to Derivative contract
// Check my balance change
assertEquals(
    Erc20_CHF.balanceOf(me).toNumber(),
    valueBeforeActivate - validApproveAmount,
    "Check my balance after activate");

assertEquals(
    Erc20_CHF.balanceOf(other).toNumber(),
    valueBeforeActivate - validApproveAmount,
    "Check other balance after activate");

// Execute the simple betting contract
cs  = BettingExample2_.execute({from: me, gas: 3000000});
tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

// Assert that Derivative contract has no money left
assertEquals(
    Erc20_CHF.balanceOf(BettingAddress).toNumber(),
    0,
    "Check Derivative contract balance after execute");

//Assert that the right amount was sent back to me after execute
assertEquals(
    Erc20_CHF.balanceOf(me).toNumber(),
    2 * validApproveAmount,
    "Check my balance after execute");

// Assert that recipient has received the correct amount
assertEquals(
    Erc20_CHF.balanceOf(other).toNumber(),
    valueBeforeActivate - validApproveAmount,
    "Check other balance after execute");

console.log("\n\n\n********* Bet has been settled *********");
printBalances();
