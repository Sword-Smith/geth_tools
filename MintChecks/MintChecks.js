web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
var other = web3.eth.accounts[1];

var contract = MintChecks_;
log_big("MintChecks_ test.");
do_approve(200, 3000000, contract.address);
do_set(DataFeed1_, 10);
do_set(DataFeed0_, 0);

fail(do_pay(contract, contract.address), "Disallow pay before activation");
fail(do_mint(contract, 1), "Disallow mint before activation");

var pt0 = 0;
var pt1 = 1;
var pt2 = 2;
var saBalanceBefore = Erc20_CHF.balanceOf(me);
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 should have balance 0 before activation");
assertEquals(saBalanceBefore.toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 0, "DC Settlement asset balance be 0 before activation");

succ(do_activate(contract, 5), "Allow activation with 5");

assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PartyToken 0 should have balance 5 after activation");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PartyToken 1 should have balance 5 after activation");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 should have balance 5 after activation");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19900, "Settlement asset should have balance 19,900 after activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 100, "DC Settlement asset balance be 100");

fail(do_mint(contract, 6), "Disallow minting that exceeds allowance");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PartyToken 0 balance should still be 5");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PartyToken 1 balance should still be 5");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 balance should still be 5");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19900, "Settlement asset should have balance 19,900 after activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 100, "DC Settlement asset balance still be 100");

fail(do_mint(contract, 0), "Disallow minting of 0 although approval limit not yet reached");

succ(do_mint(contract, 2), "Allow mint of 2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 7, "PartyToken 0 balance should now be 7");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 7, "PartyToken 1 balance should now be 7");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 7, "PartyToken 2 balance should now be 7");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19860, "Settlement asset should have balance 19,860 after activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 140, "DC Settlement asset balance be 140");

succ(do_mint(contract, 3), "Allow mint of 3");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance should now be 10");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance should now be 10");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 balance should now be 10");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19800, "Settlement asset should have balance 19,860 after activation");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 200, "DC Settlement asset balance be 200");

fail(do_mint(contract, 1), "Disallow minting that would exceeed approval");
fail(do_mint(contract, 0), "Disallow minting of 0");

// Test burning with equal PT balances (balance(PT1) == balance(PT2)

fail(do_burn(contract, 0), "Disallow burning 0 PT even when some are available");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance unaffected by failed zero-burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance unaffected by failed zero-burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 balance unaffected by failed zero-burn");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19800, "Settlement asset unaffected by failed zero-burn");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 200, "DC Settlement unaffected by 1st failed zero-burn");

fail(do_burn(contract, 11), "Disallow burning more PT than available");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance unaffected by failed burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance unaffected by failed burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 balance unaffected by failed burn");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19800, "Settlement asset unaffected by failed burn");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 200, "DC Settlement unaffected by failed burn");

succ(do_burn(contract, 5), "Burn some party tokens");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PartyToken 0 balance is lower after 1st burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PartyToken 1 balance is lower after 1st burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 balance is lower after 1st burn");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19900, "Settlement asset is higher after 1st burn");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 100, "DC Settlement is lower after 1st burn");

fail(do_burn(contract, 6), "Disallow burning more PT than available");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PartyToken 0 balance unaffected by failed 2nd burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PartyToken 1 balance unaffected by failed 2nd burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 balance unaffected by failed 2nd burn");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19900, "Settlement asset unaffected by failed 2nd burn");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 100, "DC Settlement unaffected by failed 2nd burn");

succ(do_burn(contract, 5), "Burn the last party tokens");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is lower after 2nd (full) burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is lower after 2nd (full) burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is lower after 2nd (full) burn");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset is higher after 2nd (full) burn");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 0, "DC Settlement is lower after 2nd (full) burn");

fail(do_burn(contract, 0), "Disallow burning 0 PT even when there are 0 PTs");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance unaffected by failed zero-burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance unaffected by failed zero-burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance unaffected by failed zero-burn");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset unaffected by failed zero-burn");
assertEquals(Erc20_CHF.balanceOf(contract.address).toNumber(), 0, "DC Settlement unaffected by 2nd failed zero-burn");

// Fail additional mint since approval is insufficient
fail(do_mint(contract, 1), "Disallow mint if approval is insufficient (actually partly an ERC20 test)");

// Test burning with unequal PT balances (balance(PT1) != balance(PT2), where balance(PT1) < balance(PT2) = balance(PT0)
do_approve(200, 3000000, contract.address);
succ(do_mint(contract, 10), "Allow the minting of 10 additional PT pairs for balance(PT1) < balance(PT2) tests");
succ(do_transfer(contract, me, other, pt1, 5), "Allow me to transfer away 5 PT1s");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 is 10 after mint of 10");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PartyToken 1 balance 5 after mint of 10 and transferred away 5");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 is 10 after mint of 10");

succ(do_burn(contract, 3), "Burn 3 PT token pairs when balance is 5/10");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 7, "PartyToken 0 balance is 7 after 3 was burned");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 2, "PartyToken 1 balance is 2 after 5 transferred and 3 was burned");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 7, "PartyToken 2 balance is 7 after 3 was burned");

fail(do_burn(contract, 3), "Fail the burn of 3 PT token pairs when balance is 2/7");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 7, "PartyToken 0 balance is 7 after failed burn for partial balance insufficiency");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 2, "PartyToken 1 balance is 2 after failed burn for partial balance insufficiency");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 7, "PartyToken 2 balance is 7 after failed burn for partial balance insufficiency");

succ(do_burn(contract, 2), "Succeed burn when balance is 2/7");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PT0 balance is 5 after succeeded burn when balance is 2/7");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PT1 balance is 0 after succeeded burn when balance is 2/7");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PT2 balance is 5 after succeeded burn when balance is 2/7");

fail(do_burn(contract, 1), "Cannot burn anything when PT1 balance is 0");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PT0 balance unaffected by failed burn 3.");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PT1 balance unaffected by failed burn 3.");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PT2 balance unaffected by failed burn 3.");

fail(do_burn(contract, 0), "Cannot burn 0 when PT1 balance is 0");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PT0 balance unaffected by failed burn 4.");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PT1 balance unaffected by failed burn 4.");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PT2 balance unaffected by failed burn 4.");

// Test burning with unequal PT balances (balance(PT1) != balance(PT2), where balance(PT0) = balance(PT1) > balance(PT2)
// First get rid of all PTs
succ(do_transfer(contract, me, other, pt0, 5), "Allow me to get rid of last PT0s");
succ(do_transfer(contract, me, other, pt2, 5), "Allow me to get rid of last PT2s");

do_approve(200, 3000000, contract.address);
succ(do_mint(contract, 10), "Allow the minting of 10 additional PT pairs for balance(PT1) > balance(PT2) tests");
succ(do_transfer(contract, me, other, pt2, 5), "Allow me to transfer away 5 PT2s, b_PT1 > b_PT2");

assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 is balance 10 after mint of 10, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 is balance 10 after mint of 10, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 is 5 after mint of 10 and transfer of 5, b_PT1 > b_PT2");

succ(do_burn(contract, 3), "Burn 3 PT token pairs when balance is 10/5, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 7, "PartyToken 0 balance is 7 after 3 was burned, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 7, "PartyToken 1 balance is 7 after 3 was burned, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 2, "PartyToken 2 balance is 2 after 5 transferred and 3 was burned, b_PT1 > b_PT2");

fail(do_burn(contract, 3), "Fail the burn of 3 PT token pairs when balance is 7/2, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 7, "PartyToken 0 balance is 7 after failed burn for partial balance insufficiency, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 7, "PartyToken 1 balance is 7 after failed burn for partial balance insufficiency, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 2, "PartyToken 2 balance is 2 after failed burn for partial balance insufficiency, b_PT1 > b_PT2");

succ(do_burn(contract, 2), "Succeed burn when balance is 7/2, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PT0 balance is 5 after succeeded burn when balance is 7/2, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PT1 balance is 5 after succeeded burn when balance is 7/2, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PT2 balance is 0 after succeeded burn when balance is 7/2, b_PT1 > b_PT2");

fail(do_burn(contract, 1), "Cannot burn anything when PT2 balance is 0, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PT0 balance unaffected by failed burn 5., b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PT1 balance unaffected by failed burn 5., b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PT2 balance unaffected by failed burn 5., b_PT1 > b_PT2");

fail(do_burn(contract, 0), "Cannot burn 0 when PT1 balance is 0, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PT0 balance unaffected by failed burn 6., b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PT1 balance unaffected by failed burn 6., b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PT2 balance unaffected by failed burn 6., b_PT1 > b_PT2");

// Test burning with unequal PT balances (balance(PT0) != balance(PT1), where balance(PT0) < balance(PT1) = balance(PT2)
// First get rid of all PTs
succ(do_transfer(contract, me, other, pt0, 5), "Allow me to get rid of last PT0s");
succ(do_transfer(contract, me, other, pt1, 5), "Allow me to get rid of last PT1s");

do_approve(200, 3000000, contract.address);
succ(do_mint(contract, 10), "Allow the minting of 10 additional PT pairs for balance(PT0) < balance(PT1) = balance(PT2) tests");
succ(do_transfer(contract, me, other, pt0, 5), "Allow me to transfer away 5 PT0s, b_PT1 > b_PT0");

assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PartyToken 0 is 5 after mint of 10 and transfer of 5, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 is balance 10 after mint of 10, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 is balance 10 after mint of 10, b_PT1 > b_PT0");

succ(do_burn(contract, 3), "Burn 3 PT token pairs when balance is 10/5, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 2, "PartyToken 0 balance is 2 after 5 transferred and 3 was burned, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 7, "PartyToken 1 balance is 7 after 3 was burned, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 7, "PartyToken 2 balance is 7 after 3 was burned, b_PT1 > b_PT0");

fail(do_burn(contract, 3), "Fail the burn of 3 PT token pairs when balance is 7/2, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 2, "PartyToken 0 balance is 2 after failed burn for partial balance insufficiency, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 7, "PartyToken 1 balance is 7 after failed burn for partial balance insufficiency, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 7, "PartyToken 2 balance is 7 after failed burn for partial balance insufficiency, b_PT1 > b_PT0");

succ(do_burn(contract, 2), "Succeed burn when balance is 7/2, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PT0 balance is 0 after succeeded burn when balance is 7/2, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PT1 balance is 5 after succeeded burn when balance is 7/2, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PT2 balance is 5 after succeeded burn when balance is 7/2, b_PT1 > b_PT0");

fail(do_burn(contract, 1), "Cannot burn anything when PT0 balance is 0, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PT0 balance unaffected by failed burn 7., b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PT1 balance unaffected by failed burn 7., b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PT2 balance unaffected by failed burn 7., b_PT1 > b_PT0");

fail(do_burn(contract, 0), "Cannot burn 0 when PT0 balance is 0, b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PT0 balance unaffected by failed burn 8., b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PT1 balance unaffected by failed burn 8., b_PT1 > b_PT0");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PT2 balance unaffected by failed burn 8., b_PT1 > b_PT0");
