web3.eth.defaultAccount = web3.eth.accounts[0];
var me = web3.eth.defaultAccount;
var other = web3.eth.accounts[1];

var transfer = Erc20_CHF.transfer(other, 1000);

var balance = Erc20_CHF.balanceOf(me);
console.log(me);
console.log("Balance: " + balance);

console.log(transfer);
var balanceOther = Erc20_CHF.balanceOf(other);
console.log(balanceOther);


