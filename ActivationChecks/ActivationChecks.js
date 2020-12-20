web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract = ActivationChecks_;
var contract_address = contract.address;

log_big("Activation test.");
do_approve(1000, 3000000, contract_address);

do_set(DataFeed1_, 10);
do_set(DataFeed0_, 1);

fail(do_pay(contract, contract_address), "Disallow pay before activation");
fail(do_mint(contract, 1), "Disallow mint before activation`");

assertEquals(contract.balanceOf(me, 0).toNumber(), 0, "PartyToken 0 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");

// Activate with too big a number (approved 1000 only, 51 * 20 = 1020 > 1000)
fail(do_activate(contract, 51), "Disallow activation with too big number");
assertEquals(contract.balanceOf(me, 0).toNumber(), 0, "PartyToken 0 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");

// Activate with legal amount and verify that this is allowed
succ(do_activate(contract, 50), "Allow activation with appropriate number");
assertEquals(contract.balanceOf(me, 0).toNumber(), 50, "PartyToken 0 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, 1).toNumber(), 50, "PartyToken 1 should have balance 0 before activation");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19000, "Settlement asset should have balance 20,000 before activation");
