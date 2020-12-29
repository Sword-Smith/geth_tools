web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
var other = web3.eth.accounts[1];

var contract = MultipleSettlementAssets_;
log_big("MultipleSettlementAssets_ test.");
do_approve_on(200, Erc20_EUR, contract.address);
do_approve_on(200, Erc20_DAI, contract.address);
succ(do_set(DataFeed1_, 10), "Set DF1 value"); // implies scale with 20
succ(do_set(DataFeed0_, 1), "Set DF0 value"); // implies 1st branch is taken, (transfer DAI + EUR)

fail(do_pay(contract, contract.address), "Disallow pay before activation");
fail(do_mint(contract, 1), "Disallow mint before activation");

var pt0 = 0;
var pt1 = 1;
var pt2 = 2;
var pt3 = 3;
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 should have balance 0 before activation");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 0, "DC Settlement asset DAI balance should be 0 before activation");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 0, "DC Settlement asset EUR balance should be 0 before activation");

succ(do_activate(contract, 5), "Allow activation with 5");

assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PartyToken 0 should have balance 5 after activation");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PartyToken 1 should have balance 5 after activation");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 should have balance 5 after activation");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 5, "PartyToken 3 should have balance 5 after activation");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19900, "Settlement asset DAI should have balance 19,900 after activation");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19900, "Settlement asset EUR should have balance 19,900 after activation");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 100, "DC Settlement asset DAI balance should be 100");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 100, "DC Settlement asset DAI balance should be 100");

fail(do_mint(contract, 6), "Disallow minting that exceeds allowance");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PartyToken 0 balance should still be 5");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PartyToken 1 balance should still be 5");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 balance should still be 5");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 5, "PartyToken 3 balance should still be 5");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19900, "Settlement asset DAI should have balance 19,900 after activation");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19900, "Settlement asset EUR should have balance 19,900 after activation");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 100, "DC Settlement asset balance DAI should still be 100");

fail(do_mint(contract, 0), "Disallow minting of 0 although approval limit not yet reached");

succ(do_mint(contract, 2), "Allow mint of 2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 7, "PartyToken 0 balance should now be 7");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 7, "PartyToken 1 balance should now be 7");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 7, "PartyToken 2 balance should now be 7");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 7, "PartyToken 3 balance should now be 7");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19860, "Settlement asset DAI should have balance 19,860 after activation");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19860, "Settlement asset EUR should have balance 19,860 after activation");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 140, "DC Settlement asset DAI balance be 140");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 140, "DC Settlement asset EUR balance be 140");

succ(do_mint(contract, 3), "Allow mint of 3");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance should now be 10");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance should now be 10");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 balance should now be 10");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 10, "PartyToken 3 balance should now be 10");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19800, "Settlement asset DAI should have balance 19,860 after activation");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19800, "Settlement asset EUR should have balance 19,860 after activation");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 200, "DC Settlement asset DAI balance should be 200");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 200, "DC Settlement asset EUR balance should be 200");

fail(do_mint(contract, 1), "Disallow minting that would exceeed approval");
fail(do_mint(contract, 0), "Disallow minting of 0");

// Test burning with equal PT balances (balance(PT1) == balance(PT2)

fail(do_burn(contract, 0), "Disallow burning 0 PT even when some are available");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance unaffected by failed zero-burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance unaffected by failed zero-burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 balance unaffected by failed zero-burn");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 10, "PartyToken 3 balance unaffected by failed zero-burn");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19800, "Settlement asset DAI unaffected by failed zero-burn");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19800, "Settlement asset EUR unaffected by failed zero-burn");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 200, "DC Settlement DAI unaffected by 1st failed zero-burn");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 200, "DC Settlement EUR unaffected by 1st failed zero-burn");

fail(do_burn(contract, 11), "Disallow burning more PT than available");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance unaffected by failed burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance unaffected by failed burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 balance unaffected by failed burn");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 10, "PartyToken 3 balance unaffected by failed burn");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19800, "Settlement asset DAI unaffected by failed burn");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19800, "Settlement asset EUR unaffected by failed burn");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 200, "DC Settlement DAI unaffected by failed burn");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 200, "DC Settlement EUR unaffected by failed burn");

succ(do_burn(contract, 5), "Burn some party tokens");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PartyToken 0 balance is lower after 1st burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PartyToken 1 balance is lower after 1st burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 balance is lower after 1st burn");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 5, "PartyToken 3 balance is lower after 1st burn");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19900, "Settlement asset DAI is higher after 1st burn");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19900, "Settlement asset EUR is higher after 1st burn");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 100, "DC Settlement DAI is lower after 1st burn");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 100, "DC Settlement EUR is lower after 1st burn");

fail(do_burn(contract, 6), "Disallow burning more PT than available");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PartyToken 0 balance unaffected by failed 2nd burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PartyToken 1 balance unaffected by failed 2nd burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 balance unaffected by failed 2nd burn");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 5, "PartyToken 3 balance unaffected by failed 2nd burn");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19900, "Settlement asset (DAI) unaffected by failed 2nd burn");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19900, "Settlement asset (EUR) unaffected by failed 2nd burn");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 100, "DC Settlement DAI is unaffected after failed 2nd burn");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 100, "DC Settlement EUR is unaffected after failed 2nd burn");

succ(do_burn(contract, 5), "Burn the last party tokens");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is lower after 2nd (full) burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is lower after 2nd (full) burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is lower after 2nd (full) burn");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is lower after 2nd (full) burn");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 20000, "Settlement asset (DAI) is higher after 2nd (full) burn");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 20000, "Settlement asset (EUR) is higher after 2nd (full) burn");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 0, "DC Settlement DAI is zero after successful 2nd burn");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 0, "DC Settlement EUR is zero after successful 2nd burn");

fail(do_burn(contract, 0), "Disallow burning 0 PT even when there are 0 PTs");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance unaffected by failed zero-burn");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance unaffected by failed zero-burn");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance unaffected by failed zero-burn");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance unaffected by failed zero-burn");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 20000, "Settlement asset (DAI) unaffected by failed zero-burn");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 20000, "Settlement asset (EUR) unaffected by failed zero-burn");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 0, "DC Settlement unaffected by 2nd failed zero-burn");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 0, "DC Settlement unaffected by 2nd failed zero-burn");

// Fail additional mint since approval is insufficient
fail(do_mint(contract, 1), "Disallow mint if approval is insufficient (actually partly an ERC20 test)");

// Test burning with unequal PT balances (balance(PT1) != balance(PT2), where balance(PT1) < balance(PT2) = balance(PT0)
do_approve_on(200, Erc20_DAI, contract.address);
fail(do_mint(contract, 1), "Disallow minting when only 1 of 2 SAs (DAI) are approved");
do_approve_on(0, Erc20_DAI, contract.address);
do_approve_on(200, Erc20_EUR, contract.address);
fail(do_mint(contract, 1), "Disallow minting when only 1 of 2 SAs (EUR) are approved");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance unaffected by failed activation");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance unaffected by failed activation");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance unaffected by failed activation");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance unaffected by failed activation");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 20000, "Settlement asset (DAI) unaffected by failed activation");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 20000, "Settlement asset (EUR) unaffected by failed activation");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 0, "DC Settlement unaffected by 2nd failed activation");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 0, "DC Settlement unaffected by 2nd failed activation");

// Approve on other SA (EUR) and verify that minting is now possible
do_approve_on(200, Erc20_DAI, contract.address);
succ(do_mint(contract, 10), "Allow the minting of 10 additional PT pairs for balance(PT1) < balance(PT2) tests");
succ(do_transfer(contract, me, other, pt1, 5), "Allow me to transfer away 5 PT1s");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 is 10 after mint of 10");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 5, "PartyToken 1 balance 5 after mint of 10 and transferred away 5");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 is 10 after mint of 10");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 10, "PartyToken 3 is 10 after mint of 10");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 200, "DC Settlement (DAI) higher after successful mint");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 200, "DC Settlement (EUR) higher after successful mint");

succ(do_burn(contract, 3), "Burn 3 PT token pairs when balance is 10/5/10/10");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 7, "PartyToken 0 balance is 7 after 3 was burned");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 2, "PartyToken 1 balance is 2 after 5 transferred and 3 was burned");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 7, "PartyToken 2 balance is 7 after 3 was burned");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 7, "PartyToken 3 balance is 7 after 3 was burned");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 140, "DC Settlement (DAI) lower after successful burn");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 140, "DC Settlement (EUR) lower after successful burn");

fail(do_burn(contract, 3), "Fail the burn of 3 PT token pairs when balance is 7/2/7/7");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 7, "PartyToken 0 balance is 7 after failed burn for partial balance insufficiency");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 2, "PartyToken 1 balance is 2 after failed burn for partial balance insufficiency");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 7, "PartyToken 2 balance is 7 after failed burn for partial balance insufficiency");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 7, "PartyToken 3 balance is 7 after failed burn for partial balance insufficiency");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 140, "DC Settlement (DAI) unchanged after failed burn");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 140, "DC Settlement (EUR) unchanged after failed burn");

succ(do_burn(contract, 2), "Succeed burn when balance is 7/2/7/7");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PT0 balance is 5 after succeeded burn when balance is 7/2/7/7");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PT1 balance is 0 after succeeded burn when balance is 7/2/7/7");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PT2 balance is 5 after succeeded burn when balance is 7/2/7/7");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 5, "PT3 balance is 5 after succeeded burn when balance is 7/2/7/7");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 100, "DC Settlement (DAI) lower after successful burn again");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 100, "DC Settlement (EUR) lower after successful burn again");

fail(do_burn(contract, 1), "Cannot burn anything when PT1 balance is 0");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PT0 balance unaffected by failed burn 3.");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PT1 balance unaffected by failed burn 3.");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PT2 balance unaffected by failed burn 3.");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 5, "PT3 balance unaffected by failed burn 3.");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 100, "DC Settlement (DAI) unchanged after failed burn again");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 100, "DC Settlement (EUR) unchanged after failed burn again");

fail(do_burn(contract, 0), "Cannot burn 0 when PT1 balance is 0");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 5, "PT0 balance unaffected by failed zero burn 4.");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PT1 balance unaffected by failed zero burn 4.");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PT2 balance unaffected by failed zero burn 4.");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 5, "PT3 balance unaffected by failed zero burn 4.");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 100, "DC Settlement (DAI) unchanged after failed zero burn again");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 100, "DC Settlement (EUR) unchanged after failed zero burn again");

// Test burning with unequal PT balances (balance(PT1) != balance(PT2), where balance(PT0) = balance(PT1) > balance(PT2)
// First get rid of all PTs
succ(do_transfer(contract, me, other, pt0, 5), "Allow me to get rid of last PT0s");
succ(do_transfer(contract, me, other, pt2, 5), "Allow me to get rid of last PT2s");
succ(do_transfer(contract, me, other, pt3, 5), "Allow me to get rid of last PT3s");

do_approve_on(200, Erc20_DAI, contract.address);
do_approve_on(200, Erc20_EUR, contract.address);
succ(do_mint(contract, 10), "Allow the minting of 10 additional PT pairs for balance(PT1) > balance(PT2) tests");
succ(do_transfer(contract, me, other, pt2, 5), "Allow me to transfer away 5 PT2s, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance is 10 after mint of 10, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance is 10 after mint of 10, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 balance is 5 after mint of 10 and 5 transferred away");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 10, "PartyToken 3 balance is 10 after mint of 10, b_PT1 > b_PT2");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 300, "DC Settlement (DAI) higher after successful mint, b_PT1 > b_PT2");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 300, "DC Settlement (EUR) higher after successful mint, b_PT1 > b_PT2");

// Verify that pay works correctly
succ(do_transfer(contract, me, other, pt2, 4), "Allow me to transfer away 4 PT2s");

assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance is 10 before successful pay()");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance is 10 before successful pay()");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 1, "PartyToken 2 balance is 1 before successful pay()");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 10, "PartyToken 3 balance is 10 before successful pay()");

// do_pay(contract);
succ(do_pay_implicit(contract, me), "Can execute pay");

assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay()");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay()");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay()");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay()");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19720, "My SA (DAI) balance unchanged after successful pay()");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19900, "My SA (EUR) balance 200 higher after successful pay()");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 280, "DC Settlement (DAI) 280 after successful pay()");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 100, "DC Settlement (EUR) 100 after successful pay()");

// mint, check balance, pay, check balance
do_approve_on(200, Erc20_DAI, contract.address);
do_approve_on(200, Erc20_EUR, contract.address);
succ(do_mint(contract, 10), "Allow the minting of 10 additional PT pairs for balance(PT1) > balance(PT2) tests, yay.");

assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance is 10 after successful mint()");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance is 10 after successful mint()");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 balance is 10 after successful mint()");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 10, "PartyToken 3 balance is 10 after successful mint()");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19520, "My SA (DAI) balance 200 lower after successful mint()");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19700, "My SA (EUR) balance 200 lower after successful mint()");

succ(do_pay(contract));

assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay() again");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay() again");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay() again");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay() again");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19720, "My SA (DAI) balance 200 higher after successful pay() again");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19900, "My SA (EUR) balance 200 higher after successful pay() again");
