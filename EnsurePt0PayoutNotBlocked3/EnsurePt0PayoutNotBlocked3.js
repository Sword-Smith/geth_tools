/* This test verifies that PT0's payouts are not locked when contract is mature, but the other PTs have
   not yet called pay() and where the PT0 payout is dependant on the evaluation of **both** a transfer call
   in a dead branch **and** a transfer call with payout == 0 but in a live branch   */
web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
var other = web3.eth.accounts[1];
var third = web3.eth.accounts[2];

var contract = EnsurePt0PayoutNotBlocked3_;
log_big("EnsurePt0PayoutNotBlocked3_ test.");
do_approve_on(2000, Erc20_DAI, contract.address);
do_set(DataFeed0_, 1); // ensure 1st branch in taken. This puts PT1 in the money. PT1 gets 11 DAI per token.
do_set(DataFeed1_, 11); // maxFactor == 21, so expr < maxFactor
do_set(DataFeed2_, 0); // This ensures that the payout to PT2 has value zero but the branch is not dead

var pt0 = 0;
var pt1 = 1;
var pt2 = 2;
var pt3 = 3;
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 should have balance 0 before activation");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 0, "DC Settlement asset balance be 0 before activation");

succ(do_activate(contract, 47), "Allow activation with 47");

assertEquals(contract.balanceOf(me, pt0).toNumber(), 47, "PartyToken 0 should have balance 47 after activation");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 47, "PartyToken 1 should have balance 47 after activation");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 47, "PartyToken 2 should have balance 47 after activation");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 47, "PartyToken 3 should have balance 47 after activation");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18026, "Settlement asset should have balance 19013 after activation");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 1974, "DC Settlement asset balance be 987");

// transfer 47 PT0s to `other`, 47 PT2s (from zero-value branch) to `third`, and 47 PT3s (from dead branch) to `third`
succ(do_transfer(contract, me, other, pt0, 47), "Allow me to transfer away 47 PT0s");
succ(do_transfer(contract, me, third, pt2, 47), "Allow me to transfer away 47 PT2s, to third address");
succ(do_transfer(contract, me, third, pt3, 47), "Allow me to transfer away 47 PT3s, to third address");

// Evaluate PT0 position, from `other` account.
assertEquals(contract.balanceOf(other, pt0).toNumber(), 47, "Other's partyToken 0 balance is 0 before pay(), #1");
assertEquals(contract.balanceOf(other, pt1).toNumber(), 0, "Other's partyToken 1 balance is 0 before pay(), #1");
assertEquals(contract.balanceOf(other, pt2).toNumber(), 0, "Other's partyToken 2 balance is 0 before pay(), #1");
assertEquals(contract.balanceOf(other, pt3).toNumber(), 0, "Other's partyToken 3 balance is 0 before pay(), #1");
assertEquals(Erc20_DAI.balanceOf(other).toNumber(), 0, "Other's SA (DAI) balance before pay(), #1");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "My partyToken 0 balance is 0 before pay(), #1");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 47, "My partyToken 1 balance is 47 before pay(), #1");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "My partyToken 2 balance is 0 before pay(), #1");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "My partyToken 3 balance is 0 before pay(), #1");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18026, "My SA (DAI) balance before pay(), #1");

succ(do_pay_implicit(contract, other), "other calls pay");
assertEquals(contract.balanceOf(other, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after pay(), #1");
assertEquals(contract.balanceOf(other, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after pay(), #1");
assertEquals(contract.balanceOf(other, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after pay(), #1");
assertEquals(contract.balanceOf(other, pt3).toNumber(), 0, "Other's partyToken 3 balance is 0 before pay(), #1");
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "My partyToken 0 balance is unaffected by other's call to pay(), #1");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 47, "My partyToken 1 balance is unaffected by other's call to pay(), #1");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "My partyToken 2 balance is unaffected by other's call to pay(), #1");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "My partyToken 3 balance is unaffected by other's call to pay(), #1");
assertEquals(Erc20_DAI.balanceOf(other).toNumber(), 1457, "Other's SA (DAI) balance is 470 higher after pay(), #1");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 517, "DC Settlement (DAI) after pay, #1");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18026, "My SA (DAI) balance after other's pay(), #1");

// Evaluate `me` position, owning PT1 asset
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0, #2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 47, "PartyToken 1 balance is 47, #2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0, #2");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0, #2");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18026, "My SA (DAI) balance before pay, #2");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 517, "DC Settlement (EUR) before pay, #2");

// We sleep in an attempt to reduce flakyness for this test
sleep(100);
succ(do_pay(contract), "Can execute pay by me, #2");
sleep(100);
assertEquals(contract.balanceOf(me, pt0).toNumber(), 0, "PartyToken 0 balance is 0 after pay(), #2");
assertEquals(contract.balanceOf(me, pt1).toNumber(), 0, "PartyToken 1 balance is 0 after pay(), #2");
assertEquals(contract.balanceOf(me, pt2).toNumber(), 0, "PartyToken 2 balance is 0 after pay(), #2");
assertEquals(contract.balanceOf(me, pt3).toNumber(), 0, "PartyToken 3 balance is 0 after pay(), #2");
assertEquals(Erc20_DAI.balanceOf(other).toNumber(), 1457, "Other's SA (DAI) balance is unaffected by my call to pay(), #2");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 18543, "My SA (DAI) balance is 517 higher after pay(), #2");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 0, "DC Settlement (DAI) after pay, #2");
