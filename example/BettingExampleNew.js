web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
console.log(""); // Print an extra line to make output look nicer

// Check state before activate
var BettingAddress = BettingExampleNew_.address;
var allowanceBeforeApprove = Erc20_CHF.allowance(me,BettingAddress).toNumber();
var balanceBeforeActivate = Erc20_CHF.balanceOf(me).toNumber();


function printBalances() {
    Erc20_CHF.balanceOf.call(me, function(error, balance){ console.log("My balance on token contract CHF is: " + balance) } );
    Erc20_CHF.balanceOf.call(BettingAddress, function(error, balance){ console.log("Derivative contract balance on token contract CHF is: " + balance) } );
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
        throw "\nActual: " + actual.toString() + " type: " + typeof(actual) +
              "\nExpected: " + expected.toString() + " type: " + typeof(expected) +
              "\n" +
              (reason === "" ? "" : reason + " ... FAIL");
}

function sleep(ms) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < ms);
}



assertEquals(allowanceBeforeApprove, 0, "Allowance before activate not zero.");
assertEquals(balanceBeforeActivate, 20000, "Balance before activate not expected value.");

console.log("\n\n\n********* Before bet *********");
printBalances();


var validApproveAmount = 1000;

b_A = Erc20_CHF.approve( BettingAddress, validApproveAmount, {from: me, gas: 3000000} );
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

Erc20_CHF.allowance.call(me, BettingAddress,
    function(error, allowance){
         assertEquals(allowance, validApproveAmount, "Check allowance after correct approve call.." );
    });

console.log("\n\n\nAllowance equals the approved amount. Continueing to `activate(validApproveAmount)`...\n\n\n");

// Call to activate
//b_A = BettingExampleNew_.activate({from: me, gas: 3000000});
b_A = BettingExampleNew_.activate(1);
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

console.log("\n\n\n********* Funds transferred to blockchain *********");
printBalances();

Erc20_CHF.balanceOf.call(BettingAddress,
    function(error, balance){
        assertEquals(balance, 2 * validApproveAmount, "Check Derivative contract balance after approve and activate." );
    });

// Assert that the money has been moved from me and other to Derivative contract
// Check my balance change
Erc20_CHF.balanceOf.call(me,
    function(error, balance) {
        assertEquals( balance, valueBeforeActivate - validApproveAmount, "Check my balance after activate" );
    });

Erc20_CHF.balanceOf(other,
    function(error, balance) {
        assertEquals( balance, valueBeforeActivate - validApproveAmount, "Check other balance after activate" );
    });

// Execute the simple betting contract
cs  = BettingExampleNew_.execute({from: me, gas: 3000000});
tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

// Assert that Derivative contract has no money left
Erc20_CHF.balanceOf(BettingAddress,
    function(error, balance) {
        assertEquals( balance, 0, "Check Derivative contract balance after execute" );
    });

//Assert that the right amount was sent back to me after execute
Erc20_CHF.balanceOf(me,
    function(error, balance) {
        assertEquals( balance, 2 * validApproveAmount, "Check my balance after execute" );
    });

// Assert that recipient has received the correct amount
Erc20_CHF.balanceOf(other,
    function(error, balance) {
        assertEquals( balance, valueBeforeActivate - validApproveAmount, "Check other balance after execute" );
    });

console.log("\n\n\n********* Bet has been settled *********");
printBalances();
