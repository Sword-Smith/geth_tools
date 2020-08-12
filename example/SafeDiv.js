web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

// REWRITE
// highest positive i256 is 2^255-1,
// which a f64 probably cant reliably represent,
// so we trigger overflow on -2^254 * 2 instead
// and show that 2^253 * 2 doesnt overflow

var contract_address = SafeDiv_.address;
var contract = SafeDiv_;

log_big("Preparing for the safe division test.");

do_approve(1000, 3000000, contract, contract_address)

do_activate(contract, contract_address, 50);

// first it tries to overflow, gets rejected
log_big("This should be rejected (execution reverted) due to /0!");
do_set(DataFeed1_, 1);
do_set(DataFeed2_, 0);
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);

log_big("This should be rejected (execution reverted) due to the other special case.");
do_set(DataFeed1_, -Math.pow(2,255));
do_set(DataFeed2_, -1);
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);

// then it tries some legal number, and succeeds
log_big("This should work.");
do_set(DataFeed1_, 1);
do_set(DataFeed2_, 1);
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);

log_big("Done with safe division test!");
