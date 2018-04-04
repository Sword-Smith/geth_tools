web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
bettingExampleAddress = BettingExample_.address;
console.log("My address is: " + me);
console.log("Betting example address is: " + bettingExampleAddress);

console.log("********* BEFORE EXECUTION OF BETTING EXAMPLE *********");
var balance_A = Tmc4_A.balanceOf(me);
console.log("My balance on token contract A is: " + balance_A);
var balance_B = Tmc4_B.balanceOf(me);
console.log("My balance on token contract B is: " + balance_B);

// Allow contract to transfer 500 of my money
console.log('Now calling "approve" on the token contract A');
var b_A = Tmc4_A.approve( bettingExampleAddress, 500, {from: me, gas: 3000000} );
var t0_A = web3.eth.getTransaction(b_A);
while(t0_A.blockNumber === null){
    t0_A = web3.eth.getTransaction(b_A);
}

var allowance_A = Tmc4_A.allowance(me, bettingExampleAddress);
console.log('allowance is now ' + allowance_A  + ' on the token contract A');

console.log('Now transfer "approve" on the token contract B');
var b_B = Tmc4_B.approve( bettingExampleAddress, 500, {from: me, gas: 3000000} );
var t0_B = web3.eth.getTransaction(b_B);
while(t0_B.blockNumber === null){
    t0_B = web3.eth.getTransaction(b_B);
}

// Now set a value for the data feed contract
console.log('Set observable value');
var df = DataFeed0_.set( 0, 100, {from: me, gas: 3000000} );
var tdf = web3.eth.getTransaction(df);
while(tdf.blockNumber === null){
    tdf = web3.eth.getTransaction(df);
}
var dfValue = DataFeed0_.get(0);
console.log('Datafeed value is now set to: ' + dfValue + ".");

// Execute the betting contract
console.log('Call execute on the BettingExample contract.');
var cs  = BettingExample_.execute({from: me, gas: 3000000});
var tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

// Check the balances of my own address and the address to which I have transferred
console.log("********* AFTER EXECUTION OF BETTING EXAMPLE *********");
balance_A = Tmc4_A.balanceOf(me);
console.log("My balance on token contract A is: " + balance_A);
balance_B = Tmc4_B.balanceOf(me);
console.log("My balance on token contract B is: " + balance_B);
balance_A = Tmc4_A.balanceOf("0x0123456789012345678901234567890123456789");
console.log("0x0123456789012345678901234567890123456789 balance on token contract A is: " + balance_A);
balance_B = Tmc4_B.balanceOf("0x0123456789012345678901234567890123456789");
console.log("0x0123456789012345678901234567890123456789 balance on token contract B is: " + balance_B);

// Execute the betting contract
var cs  = BettingExample_.execute({from: me, gas: 3000000});
var tcs = web3.eth.getTransaction(cs);
while(tcs.blockNumber === null){
    tcs = web3.eth.getTransaction(cs);
}

// Check the balances of my own address and the address to which I have transferred
console.log("********* AFTER EXECUTION OF BETTING EXAMPLE *********");
balance_A = Tmc4_A.balanceOf(me);
console.log("My balance on token contract A is: " + balance_A);
balance_B = Tmc4_B.balanceOf(me);
console.log("My balance on token contract B is: " + balance_B);
balance_A = Tmc4_A.balanceOf("0x0123456789012345678901234567890123456789");
console.log("0x0123456789012345678901234567890123456789 balance on token contract A is: " + balance_A);
balance_B = Tmc4_B.balanceOf("0x0123456789012345678901234567890123456789");
console.log("0x0123456789012345678901234567890123456789 balance on token contract B is: " + balance_B);
