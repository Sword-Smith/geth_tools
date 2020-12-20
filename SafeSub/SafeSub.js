web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract_address = SafeSub_.address;
var contract = SafeSub_;

log_big("SafeSub Test");

// Approve, activate, and verify PT balances
do_approve(1000, 3000000, contract_address);
do_activate(contract, 50);
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19000, "Settlement asset should have balance 19,000 after activation");
assertEquals(contract.balanceOf(me, 0).toNumber(), 50, "PT0 balance is 50 after activation");
assertEquals(contract.balanceOf(me, 1).toNumber(), 50, "PT1 balance is 50 after activation");

// first it tries to overflow, gets rejected
// do_set(DataFeed1_, "-57896044618658097711785492504343953926634992332820282019728792003956564819968");
do_set(DataFeed0_, 1); // boolean true value
do_set(DataFeed1_, -Math.pow(2, 255));
// do_pay(contract, contract_address);
fail(do_pay(contract, contract_address), "Should fail on numeric overflow");
assertEquals(contract.balanceOf(me, 0).toNumber(), 50, "PT0 balance is still 50 after failed and overflowed pay()");
assertEquals(contract.balanceOf(me, 1).toNumber(), 50, "PT1 balance is still 50 after failed and overflowed pay()");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19000, "Settlement asset is still 19,000 after failed and overflowed pay()");

// then it tries some legal number, and succeeds
do_set(DataFeed1_, -21);
succ(do_pay(contract, contract_address), "Succeed pay after data fee value is updated");
assertEquals(contract.balanceOf(me, 0).toNumber(), 0, "PT0 balance is 0 after succeeded pay()");
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PT1 balance is 0 after succeeded pay()");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset is 20,000 after successful pay");
