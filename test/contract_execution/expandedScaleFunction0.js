web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
console.log("My address is: " + me);

t_contract = expandedScaleFunction0_.address;
console.log("expandedScaleFunction0_ address is: " + t_contract);

code = web3.eth.getCode(t_contract);
console.log("The code present on this address: " + code );
tmc_address_DKK = Tmc3_DKK.address;
console.log("DKK: The Tmc3 address is: " + tmc_address_DKK);
var balance_DKK = Tmc3_DKK.balanceOf(me);
console.log("DKK: My balance is now: " + balance_DKK);
var allowance_DKK = Tmc3_DKK.allowance(me, t_contract, {from: me, gas: 3000000});
console.log("DKK: The allowance is now: " + allowance_DKK);

console.log('DKK: Now calling "approve"');
var b_DKK = Tmc3_DKK.approve( t_contract, 500, {from: me, gas: 3000000} );
var t0_DKK = web3.eth.getTransaction(b_DKK);
while(t0_DKK.blockNumber === null){
    t0_DKK = web3.eth.getTransaction(b_DKK);
}

var balance_DKK = Tmc3_DKK.balanceOf(me);
console.log("DKK: My balance is now: " + balance_DKK);
console.log("DKK: Now executing contract expandedScaleFunction0_");
var execute_transaction = expandedScaleFunction0_.execute({from: me, gas: 3000000} );
var t1 = web3.eth.getTransaction(execute_transaction);
while(t1.blockNumber === null){
    t1 = web3.eth.getTransaction(execute_transaction);
}

console.log("transaction was sent to: " + t1.to);
console.log("transaction was sent from: " + t1.from);
console.log("transaction gas provided: " + t1.gas);
console.log("transaction input: " + t1.input);
var balance_DKK = Tmc3_DKK.balanceOf(me);
console.log("DKK: My balance is now: " + balance_DKK);

code = web3.eth.getCode(t_contract);
console.log("The code present on this address: " + code );
