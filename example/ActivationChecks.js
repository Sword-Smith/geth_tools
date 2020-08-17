web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

// TODO: Is this test thorough enough?

var contract = ActivationChecks_;
var contract_address = contract.address;

log_big("Preparing for the ActivationChecks_ test.");

do_approve(1000, 3000000, contract, contract_address)

do_set(DataFeed1_, Math.pow(2, 2));

log_big("This should be rejected due to not-activate!");
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);


log_big("This should be work.");
do_activate(contract, contract_address, 50);

log_big("This should be rejected due to already-activated!");

log_big("This should be work.");
do_pay(contract, contract_address);
do_pay(contract, contract_address);
do_pay(contract, contract_address);

log_big("Done with the ActivationChecks_ test.");
