// Helper
var RES = {
  FAIL: "fail",
  SUCC: "succ"
}



function printBalances() {
    Erc20_CHF.balanceOf.call(me, function(error, balance){ console.log("My balance on token contract CHF is: " + balance) } );
    Erc20_CHF.balanceOf.call(BettingAddress, function(error, balance){ console.log("Derivative contract balance on token contract CHF is: " + balance) } );
    Erc20PartyToken_pos0.balanceOf.call(me, function(error, balance){ console.log("PT.pos0.balance(me): " + balance) } );
    Erc20PartyToken_pos1.balanceOf.call(me, function(error, balance){ console.log("PT.pos1.balance(me): " + balance) } );
    console.log("---------------------------------------------------\n\n\n");

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





web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
console.log(""); // Print an extra line to make output look nicer

// Check state before activate
var BettingAddress = BettingExampleNew_.address;
var allowanceBeforeApprove = Erc20_CHF.allowance(me,BettingAddress).toNumber();
var balanceBeforeActivate = Erc20_CHF.balanceOf(me).toNumber();

// WIP listen to events
var abi = [{"payable":"","type":"function","inputs":[],"constant":"","name":"execute","outputs":[]},{"outputs":[],"name":"pay","constant":"","inputs":[],"type":"function","payable":""},{"type":"function","inputs":[{"type":"uint256","name":"amount"}],"payable":"","name":"activate","constant":"","outputs":[]},{"type":"function","inputs":[{"name":"amount","type":"uint256"}],"payable":"","outputs":[],"constant":"","name":"mint"},{"type":"function","payable":"","inputs":[{"name":"amount","type":"uint256"}],"constant":"","name":"burn","outputs":[]},{"payable":"","type":"function","inputs":[{"type":"uint256","name":"party"}],"outputs":[],"name":"take","constant":""},{"name":"Activated","anonymous":"","type":"event","inputs":[]}]
var mc = web3.eth.contract(abi);
var mci = mc.at(BettingAddress)
var events = mci.allEvents();
events.watch(function(error, event) { console.log(event); });




assertEquals(allowanceBeforeApprove, 0, "Allowance before activate not zero.");
assertEquals(balanceBeforeActivate, 20000, "Balance before activate not expected value.");

console.log("********* Before bet *********");
printBalances();



// APPROVE

console.log("********* Calling approve() on SA *********");
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


console.log("********* Change Admin on PTs *********");
do_changeAdmin(BettingAddress);

console.log("********* Calling activate(7) on DC *********");

// ACTIVATE
b_A = BettingExampleNew_.activate(7);
t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

printBalances();

// Assert that the money has been moved from me and other to Derivative contract
// Check my balance change
Erc20_CHF.balanceOf.call(BettingAddress,
    function(error, balance){
        assertEquals(balance, 2 * validApproveAmount, "Check Derivative contract balance after approve and activate." );
    });

Erc20_CHF.balanceOf.call(me,
    function(error, balance) {
        assertEquals( balance, valueBeforeActivate - validApproveAmount, "Check my balance after activate" );
    });


console.log("********* Calling burn(4) on DC *********");

// BURN
burn = BettingExampleNew_.burn(4);
burn_tx = web3.eth.getTransaction(burn);
while(burn_tx.blockNumber === null){
    burn_tx = web3.eth.getTransaction(burn);
}

printBalances();


console.log("********* Calling burn(5) on DC *********");
try {
// BURN too much
burn = BettingExampleNew_.burn(5);
burn_tx = web3.eth.getTransaction(burn);
while(burn_tx.blockNumber === null){
    burn_tx = web3.eth.getTransaction(burn);
}
} catch (error) {console.error(error);}

printBalances();



console.log("********* Calling mint(17) on DC *********");
// MINT
mint = BettingExampleNew_.mint(17);
mint_tx = web3.eth.getTransaction(mint);
while(mint_tx.blockNumber === null){
    mint_tx = web3.eth.getTransaction(mint);
}

printBalances();


console.log("********* Calling mint(30000) on DC *********");
// MINT too much
try {
mint = BettingExampleNew_.mint(30000);
mint_tx = web3.eth.getTransaction(mint);
while(mint_tx.blockNumber === null){
    mint_tx = web3.eth.getTransaction(mint);
}
} catch (error) {console.error(error);}

printBalances();



// Assert that the money has been moved from me and other to Derivative contract
// Check my balance change
// Erc20_CHF.balanceOf.call(BettingAddress,
//     function(error, balance){
//         assertEquals(balance, 2 * validApproveAmount, "Check Derivative contract balance after approve and activate." );
//     });
// 
// Erc20_CHF.balanceOf.call(me,
//     function(error, balance) {
//         assertEquals( balance, valueBeforeActivate - validApproveAmount, "Check my balance after activate" );
//     });

//console.log("\n\n\n********* No more user commands *********");
//printBalances();
//var myResults = events.get(function(error, logs){  console.log(event); });

function do_changeAdmin(contract_address) {
  try {
    tx0 = Erc20PartyToken_pos0.changeAdmin(contract_address);
    tx1 = Erc20PartyToken_pos1.changeAdmin(contract_address);
    while (tx0 === null || tx1 === null) {
      tx0 = Erc20PartyToken_pos0.changeAdmin(contract_address);
      tx1 = Erc20PartyToken_pos1.changeAdmin(contract_address);
    }
  } catch (error) {return RES.FAIL;} return RES.SUCC;
}

