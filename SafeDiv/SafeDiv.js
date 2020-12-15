web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract_address = SafeDiv_.address;
var contract = SafeDiv_;

log_big("Preparing for the safe division test.");
succ(do_approve(1000, 3000000, contract_address));
succ(do_activate(contract, 50));

// first it tries to overflow, gets rejected
succ(do_set(DataFeed1_, 1));
succ(do_set(DataFeed2_, 0));
succ(do_set(DataFeed0_, 1)); // 
fail(do_pay(contract, contract_address));

do_set(DataFeed1_, -Math.pow(2,255));
do_set(DataFeed2_, -1);
fail(do_pay(contract, contract_address));

// then it tries some legal number, and succeeds
do_set(DataFeed1_, 1);
do_set(DataFeed2_, 1);
succ(do_pay(contract, contract_address));
