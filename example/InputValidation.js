web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract = InputValidation_;
var contract_address = contract.address;

log_big("Preparing for the InputValidation_ test.");
do_approve(1000, 3000000, contract_address);
do_changeAdmin(contract_address);
do_set(DataFeed1_, Math.pow(2, 10));

fail(do_activate(contract, -1));
fail(do_activate(contract, 0));
succ(do_activate(contract, 1));

fail(do_mint(contract, -1));
fail(do_mint(contract, 0));
succ(do_mint(contract, 1));

fail(do_burn(contract, -1));
fail(do_burn(contract, 0));
succ(do_mint(contract, 1));

succ(do_pay(contract, contract_address));
