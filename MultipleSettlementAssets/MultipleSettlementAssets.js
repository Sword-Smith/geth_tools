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
succ(do_mint(contract, 10), "Allow the minting of 10 additional PTs for balance(PT1) < balance(PT2) tests");
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
succ(do_mint(contract, 10), "Allow the minting of 10 additional PTs for balance(PT1) > balance(PT2) tests");
succ(do_transfer(contract, me, other, pt2, 5), "Allow me to transfer away 5 PT2s, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance is 10 after mint of 10, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance is 10 after mint of 10, b_PT1 > b_PT2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 5, "PartyToken 2 balance is 5 after mint of 10 and 5 transferred away");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 10, "PartyToken 3 balance is 10 after mint of 10, b_PT1 > b_PT2");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 300, "DC Settlement (DAI) higher after successful mint, b_PT1 > b_PT2");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 300, "DC Settlement (EUR) higher after successful mint, b_PT1 > b_PT2");

// Holds some of each token -- get payout of correct amount
// In this contract PT1 and PT2 are in the money. PT1 gets 20 EUR per token, PT2 gets 20 DAI per token
succ(do_transfer(contract, me, other, pt2, 4), "Allow me to transfer away 4 PT2s, #1");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance is 10 before successful pay(), #1");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance is 10 before successful pay(), #1");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 1, "PartyToken 2 balance is 1 before successful pay(), #1");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 10, "PartyToken 3 balance is 10 before successful pay(), #1");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19700, "My SA (DAI) balance before successful pay(), #1");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19700, "My SA (EUR) balance before successful pay(), #1")

succ(do_pay_implicit(contract, me), "Can execute pay, #1");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay(), #1");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay(), #1");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay(), #1");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay(), #1");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19720, "My SA (DAI) balance unchanged after successful pay(), #1");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19900, "My SA (EUR) balance 200 higher after successful pay(), #1");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 280, "DC Settlement (DAI) 280 after successful pay(), #1");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 100, "DC Settlement (EUR) 100 after successful pay(), #1");

// Holds 10 of each token -- get payout of correct amount
// mint, check balance, pay, check balance
do_approve_on(200, Erc20_DAI, contract.address);
do_approve_on(200, Erc20_EUR, contract.address);
succ(do_mint(contract, 10), "Allow the minting of 10 additional PTs for balance(PT1) > balance(PT2) tests, yay., #2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 10, "PartyToken 0 balance is 10 after successful mint(), #2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 10, "PartyToken 1 balance is 10 after successful mint(), #2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 10, "PartyToken 2 balance is 10 after successful mint(), #2");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 10, "PartyToken 3 balance is 10 after successful mint(), #2");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19520, "My SA (DAI) balance 200 lower after successful mint(), #2");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19700, "My SA (EUR) balance 200 lower after successful mint(), #2");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 480, "DC Settlement (DAI) 280 after successful pay(), #2");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 300, "DC Settlement (EUR) 100 after successful pay(), #2");

succ(do_pay(contract), "Can execute pay, 2nd time, #2");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay() again, #2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay() again, #2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay() again, #2");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay() again, #2");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19720, "My SA (DAI) balance 200 higher after successful pay() again, #2");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19900, "My SA (EUR) balance 200 higher after successful pay() again, #2");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 280, "DC Settlement (DAI) 280 after successful pay(), #2");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 100, "DC Settlement (EUR) 100 after successful pay(), #2");

// Only holds PT1 -- get payout of correct amount
// mint, transfer, check balance, pay, check balance
// In this contract PT1 and PT2 are in the money. PT1 gets 20 EUR, PT2 gets DAI
do_approve_on(200, Erc20_DAI, contract.address);
do_approve_on(200, Erc20_EUR, contract.address);
succ(do_mint(contract, 10), "Allow the minting of 10 additional PTs, #3");
succ(do_transfer(contract, me, other, pt0, 10), "Allow me to transfer away 10 PT0s, #3");
succ(do_transfer(contract, me, other, pt1, 3), "Allow me to transfer away 3 PT1s, #3");
succ(do_transfer(contract, me, other, pt2, 10), "Allow me to transfer away 10 PT2s, #3");
succ(do_transfer(contract, me, other, pt3, 10), "Allow me to transfer away 10 PT3s, #3");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful mint() and transfer, #3");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 7, "PartyToken 1 balance is 7 after successful mint() and transfer, #3");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful mint() and transfer, #3");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful mint() and transfer, #3");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19520, "My SA (DAI) balance 200 lower after successful mint(), #3");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19700, "My SA (EUR) balance 200 lower after successful mint(), #3");

succ(do_pay(contract), "Can execute pay, #3");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay(), #3");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay(), #3");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay(), #3");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay(), #3");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19520, "My SA (DAI) balance is unchanged after successful pay(), #3");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19840, "My SA (EUR) balance 140 higher after successful pay(), #3");

// Only holds PT3 -- get no payout
// mint, transfer, check balance, pay, check balance,
// In this contract PT1 and PT2 are in the money. PT1 gets 20 EUR, PT2 gets DAI
do_approve_on(200, Erc20_DAI, contract.address);
do_approve_on(200, Erc20_EUR, contract.address);
succ(do_mint(contract, 10), "Allow the minting of 10 additional PTs, #4");
succ(do_transfer(contract, me, other, pt0, 10), "Allow me to transfer away 10 PT0s, #4");
succ(do_transfer(contract, me, other, pt1, 10), "Allow me to transfer away 10 PT1s, #4");
succ(do_transfer(contract, me, other, pt2, 10), "Allow me to transfer away 10 PT2s, #4");
succ(do_transfer(contract, me, other, pt3, 1), "Allow me to transfer away 1 PT3s, #4");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful mint() and transfer, #4");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 7 after successful mint() and transfer, #4");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful mint() and transfer, #4");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 9, "PartyToken 3 balance is 0 after successful mint() and transfer, #4");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19320, "My SA (DAI) balance 200 lower after successful mint(), #4");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19640, "My SA (EUR) balance 200 lower after successful mint(), #4");

succ(do_pay(contract), "Can execute pay, #4");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay(), #4");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay(), #4");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay(), #4");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay(), #4");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19320, "My SA (DAI) balance is unchanged after successful pay(), #4");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19640, "My SA (EUR) balance is unchanged after successful pay(), #4");

// Only holds PT0 -- get no payout
// mint, transfer, check balance, pay, check balance,
// In this contract PT1 and PT2 are in the money. PT1 gets 20 EUR, PT2 gets DAI
do_approve_on(200, Erc20_DAI, contract.address);
do_approve_on(200, Erc20_EUR, contract.address);
succ(do_mint(contract, 10), "Allow the minting of 10 additional PTs, #5");
succ(do_transfer(contract, me, other, pt0, 2), "Allow me to transfer away 2 PT0s, #5");
succ(do_transfer(contract, me, other, pt1, 10), "Allow me to transfer away 10 PT1s, #5");
succ(do_transfer(contract, me, other, pt2, 10), "Allow me to transfer away 10 PT2s, #5");
succ(do_transfer(contract, me, other, pt3, 10), "Allow me to transfer away 10 PT3s, #5");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 8, "PartyToken 0 balance is 8 after successful mint() and transfer, #5");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful mint() and transfer, #5");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful mint() and transfer, #5");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful mint() and transfer, #5");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19120, "My SA (DAI) balance 200 lower after successful mint(), #5");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19440, "My SA (EUR) balance 200 lower after successful mint(), #5");

succ(do_pay(contract), "Can execute pay, #5");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay(), #5");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay(), #5");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay(), #5");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay(), #5");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19120, "My SA (DAI) balance is unchanged after successful pay(), #5");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19440, "My SA (EUR) balance is unchanged after successful pay(), #5");

// Only holds PT2 -- get payout
// mint, transfer, check balance, pay, check balance,
// In this contract PT1 and PT2 are in the money. PT1 gets 20 EUR, PT2 gets DAI
do_approve_on(300, Erc20_DAI, contract.address);
do_approve_on(300, Erc20_EUR, contract.address);
succ(do_mint(contract, 15), "Allow the minting of 15 additional PTs, #6");
succ(do_transfer(contract, me, other, pt0, 15), "Allow me to transfer away 15 PT0s, #6");
succ(do_transfer(contract, me, other, pt1, 15), "Allow me to transfer away 15 PT1s, #6");
succ(do_transfer(contract, me, other, pt2, 1), "Allow me to transfer away 1 PT2s, #6");
succ(do_transfer(contract, me, other, pt3, 15), "Allow me to transfer away 15 PT3s, #6");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful mint() and transfer, #6");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful mint() and transfer, #6");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 14, "PartyToken 2 balance is 14 after successful mint() and transfer, #6");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful mint() and transfer, #6");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18820, "My SA (DAI) balance 300 lower after successful mint(), #6");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19140, "My SA (EUR) balance 300 lower after successful mint(), #6");

succ(do_pay(contract), "Can execute pay, #6");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay(), #6");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay(), #6");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay(), #6");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay(), #6");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19100, "My SA (DAI) balance is increased by 280 after successful pay(), #6");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19140, "My SA (EUR) balance is unchanged after successful pay(), #6");

// Hold PT1 and PT3 -- get payout for PT1
// mint, transfer, check balance, pay, check balance,
// In this contract PT1 and PT2 are in the money. PT1 gets 20 EUR, PT2 gets DAI
do_approve_on(300, Erc20_DAI, contract.address);
do_approve_on(300, Erc20_EUR, contract.address);
succ(do_mint(contract, 15), "Allow the minting of 15 additional PTs, #7");
succ(do_transfer(contract, me, other, pt0, 15), "Allow me to transfer away 15 PT0s, #7");
succ(do_transfer(contract, me, other, pt1, 3), "Allow me to transfer away 15 PT1s, #7");
succ(do_transfer(contract, me, other, pt2, 15), "Allow me to transfer away 15 PT2s, #7");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful mint() and transfer, #7");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 12, "PartyToken 1 balance is 12 after successful mint() and transfer, #7");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful mint() and transfer, #7");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 15, "PartyToken 3 balance is 0 after successful mint() and transfer, #7");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18800, "My SA (DAI) balance 300 lower after successful mint(), #7");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 18840, "My SA (EUR) balance 300 lower after successful mint(), #7");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 1200, "DC Settlement (DAI) before pay, #7");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 1160, "DC Settlement (EUR) before pay, #7");

succ(do_pay(contract), "Can execute pay, #7");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay(), #7");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay(), #7");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay(), #7");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay(), #7");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18800, "My SA (DAI) balance unchanged successful pay(), #7");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 19080, "My SA (EUR) balance is 240 higher after successful pay(), #7");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 1200, "DC Settlement (DAI) after pay, #7");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 920, "DC Settlement (EUR) after pay, #7");

// Hold PT0 and PT2 -- get payout for PT2
// mint, transfer, check balance, pay, check balance,
// In this contract PT1 and PT2 are in the money. PT1 gets 20 EUR, PT2 gets DAI
do_approve_on(400, Erc20_DAI, contract.address);
do_approve_on(400, Erc20_EUR, contract.address);
succ(do_mint(contract, 20), "Allow the minting of 20 additional PTs, #8");
succ(do_transfer(contract, me, other, pt0, 1), "Allow me to transfer away 1 PT0s, #8");
succ(do_transfer(contract, me, other, pt1, 20), "Allow me to transfer away 20 PT1s, #8");
succ(do_transfer(contract, me, other, pt2, 2), "Allow me to transfer away 2 PT2s, #8");
succ(do_transfer(contract, me, other, pt3, 20), "Allow me to transfer away 20 PT3s, #8");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 19, "PartyToken 0 balance is 19 after successful mint() and transfer, #8");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful mint() and transfer, #8");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 18, "PartyToken 2 balance is 18 after successful mint() and transfer, #8");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful mint() and transfer, #8");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18400, "My SA (DAI) balance 400 lower after successful mint(), #8");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 18680, "My SA (EUR) balance 400 lower after successful mint(), #8");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 1600, "DC Settlement (DAI) before pay, #8");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 1320, "DC Settlement (EUR) before pay, #8");

succ(do_pay(contract), "Can execute pay, #8");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay(), #8");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay(), #8");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay(), #8");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay(), #8");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18760, "My SA (DAI) balance is 360 higher after successful pay(), #8");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 18680, "My SA (EUR) balance is unchanged after successful pay(), #8");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 1240, "DC Settlement (DAI) after pay, #8");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 1320, "DC Settlement (EUR) after pay, #8");

// Hold PT1 and PT2 -- get payout for PT1 and PT2
// mint, transfer, check balance, pay, check balance,
// In this contract PT1 and PT2 are in the money. PT1 gets 20 EUR, PT2 gets DAI
do_approve_on(420, Erc20_DAI, contract.address);
do_approve_on(420, Erc20_EUR, contract.address);
succ(do_mint(contract, 21), "Allow the minting of 21 additional PTs, #9");
succ(do_transfer(contract, me, other, pt0, 21), "Allow me to transfer away 21 PT0s, #9");
succ(do_transfer(contract, me, other, pt1, 1), "Allow me to transfer away 1 PT1s, #9");
succ(do_transfer(contract, me, other, pt2, 2), "Allow me to transfer away 2 PT2s, #9");
succ(do_transfer(contract, me, other, pt3, 21), "Allow me to transfer away 21 PT3s, #9");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful mint() and transfer, #9");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 20, "PartyToken 1 balance is 20 after successful mint() and transfer, #9");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 19, "PartyToken 2 balance is 19 after successful mint() and transfer, #9");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful mint() and transfer, #9");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18340, "My SA (DAI) balance 420 lower after successful mint(), #9");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 18260, "My SA (EUR) balance 420 lower after successful mint(), #9");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 1660, "DC Settlement (DAI) before pay, #9");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 1740, "DC Settlement (EUR) before pay, #9");

succ(do_pay(contract), "Can execute pay, #9");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after successful pay(), #9");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after successful pay(), #9");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after successful pay(), #9");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after successful pay(), #9");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18720, "My SA (DAI) balance is 380 higher after successful pay(), #9");
assertEquals(Erc20_EUR.balanceOf(me).toNumber(), 18660, "My SA (EUR) balance is unchanged after successful pay(), #9");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 1280, "DC Settlement (DAI) after pay, #9");
assertEquals(Erc20_EUR.balanceOf(contract.address).toNumber(), 1340, "DC Settlement (EUR) after pay, #9");
