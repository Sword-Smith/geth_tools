web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract_address = SafeMul_.address;
var contract = SafeMul_;

log_big("Preparing for the safe multiplication test.");
do_approve(1000, 3000000, contract_address)
do_activate(contract, 50);

//
do_set(DataFeed1_, 0);
do_set(DataFeed2_, Math.pow(2,254));
do_pay_a_bit(contract, contract_address);

do_set(DataFeed1_, -1);
do_set(DataFeed2_, -Math.pow(2,255));
fail(do_pay(contract, contract_address));

// try to overflow, get rejected
do_set(DataFeed1_, -3);
do_set(DataFeed2_, Math.pow(2,254));
fail(do_pay(contract, contract_address));

// then it tries some legal number, and succeeds
do_set(DataFeed1_, 1);
succ(do_pay(contract, contract_address));
