web3.eth.defaultAccount = web3.eth.accounts[0];
var me = web3.eth.defaultAccount;
var other = web3.eth.accounts[1];

// var transfer = Erc20_CHF.transfer(other, 1000);
var balance = Erc20_CHF.balanceOf(me);
console.log("My address is: " + me);
console.log("My balance is: " + balance);

var balanceOther = Erc20_CHF.balanceOf(other);
console.log("Other address is: " + other)
console.log("Other balance is: " + balanceOther)

var dataFeedValue = 42;
DataFeed0_.set(0, dataFeedValue);
var readdataFeedValue = DataFeed0_.get(0);

console.log("DataFeed value: " + readdataFeedValue);

// Erc20_CHF.approve(BettingExample2_.address, 10000);
// Erc20_CHF.approve(BettingExample2_.address, 10000, {from: other});

// BettingExample2_.activate();

var balanceContract = Erc20_CHF.balanceOf(BettingExample2_.address);
console.log("Contract balance is: " + balanceContract)

BettingExample2_.execute();

balance = Erc20_CHF.balanceOf(me);
console.log("My address is: " + me);
console.log("My balance is: " + balance);

balanceOther = Erc20_CHF.balanceOf(other);
console.log("Other address is: " + other)
console.log("Other balance is: " + balanceOther)

