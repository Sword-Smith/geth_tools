web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
console.log("My address is: " + me);

// Tmc6 interaction
tmc_address_EUR = Tmc6_EUR.address;
console.log("EUR: The Tmc6 address is: " + tmc_address_EUR);
var balance_EUR = Tmc6_EUR.balanceOf(me);
console.log("EUR: My balance is now: " + balance_EUR);
//var allowance_EUR = Tmc6_EUR.allowance(me, t_contract, {from: me, gas: 3000000});
//console.log("EUR: The allowance is now: " + allowance_EUR);
var is_my_address_a_contract = Tmc6_EUR.isContract(me);
console.log("is_my_address_a_contract=" + is_my_address_a_contract);
var is_Tmc_address_a_contract = Tmc6_EUR.isContract(tmc_address_EUR);
console.log("is_Tmc_address_a_contract=" + is_Tmc_address_a_contract);
