web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
other = web3.eth.accounts[1];

var contract = TransferChecks_;
var contract_address = contract.address;
log_big("TransferChecks_ test.");
do_approve(1000, 3000000, contract_address);

var a0 = contract.balanceOf(me, 0);
var a1 = contract.balanceOf(me, 1);
var saBalanceBefore = Erc20_CHF.balanceOf(me);
assertEquals(a0.toNumber(), 0, "PartyToken 0 should have balance 0 before activation");
assertEquals(a1.toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(saBalanceBefore.toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");

succ(do_activate(contract, 5), "Allow activation with 5");

var a0New = contract.balanceOf(me, 0);
var a1New = contract.balanceOf(me, 1);
var saBalanceAfter = Erc20_CHF.balanceOf(me);
assertEquals(a0New.toNumber(), 5, "PartyToken 0 should have balance 5 after activation");
assertEquals(a1New.toNumber(), 5, "PartyToken 1 should have balance 5 after activation");
assertEquals(saBalanceAfter.toNumber(), 19800, "Settlement asset should have balance 19,800 after activation");

// ...
do_transfer(contract, me, other, 0, 4);

assertEquals(contract.balanceOf(me, 0).toNumber(), 1, "I should have transferred 4 of PT 0 to other.");
assertEquals(contract.balanceOf(me, 1).toNumber(), 5, "I should not have transferred any of PT 1.");
assertEquals(contract.balanceOf(other, 0).toNumber(), 4, "Other should have received 4 of PT 0.");
assertEquals(contract.balanceOf(other, 1).toNumber(), 0, "Other should not have any of PT 1.");

fail(do_transfer(contract, me, "0x0000000000000000000000000000000000000000", 0, 1), "Fail when _to is 0 (ERC-1155 requirement).");