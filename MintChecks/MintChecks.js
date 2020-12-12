web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract = MintChecks_;
log_big("MintChecks_ test.");
do_approve(200, 3000000, contract.address);
do_set(DataFeed1_, 10);
do_set(DataFeed0_, 0);

fail(do_pay(contract, contract.address), "Disallow pay before activation");
fail(do_mint(contract, 1), "Disallow mint before activation");

var a0 = contract.balanceOf(me, 0);
var a1 = contract.balanceOf(me, 1);
var saBalanceBefore = Erc20_CHF.balanceOf(me);
assertEquals(a0.toNumber(), 0, "PartyToken 0 should have balance 0 before activation");
assertEquals(a1.toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(saBalanceBefore.toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 0, "DC Settlement asset balance be 0 before activation");

succ(do_activate(contract, 5), "Allow activation with 5");

assertEquals(contract.balanceOf(me, 0).toNumber(), 5, "PartyToken 0 balance should have balance 5 after activation");
assertEquals(contract.balanceOf(me, 1).toNumber(), 5, "PartyToken 1 balance should have balance 5 after activation");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19900, "Settlement asset should have balance 19,900 after activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 100, "DC Settlement asset balance be 100");

fail(do_mint(contract, 6), "Disallow minting that exceeds allowance");
assertEquals(contract.balanceOf(me, 0).toNumber(), 5, "PartyToken 0 balance should still be 5");
assertEquals(contract.balanceOf(me, 1).toNumber(), 5, "PartyToken 1 balance should still be 5");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19900, "Settlement asset should have balance 19,900 after activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 100, "DC Settlement asset balance still be 100");

fail(do_mint(contract, 0), "Disallow minting of 0 although approval limit not yet reached");

succ(do_mint(contract, 2), "Allow mint of 2");
assertEquals(contract.balanceOf(me, 0).toNumber(), 7, "PartyToken 0 balance should still be 7");
assertEquals(contract.balanceOf(me, 1).toNumber(), 7, "PartyToken 1 balance should be 7");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19860, "Settlement asset should have balance 19,860 after activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 140, "DC Settlement asset balance be 140");

succ(do_mint(contract, 3), "Allow mint of 3");
assertEquals(contract.balanceOf(me, 0).toNumber(), 10, "PartyToken 0 balance should still be 7");
assertEquals(contract.balanceOf(me, 1).toNumber(), 10, "PartyToken 1 balance should be 7");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19800, "Settlement asset should have balance 19,860 after activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 200, "DC Settlement asset balance be 200");

fail(do_mint(contract, 1), "Disallow minting that would exceeed approval");
fail(do_mint(contract, 0), "Disallow minting of 0");
