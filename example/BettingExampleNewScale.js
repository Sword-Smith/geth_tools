web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
console.log(""); // Print an extra line to make output look nicer

// Check state before activate
var BettingAddress = BettingExampleNewScale_.address;
var allowanceBeforeApprove = Erc20_CHF.allowance(me,BettingAddress).toNumber();
var balanceBeforeActivate = Erc20_CHF.balanceOf(me).toNumber();


function printBalances() {
    Erc20_CHF.balanceOf.call(me, function(error, balance){ console.log("My balance on token contract CHF is: " + balance) } );
    Erc20_CHF.balanceOf.call(BettingAddress, function(error, balance){ console.log("Derivative contract balance on token contract CHF is: " + balance) } );
    Erc20PartyToken_pos0.balanceOf.call(me, function(error, balance){ console.log("PT.pos0.balance(me): " + balance) } );
    Erc20PartyToken_pos1.balanceOf.call(me, function(error, balance){ console.log("PT.pos1.balance(me): " + balance) } );


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



// APPROVE

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

console.log("\n\n\n********* Called approve(1000) on SA *********");
printBalances();

//console.log("\n\n\nAllowance equals the approved amount. Continueing to `activate(validApproveAmount)`...\n\n\n");


t0_A = web3.eth.getTransaction(b_A);


/*
var subscription = web3.eth.subscribe('logs', {}, function(error, result){
    if (error) console.log(error);
}).on("data", function(trxData){
  console.log("Event received", trxData);
  //Code from here would be run immediately when event appeared
});
*/

// ACTIVATE
b_A = BettingExampleNewScale_.activate(7);
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

console.log("\n\n\n********* Called activate(7) on DC *********");
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




console.log("********* Calling burn(4) on DC *********");

// BURN
burn = BettingExampleNewScale_.burn(4);
burn_tx = web3.eth.getTransaction(burn);
while(burn_tx.blockNumber === null){
    burn_tx = web3.eth.getTransaction(burn);
}

printBalances();


console.log("********* Calling burn(5) on DC *********");
try {
// BURN too much
burn = BettingExampleNewScale_.burn(5);
burn_tx = web3.eth.getTransaction(burn);
while(burn_tx.blockNumber === null){
    burn_tx = web3.eth.getTransaction(burn);
}
} catch (error) {console.error(error);}

printBalances();



console.log("********* Calling mint(17) on DC *********");
// MINT
mint = BettingExampleNewScale_.mint(17);
mint_tx = web3.eth.getTransaction(mint);
while(mint_tx.blockNumber === null){
    mint_tx = web3.eth.getTransaction(mint);
}

printBalances();


console.log("********* Calling mint(30000) on DC *********");
// MINT too much
try {
mint = BettingExampleNewScale_.mint(30000);
mint_tx = web3.eth.getTransaction(mint);
while(mint_tx.blockNumber === null){
    mint_tx = web3.eth.getTransaction(mint);
}
} catch (error) {console.error(error);}

printBalances();


console.log("********* Calling pay() on DC *********");
try {
pay = BettingExampleNewScale_.pay();
sleep(2000)
pay_tx = web3.eth.getTransaction(pay);
while(pay_tx.blockNumber === null){
sleep(2000)
    pay_tx = web3.eth.getTransaction(pay);
}
} catch (error) {console.error(error);}

printBalances();

console.log("********* Calling pay() on DC *********");
try {
pay = BettingExampleNewScale_.pay();
sleep(2000)
pay_tx = web3.eth.getTransaction(pay);
while(pay_tx.blockNumber === null){
sleep(2000)
    pay_tx = web3.eth.getTransaction(pay);
}
} catch (error) {console.error(error);}

printBalances();














console.log("\n\n\n********* No more user commands *********");
printBalances();
