web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

// TODO: Is this test thorough enough?

var contract = ActivationChecks_;
var contract_address = contract.address;

log_big("ActivationChecks_ test.");

do_approve(1000, 3000000, contract_address);
do_set(DataFeed1_, Math.pow(2, 2));

fail(do_pay(contract, contract_address));
fail(do_mint(contract, 1));

succ(do_activate(contract, 1));
fail(do_activate(contract, 1));

succ(do_mint(contract, 1));
succ(do_pay(contract, contract_address));
