web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract_address = SafeAdd_.address;
var contract = SafeAdd_;

log_big("SafeAdd Test");

// Set data feed 0 to true to ensure specific, non-delayed execution
succ(do_set(DataFeed0_, 1), "Set DF0 to true");

// Approve, activate, and verify PT balances
do_approve(250, 3000000, contract_address);
do_activate(contract, 50);
assertEquals(contract.balanceOf(me, 0).toNumber(), 50, "PT0 balance is 50 after activation");
assertEquals(contract.balanceOf(me, 1).toNumber(), 50, "PT1 balance is 50 after activation");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19750, "Settlement asset should have balance 19,750 after activation");

// first it tries to overflow, gets rejected, no balance updates
do_set(DataFeed1_, Math.pow(2, 254));
fail(do_pay(contract, contract_address));
assertEquals(contract.balanceOf(me, 0).toNumber(), 50, "PT0 balance is still 50 after failed and overflowed pay()");
assertEquals(contract.balanceOf(me, 1).toNumber(), 50, "PT1 balance is still 50 after failed and overflowed pay()");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19750, "Settlement asset is still 19,750 after failed and overflowed pay()");

// then it tries some legal number, and succeeds, balances are updated
do_set(DataFeed1_, Math.pow(2, 253));
succ(do_pay(contract, contract_address));
assertEquals(contract.balanceOf(me, 0).toNumber(), 0, "PT0 balance is 50 after succeeded pay()");
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PT1 balance is 50 after succeeded pay()");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset is 20,000 after successful pay");
