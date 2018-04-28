web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
other = web3.eth.accounts[1];

console.log("Transferring ether from me to other.")
var t0 = web3.eth.sendTransaction({ from: me, to: other, value: web3.toWei(1, "ether") });
var t1 = web3.eth.getTransaction(t0);
while(t1.blockNumber === null) {
    t1 = web3.eth.getTransaction(t0);
}

console.log("Transferring DKK from me to other.")
var t0 = Erc20_DKK.transfer(other, 10000);
var t1 = web3.eth.getTransaction(t0);
while(t1.blockNumber === null) {
    t1 = web3.eth.getTransaction(t0);
}

var dataFeedValue = 1;
var BettingAddress = BettingExample2_.address;
var valueBeforeActivate = Erc20_DKK.balanceOf(me);


function printBalances() {
    console.log("Ether balance (me): " + web3.eth.getBalance(me));
    console.log("Ether balance (other): " + web3.eth.getBalance(other));

    var my_balance = Erc20_DKK.balanceOf(me);
    console.log("My balance on token contract DKK is: " + my_balance);
    var other_balance = Erc20_DKK.balanceOf(other);
    console.log("Other balance on token contract DKK is: " + other_balance);
    var betting_balance = Erc20_DKK.balanceOf(BettingAddress);
    console.log("DC balance on token contract DKK is: " + betting_balance);
}

printBalances();

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

console.log("Setting data feed to " + dataFeedValue);
var df = DataFeed0_.set( 0, dataFeedValue, {from: me, gas: 3000000});
var t1 = web3.eth.getTransaction(df);
while(t1.blockNumber === null){
    t1 = web3.eth.getTransaction(df);
}

console.log("********* Before bet *********");
printBalances();

var validApproveAmount = 10000;
console.log("Approve with sufficient amount (" + validApproveAmount + ")")

b_A = Erc20_DKK.approve( BettingAddress, validApproveAmount, {from: me, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}
console.log("Done approving.")

assertEquals(
    Erc20_DKK.allowance(me, BettingAddress),
    validApproveAmount,
    "\nReason: Check allowance after correct approve call..");


b_A = Erc20_DKK.approve( BettingAddress, validApproveAmount, {from: other, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

assertEquals(
    Erc20_DKK.allowance(other, BettingAddress),
    validApproveAmount,
    "\nReason: Check allowance after correct approve call..");


// Call to activate
b_A = BettingExample2_.activate({from: me, gas: 3000000});
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

printBalances();

assertEquals(
    Erc20_DKK.balanceOf(BettingAddress),
    2 * validApproveAmount,
    "\nReason: Check DC balance after approve and activate.");

// Assert that the money has been moved from me and other to DC
// Check my balance change
assertEquals(
    Erc20_DKK.balanceOf(me),
    valueBeforeActivate - validApproveAmount,
    "\nReason: Check my balance after activate (me)");

assertEquals(
    Erc20_DKK.balanceOf(other),
    0,
    "\nReason: Check my balance after activate (other)");

// Execute the European option contract
cs  = BettingExample2_.execute({from: me, gas: 3000000});
tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

// Assert that DC has no money left
assertEquals(
    Erc20_DKK.balanceOf(BettingAddress),
    0,
    "\nReason: Check DC balance after execute");

//Assert that the right amount was sent back to me after execute
assertEquals(
    Erc20_DKK.balanceOf(me),
    980000,
    "\nReason: Check my balance after execute");

// Assert that recipient has received the correct amount
assertEquals(
    Erc20_DKK.balanceOf(other),
    20000,
    "\nReason: Check other balance after execute");

printBalances();
console.log("wat.");
