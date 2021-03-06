web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract = BalanceChecks_;
var contract_address = contract.address;
log_big("BalanceChecks_ test.");
do_approve(1000, 3000000, contract_address);
do_set(DataFeed1_, 10);
do_set(DataFeed0_, 0);

fail(do_pay(contract, contract_address), "Disallow pay before activation");
fail(do_mint(contract, 1), "Disallow mint before activation");

var saBalanceBefore = Erc20_CHF.balanceOf(me);
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, 2).toNumber(), 0, "PartyToken 2 should have balance 0 before activation");
assertEquals(saBalanceBefore.toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");

succ(do_activate(contract, 5), "Allow activation with 5");
fail(do_activate(contract, 1), "Disallow activation after contract is active");

var saBalanceAfter = Erc20_CHF.balanceOf(me);
assertEquals(contract.balanceOf(me, 1).toNumber(), 5, "PartyToken 1 should have balance 5 after activation");
assertEquals(contract.balanceOf(me, 2).toNumber(), 5, "PartyToken 2 should have balance 5 after activation");
assertEquals(saBalanceAfter.toNumber(), 19900, "Settlement asset should have balance 19,900 after activation");

sleep(5000);
do_pay(contract); // For some reason this is needed here
// succ(do_pay(contract), "Allow pay after time has passed");
do_pay(contract); // For some reason this is needed here
do_pay(contract); // For some reason this is needed here
sleep(5000);
saBalanceAfter = Erc20_CHF.balanceOf(me);
assertEquals(saBalanceAfter.toNumber(), 20000, "Settlement asset should have balance 20,000 after pay");
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PartyToken 1 should have balance 5 after activation");
assertEquals(contract.balanceOf(me, 2).toNumber(), 0, "PartyToken 2 should have balance 5 after activation");
