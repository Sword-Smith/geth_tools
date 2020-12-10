web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract = BalanceChecks_;
var contract_address = contract.address;
log_big("BalanceChecks_ test.");
do_approve(1000, 3000000, contract_address);
do_set(DataFeed1_, Math.pow(2, 2));

fail(do_pay(contract, contract_address));
fail(do_mint(contract, 1));

var a0 = contract.balanceOf(me, 0);
var a1 = contract.balanceOf(me, 1);
console.log("own balance of token ID 0, before activation is: " + a0.toNumber());
console.log("own balance of token ID 1, before activation is: " + a1.toNumber());

var saBalanceBefore = Erc20_CHF.balanceOf(me);
assertEquals(a0.toNumber(), 0, "PartyToken 0 should have balance 0 before activation");
assertEquals(a1.toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(saBalanceBefore.toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");

succ(do_activate(contract, 5));
console.log("My SA balance is: " + Erc20_CHF.balanceOf(me));
fail(do_activate(contract, 1));

console.log("Activated");

var a0New = contract.balanceOf(me, 0);
var a1New = contract.balanceOf(me, 1);
console.log("a0 is: " + a0New);
console.log("a1 is: " + a1New);

assertEquals(a0New.toNumber(), 5, "PartyToken 0 should have balance 5 after activation");
assertEquals(a1New.toNumber(), 5, "PartyToken 1 should have balance 5 after activation");
var saBalanceAfter = Erc20_CHF.balanceOf(me);
assertEquals(saBalanceAfter.toNumber(), 19900, "Settlement asset should have balance 19,900 after activation");

fail(do_activate(contract, 1));
