web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
console.log("My address is: " + me);

t_contract = translateCurrencySwap_.address;
console.log("translateCurrencySwap_ address is: " + t_contract);
code = web3.eth.getCode(t_contract);
console.log("The code present on this address: " + code );
tmc_address_DKK = Tmc3_DKK.address;
console.log("DKK: The Tmc3 address is: " + tmc_address_DKK);
var balance_DKK = Tmc3_DKK.balanceOf(me);
console.log("DKK: My balance is now: " + balance_DKK);
var allowance_DKK = Tmc3_DKK.allowance(me, t_contract, {from: me, gas: 3000000});
console.log("DKK: The allowance is now: " + allowance_DKK);

tmc_address_USD = Tmc3_USD.address;
console.log("USD: The Tmc3 USD address is: " + tmc_address_USD);
var balance0_USD = Tmc3_USD.balanceOf(me);
console.log("USD: My balance is now: " + balance0_USD);
var allowance0_USD = Tmc3_USD.allowance(me, t_contract, {from: me, gas: 3000000});
console.log("USD: The allowance is now: " + allowance0_USD);

// Do the cancel by cancelling the contract
var balance_DKK = Tmc3_DKK.balanceOf(me);
var balance_USD = Tmc3_USD.balanceOf(me);
console.log("DKK: My balance is now: " + balance_DKK);
console.log("USD: My balance is now: " + balance_USD);
console.log("DKK & USD: Now executing contract translateCurrencySwap_");
var cancel_transaction = translateCurrencySwap_.cancel({from: me, gas: 3000000} );
var t1 = web3.eth.getTransaction(cancel_transaction);
while(t1.blockNumber === null){
    t1 = web3.eth.getTransaction(cancel_transaction);
}

console.log("transaction was sent to: " + t1.to);
console.log("transaction was sent from: " + t1.from);
console.log("transaction gas provided: " + t1.gas);
console.log("transaction input: " + t1.input);
var balance_DKK = Tmc3_DKK.balanceOf(me);
var balance_USD = Tmc3_USD.balanceOf(me);
console.log("DKK: My balance is now: " + balance_DKK);
console.log("USD: My balance is now: " + balance_USD);

code = web3.eth.getCode(t_contract);
console.log("The code present on this address: " + code );
