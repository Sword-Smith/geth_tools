web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
other = web3.eth.accounts[1];
console.log(""); // Print an extra line to make output look nicer

// other does not have eth
var t0 = web3.eth.sendTransaction({ from: me, to: other, value: web3.toWei(1, "ether") });
var t1 = web3.eth.getTransaction(t0);
while(t1.blockNumber === null) {
    t1 = web3.eth.getTransaction(t0);
}

var t0 = Erc20_DAI.transfer(other, 10000);
var t1 = web3.eth.getTransaction(t0);
while(t1.blockNumber === null) {
    t1 = web3.eth.getTransaction(t0);
}

var BettingAddress = OldTransfer_.address;
var valueBeforeActivate = Erc20_DAI.balanceOf(me);


function printBalances() {
    Erc20_DAI.balanceOf.call(me, function(error, balance){ console.log("My balance on token contract DAI is: " + balance) } );
    Erc20_DAI.balanceOf.call(other, function(error, balance){ console.log("Other balance on token contract DAI is: " + balance) } );
    Erc20_DAI.balanceOf.call(BettingAddress, function(error, balance){ console.log("Derivative contract balance on token contract DAI is: " + balance) } );
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

var dataFeedValue = 0;
var df = DataFeed0_.set( 0, dataFeedValue, {from: me, gas: 3000000});
var t1 = web3.eth.getTransaction(df);
while(t1.blockNumber === null){
    t1 = web3.eth.getTransaction(df);
}

console.log("\n\n\n********* Before bet *********");
printBalances();

var validApproveAmount = 1;

b_A = Erc20_DAI.approve( BettingAddress, validApproveAmount, {from: me, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

Erc20_DAI.allowance.call(me, BettingAddress,
    function(error, allowance){
         assertEquals(allowance, validApproveAmount, "Check allowance after correct approve call.." );
    });


b_A = Erc20_DAI.approve( BettingAddress, validApproveAmount, {from: other, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

Erc20_DAI.allowance.call(other, BettingAddress,
    function(error, allowance){
          assertEquals(allowance, validApproveAmount, "Check allowance after correct approve call.." );
    });

// Call to activate
b_A = OldTransfer_.activate({from: me, gas: 3000000});
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

console.log("\n\n\n********* Funds transferred to blockchain *********");
printBalances();

Erc20_DAI.balanceOf.call(BettingAddress,
    function(error, balance){
        assertEquals(balance, 2 * validApproveAmount, "Check Derivative contract balance after approve and activate." );
    });

// Assert that the money has been moved from me and other to Derivative contract
// Check my balance change
Erc20_DAI.balanceOf.call(me,
    function(error, balance) {
        assertEquals( balance, valueBeforeActivate - validApproveAmount, "Check my balance after activate" );
    });

Erc20_DAI.balanceOf(other,
    function(error, balance) {
        assertEquals( balance, valueBeforeActivate - validApproveAmount, "Check other balance after activate" );
    });


sleep(1100)

// Execute the simple betting contract
cs  = OldTransfer_.execute({from: me, gas: 3000000});
tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

// Assert that Derivative contract has no money left
Erc20_DAI.balanceOf(BettingAddress,
    function(error, balance) {
        assertEquals( balance, 0, "Check Derivative contract balance after execute" );
    });

//Assert that the right amount was sent back to me after execute
Erc20_DAI.balanceOf(me,
    function(error, balance) {
        assertEquals( balance, 2 * validApproveAmount, "Check my balance after execute" );
    });

// Assert that recipient has received the correct amount
Erc20_DAI.balanceOf(other,
    function(error, balance) {
        assertEquals( balance, valueBeforeActivate - validApproveAmount, "Check other balance after execute" );
    });

console.log("\n\n\n********* Bet has been settled *********");
printBalances();
