web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract_address = SafeAdd_.address;
var contract = SafeAdd_;

log_big("Preparing for the safe addition test.");
do_approve(1000, 3000000, contract_address);
do_activate(contract, 50);

// first it tries to overflow, gets rejected
do_set(DataFeed1_, Math.pow(2, 254));
fail(do_pay(contract, contract_address));

// then it tries some legal number, and succeeds
do_set(DataFeed1_, Math.pow(2, 253));
succ(do_pay(contract, contract_address));
