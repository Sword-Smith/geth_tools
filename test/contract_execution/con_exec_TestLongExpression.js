web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
console.log("My address is: " + me);

t_contract = TestLongExpression_.address;
console.log("TestLongExpression_ address is: " + t_contract);
code = web3.eth.getCode(t_contract);
console.log("The code present on this address: " + code );
tmc_address_EUR = Tmc4_EUR.address;
console.log("EUR: The Tmc4 address is: " + tmc_address_EUR);
var balance_EUR = Tmc4_EUR.balanceOf(me);
console.log("EUR: My balance is now: " + balance_EUR);
var allowance_EUR = Tmc4_EUR.allowance(me, t_contract, {from: me, gas: 3000000});
console.log("EUR: The allowance is now: " + allowance_EUR);

tmc_address_USD = Tmc4_USD.address;
console.log("USD: The Tmc4 USD address is: " + tmc_address_USD);
var balance0_USD = Tmc4_USD.balanceOf(me);
console.log("USD: My balance is now: " + balance0_USD);
var allowance0_USD = Tmc4_USD.allowance(me, t_contract, {from: me, gas: 3000000});
console.log("USD: The allowance is now: " + allowance0_USD);

// Allow contract to transfer 500 of my money
console.log('EUR: Now calling "approve"');
var b_EUR = Tmc4_EUR.approve( t_contract, 500, {from: me, gas: 3000000} );
var t0_EUR = web3.eth.getTransaction(b_EUR);
while(t0_EUR.blockNumber === null){
    t0_EUR = web3.eth.getTransaction(b_EUR);
}

console.log('EUR: "approve" has been called');
var allowance1_EUR = Tmc4_EUR.allowance(me, t_contract, {from: me, gas: 3000000} );
console.log("EUR: The allowance is: " + allowance1_EUR);
var totalLockedAmount1_EUR = Tmc4_EUR.totalLockedAmount(me);
console.log("EUR: The totalLockedAmount method returns: " + totalLockedAmount1_EUR);
var spenderToApproval1_EUR = Tmc4_EUR.spenderToApproval(t_contract);
console.log("EUR: The spenderToApproval method returns: " + spenderToApproval1_EUR);

// Allow contract to transfer 500 of my money
console.log('USD: Now calling "approve"');
var b_USD = Tmc4_USD.approve( t_contract, 500, {from: me, gas: 3000000} );
var t0_USD = web3.eth.getTransaction(b_USD);
while(t0_USD.blockNumber === null){
    t0_USD = web3.eth.getTransaction(b_USD);
}

console.log('USD: "approve" has been called');
var allowance1_USD = Tmc4_USD.allowance(me, t_contract, {from: me, gas: 3000000} );
console.log("USD: The allowance is: " + allowance1_USD);
var totalLockedAmount1_USD = Tmc4_USD.totalLockedAmount(me);
console.log("USD: The totalLockedAmount method returns: " + totalLockedAmount1_USD);
var spenderToApproval1_USD = Tmc4_USD.spenderToApproval(t_contract);
console.log("USD: The spenderToApproval method returns: " + spenderToApproval1_USD);

// Do the transfer by executing the contract
var balance_EUR = Tmc4_EUR.balanceOf(me);
var balance_USD = Tmc4_USD.balanceOf(me);
console.log("EUR: My balance is now: " + balance_EUR);
console.log("USD: My balance is now: " + balance_USD);
console.log("EUR & USD: Now executing contract TestLongExpression_");
var execute_transaction = TestLongExpression_.execute({from: me, gas: 3000000} );
var t1 = web3.eth.getTransaction(execute_transaction);
while(t1.blockNumber === null){
    t1 = web3.eth.getTransaction(execute_transaction);
}

console.log("transaction was sent to: " + t1.to);
console.log("transaction was sent from: " + t1.from);
console.log("transaction gas provided: " + t1.gas);
console.log("transaction input: " + t1.input);
var balance_EUR = Tmc4_EUR.balanceOf(me);
var balance_USD = Tmc4_USD.balanceOf(me);
console.log("EUR: My balance is now: " + balance_EUR);
console.log("USD: My balance is now: " + balance_USD);
