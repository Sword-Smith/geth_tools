console.log("Start of script.");
web3.eth.defaultAccount = web3.eth.accounts[0];
var me = web3.eth.accounts[0];

var numberOfAddressesUsed = 8;
var i = 0;

var addresses = [];
var i = 1;
for (i = 1; i < numberOfAddressesUsed + 1; i++){
    addresses[i] = web3.eth.accounts[i];
}

var dcAddress = CanonicalNestedDCPick7_.address;
var erc201Address = Erc20_1.address;

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

function printBalances() {
    for(i = 0; i < numberOfAddressesUsed; i++){
        console.log("Ether balance of address " + i + ":" + web3.eth.getBalance(addresses[i]));
    }   
    // Can we also print the relevant ERC20 balances?
}

function sleep(ms) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < ms);
    //return new Promise(function( resolve ){
    //    setTimeout(resolve, ms);
    //})
}


// Transfer ether for tx fee to each address
// We are not waiting for each tx to be mined se we need to wait later.
console.log("Before ether transfer");
for (i = 1; i < numberOfAddressesUsed; i++){
    web3.eth.sendTransaction({ from: me, to: addresses[i], value: web3.toWei(0.1, "ether")});
}

// Transfer tokens 
Erc20_1.transfer( addresses[1], 1, {from: me, gas: 3000000} );
Erc20_2.transfer( addresses[2], 1, {from: me, gas: 3000000} );
Erc20_3.transfer( addresses[3], 1, {from: me, gas: 3000000} );
Erc20_4.transfer( addresses[4], 1, {from: me, gas: 3000000} );
Erc20_5.transfer( addresses[5], 1, {from: me, gas: 3000000} );
Erc20_6.transfer( addresses[6], 1, {from: me, gas: 3000000} );
Erc20_7.transfer( addresses[7], 1, {from: me, gas: 3000000} );
tHexLast = Erc20_8.transfer( addresses[8], 1, {from: me, gas: 3000000} );
tLast = web3.eth.getTransaction(tHexLast);
while(tLast.blockNumber === null){
    tLast = web3.eth.getTransaction(tHexLast);
}

var tHexLast = web3.eth.sendTransaction({ from: me, to: addresses[8], value: web3.toWei(0.1, "ether")});
var tLast = web3.eth.getTransaction(tHexLast);
while(tLast.blockNumber === null){
    tLast = web3.eth.getTransaction(tHexLast);
}
console.log("After ether transfer");

// Approve the correct amounts (1 token for each address)
Erc20_1.approve( dcAddress, 1, {from: addresses[1], gas: 3000000} );
Erc20_2.approve( dcAddress, 1, {from: addresses[2], gas: 3000000} );
Erc20_3.approve( dcAddress, 1, {from: addresses[3], gas: 3000000} );
Erc20_4.approve( dcAddress, 1, {from: addresses[4], gas: 3000000} );
Erc20_5.approve( dcAddress, 1, {from: addresses[5], gas: 3000000} );
Erc20_6.approve( dcAddress, 1, {from: addresses[6], gas: 3000000} );
Erc20_7.approve( dcAddress, 1, {from: addresses[7], gas: 3000000} );
tHexLast = Erc20_8.approve( dcAddress, 1, {from: addresses[8], gas: 3000000} );
tLast = web3.eth.getTransaction(tHexLast);
while(tLast.blockNumber === null){
    tLast = web3.eth.getTransaction(tHexLast);
}

console.log("After approve");

// Assert that all addresses has approved correct amount
assertEquals(
    Erc20_1.allowance(addresses[1], dcAddress),
    1,
    "\nReason: Check allowance after correct approve call 1.");
assertEquals(
    Erc20_2.allowance(addresses[2], dcAddress),
    1,
    "\nReason: Check allowance after correct approve call 2.");
assertEquals(
    Erc20_3.allowance(addresses[3], dcAddress),
    1,
    "\nReason: Check allowance after correct approve call 3.");
assertEquals(
    Erc20_4.allowance(addresses[4], dcAddress),
    1,
    "\nReason: Check allowance after correct approve call 4.");
assertEquals(
    Erc20_5.allowance(addresses[5], dcAddress),
    1,
    "\nReason: Check allowance after correct approve call 5.");
assertEquals(
    Erc20_6.allowance(addresses[6], dcAddress),
    1,
    "\nReason: Check allowance after correct approve call 6.");
assertEquals(
    Erc20_7.allowance(addresses[7], dcAddress),
    1,
    "\nReason: Check allowance after correct approve call 7");
assertEquals(
    Erc20_8.allowance(addresses[8], dcAddress),
    1,
    "\nReason: Check allowance after correct approve call 8");

console.log("Done approving.")

// Call to activate after approval
var b_A = CanonicalNestedDCPick7_.activate({from: me, gas: 3000000});
var t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

// READ STORAGE OF CONTRACT
for (var i = 0; i < 5; i++){
    console.log(i.toString() + web3.eth.getStorageAt(dcAddress, i))
}

// Wait for 40 seconds
sleep(40000);

// Assert that the balance of the DC is updated correctly
assertEquals(
    Erc20_1.balanceOf(addresses[1]),
    0,
    "\nReason: Check my balance after activate (1)");
assertEquals(
    Erc20_2.balanceOf(addresses[2]),
    0,
    "\nReason: Check my balance after activate (2)");
assertEquals(
    Erc20_3.balanceOf(addresses[3]),
    0,
    "\nReason: Check my balance after activate (3)");
assertEquals(
    Erc20_4.balanceOf(addresses[4]),
    0,
    "\nReason: Check my balance after activate (4)");
assertEquals(
    Erc20_5.balanceOf(addresses[5]),
    0,
    "\nReason: Check my balance after activate (5)");
assertEquals(
    Erc20_6.balanceOf(addresses[6]),
    0,
    "\nReason: Check my balance after activate (6)");
assertEquals(
    Erc20_7.balanceOf(addresses[7]),
    0,
    "\nReason: Check my balance after activate (7)");
assertEquals(
    Erc20_8.balanceOf(addresses[8]),
    0,
    "\nReason: Check my balance after activate (8)");

// Execute the DC
var hex  = CanonicalNestedDCPick7_.execute({from: me, gas: 10000000});
var tcs = web3.eth.getTransaction(hex);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(hex);
}

console.log("*** AFTER EXECUTE ***");

// READ STORAGE OF CONTRACT
for (var i = 0; i < 5; i++){
    console.log(i.toString() + web3.eth.getStorageAt(dcAddress, i))
}

// print the DC balances
console.log("DC balance on token contract 1 is: " + Erc20_1.balanceOf(dcAddress));
console.log("DC balance on token contract 2 is: " + Erc20_2.balanceOf(dcAddress));
console.log("DC balance on token contract 3 is: " + Erc20_3.balanceOf(dcAddress));
console.log("DC balance on token contract 4 is: " + Erc20_4.balanceOf(dcAddress));
console.log("DC balance on token contract 5 is: " + Erc20_5.balanceOf(dcAddress));
console.log("DC balance on token contract 6 is: " + Erc20_6.balanceOf(dcAddress));
console.log("DC balance on token contract 7 is: " + Erc20_7.balanceOf(dcAddress));
console.log("DC balance on token contract 8 is: " + Erc20_8.balanceOf(dcAddress));

console.log("my balance on token contract 1 is: " + Erc20_1.balanceOf(me));
console.log("my balance on token contract 2 is: " + Erc20_2.balanceOf(me));
console.log("my balance on token contract 3 is: " + Erc20_3.balanceOf(me));
console.log("my balance on token contract 4 is: " + Erc20_4.balanceOf(me));
console.log("my balance on token contract 5 is: " + Erc20_5.balanceOf(me));
console.log("my balance on token contract 6 is: " + Erc20_6.balanceOf(me));
console.log("my balance on token contract 7 is: " + Erc20_7.balanceOf(me));
console.log("my balance on token contract 8 is: " + Erc20_8.balanceOf(me));

// Assert that the balance of the DC is updated correctly
assertEquals(
    Erc20_1.balanceOf(me),
    999999,
    "\nReason: Check my balance after execute (1)");
assertEquals(
    Erc20_2.balanceOf(me),
    999999,
    "\nReason: Check my balance after execute (2)");
assertEquals(
    Erc20_3.balanceOf(me),
    999999,
    "\nReason: Check my balance after execute (3)");
assertEquals(
    Erc20_4.balanceOf(me),
    999999,
    "\nReason: Check my balance after execute (4)");
assertEquals(
    Erc20_5.balanceOf(me),
    999999,
    "\nReason: Check my balance after execute (5)");
assertEquals(
    Erc20_6.balanceOf(me),
    999999,
    "\nReason: Check my balance after execute (6)");
assertEquals(
    Erc20_7.balanceOf(me),
    1000000,
    "\nReason: Check my balance after execute (7)");
assertEquals(
    Erc20_8.balanceOf(me),
    999999,
    "\nReason: Check my balance after execute (8)");

// Assert that the balance of the DC is updated correctly
assertEquals(
    Erc20_1.balanceOf(addresses[1]),
    1,
    "\nReason: Check balance after execute (1)");
assertEquals(
    Erc20_2.balanceOf(addresses[2]),
    1,
    "\nReason: Check balance after execute (2)");
assertEquals(
    Erc20_3.balanceOf(addresses[3]),
    1,
    "\nReason: Check balance after execute (3)");
assertEquals(
    Erc20_4.balanceOf(addresses[4]),
    1,
    "\nReason: Check balance after execute (4)");
assertEquals(
    Erc20_5.balanceOf(addresses[5]),
    1,
    "\nReason: Check balance after execute (5)");
assertEquals(
    Erc20_6.balanceOf(addresses[6]),
    1,
    "\nReason: Check balance after execute (6)");
assertEquals(
    Erc20_7.balanceOf(addresses[7]),
    0,
    "\nReason: Check balance after execute (7)");
assertEquals(
    Erc20_8.balanceOf(addresses[8]),
    1,
    "\nReason: Check balance after activate (8)");
