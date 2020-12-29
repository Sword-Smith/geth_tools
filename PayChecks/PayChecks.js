web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
var other = web3.eth.accounts[1];

var contract = PayChecks_;
log_big("PayChecks_ test.");
do_approve(240, 3000000, contract.address);
do_set(DataFeed1_, 10);
do_set(DataFeed0_, 1);

fail(do_pay(contract, contract.address), "Disallow pay before activation");

var saBalanceBefore = Erc20_CHF.balanceOf(me);
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, 2).toNumber(), 0, "PartyToken 2 should have balance 0 before activation");
assertEquals(saBalanceBefore.toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 0, "DC Settlement asset balance be 0 before activation");

succ(do_activate(contract, 6), "Allow activation with 6");

assertEquals(contract.balanceOf(me, 1).toNumber(), 6, "PartyToken 1 balance should have balance 6 after activation");
assertEquals(contract.balanceOf(me, 2).toNumber(), 6, "PartyToken 2 balance should have balance 6 after activation");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19880, "Settlement asset should have balance 19,880 after activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 120, "DC Settlement asset balance be 120");

var partyToken1 = 1;
var partyToken2 = 2;
succ(do_transfer(contract, me, other, partyToken1, 3), "transfer party token 1 from me to other");
succ(do_transfer(contract, me, other, partyToken2, 3), "transfer party token 2 from me to other");
// succ(do_pay(contract));

var receipt = get_transaction(contract.pay({from: me}));
console.log("Gas used: " + receipt.gasUsed);

var receipt2 = get_transaction(contract.pay({from: other}));
console.log("Gas used: " + receipt2.gasUsed);

assert(receipt.gasUsed > receipt2.gasUsed, "pay() called second time should use less gas");

succ(do_mint(contract, 6), "mint more coins");

var receipt3 = get_transaction(contract.pay({from: me}));
console.log("Gas used: " + receipt3.gasUsed);

var receipt4 = get_transaction(contract.pay({from: other}));
console.log("Gas used: " + receipt4.gasUsed);

assert(receipt.gasUsed > receipt3.gasUsed, "pay() called third time should use less gas");
assert(receipt.gasUsed > receipt4.gasUsed, "pay() called fourth time should use less gas");

// TODO: Consider why exactly gas cost varies between call 2, 3 and 4.
// TODO: Add tests that verify that pay() calculates amounts correctly. (Covers expression compiler.)