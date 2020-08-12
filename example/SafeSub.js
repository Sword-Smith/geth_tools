web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

// lowest i256 is -(2^255)
// so we trigger overflow on 1 - (-(2^255))
// 1 - (-1) becomes 2

var contract_address = SafeSub_.address;
var contract = SafeSub_;

log_big("Preparing for the safe subtraction test.");

do_approve(1000, 3000000, contract, contract_address);

do_activate(contract, contract_address, 50);

// first it tries to overflow, gets rejected
log_big("This should be rejected (execution reverted) due to overflow!");
do_set(DataFeed1_, -Math.pow(2, 255));
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);

// then it tries some legal number, and succeeds
log_big("This should work.");
do_set(DataFeed1_, -1);
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);

log_big("Done with safe subtraction test!");
