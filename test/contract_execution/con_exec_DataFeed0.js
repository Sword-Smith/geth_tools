web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.defaultAccount;
console.log("My address is: " + me);

t_contract = DataFeed0_.address;
console.log("DataFeed0_ address is: " + t_contract);
code = web3.eth.getCode(t_contract);
console.log("The code present on this address: " + code);

console.log("Now setting value in DataFeed0 contract");
var set_tr = DataFeed0_.set( 1001, 1002, {from: me, gas: 3000000} );
var t0 = web3.eth.getTransaction(set_tr);
while(t0.blockNumber === null){
    t0 = web3.eth.getTransaction(set_tr);
}

console.log("Now calling get method in DataFeed0 contract");

var get_return_val = DataFeed0_.get(1003);
console.log("DataFeed0 returns: " + get_return_val);
