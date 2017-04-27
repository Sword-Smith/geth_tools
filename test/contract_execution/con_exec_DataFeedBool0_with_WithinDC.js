web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
console.log("My address is: " + me);

// Derivative Contract
t_contract = TestIfWithinContract_.address;
console.log("TestIfWithinContract_ address is: " + t_contract);
code = web3.eth.getCode(t_contract);
console.log("The code present on this address: " + code );

// Data feed contract
DF_contract = DataFeedBool0_.address;
console.log("DataFeedBool0_ address is: " + DF_contract);
code = web3.eth.getCode(DF_contract);
console.log("The code present on this address: " + code);

console.log("Now setting value in DataFeed0 contract");
var set_tr = DataFeedBool0_.set( 101, true , {from: me, gas: 3000000} );
var t0 = web3.eth.getTransaction(set_tr);
while(t0.blockNumber === null){
    t0 = web3.eth.getTransaction(set_tr);
}

// Token smart contract
tmc_address_EUR = Tmc4_EUR.address;
console.log("EUR: The Tmc4 address is: " + tmc_address_EUR);
var balance_EUR = Tmc4_EUR.balanceOf(me);
console.log("EUR: My balance is now: " + balance_EUR);
var allowance_EUR = Tmc4_EUR.allowance(me, t_contract, {from: me, gas: 3000000});
console.log("EUR: The allowance is now: " + allowance_EUR);

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

// Do the transfer by executing the contract
var balance_EUR = Tmc4_EUR.balanceOf(me);
console.log("EUR: My balance is now: " + balance_EUR);
console.log("EUR: Now executing contract TestIfWithinContract_");
var execute_transaction = TestIfWithinContract_.execute({from: me, gas: 3000000} );
var t1 = web3.eth.getTransaction(execute_transaction);
while(t1.blockNumber === null){
    t1 = web3.eth.getTransaction(execute_transaction);
}

console.log("transaction was sent to: " + t1.to);
console.log("transaction was sent from: " + t1.from);
console.log("transaction gas provided: " + t1.gas);
console.log("transaction input: " + t1.input);
var balance_EUR = Tmc4_EUR.balanceOf(me);
console.log("EUR: My balance is now: " + balance_EUR);

// Derivative Contract
t_contract = TestIfWithinContract_.address;
console.log("TestIfWithinContract_ address is: " + t_contract);
code = web3.eth.getCode(t_contract);
console.log("The code present on this address: " + code );
