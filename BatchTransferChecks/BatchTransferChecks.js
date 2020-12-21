web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
other = web3.eth.accounts[1];

web3.eth.sendTransaction({to:other, from:me, value:web3.toWei("0.5", "ether")});

var contract = BatchTransferChecks_;
var contract_address = contract.address;
log_big("BatchTransferChecks_ test.");
do_approve(1000, 3000000, contract_address);

var partyToken1 = 1;
var partyToken2 = 2;
var partyToken3 = 3;

// before activation

assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 0, "PartyToken 2 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 0, "PartyToken 3 should have balance 0 before activation");

// activation

succ(do_activate(contract, 10), "Allow activation with 10");

assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 10, "PartyToken 1 should have balance 10 after activation");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 10, "PartyToken 2 should have balance 10 after activation");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 10, "PartyToken 3 should have balance 10 after activation");

// safeBatchTransferFrom that don't do anything

succ(do_batch_transfer(contract, me, other, [], []), "allows empty lists of _ids and _values");
succ(do_batch_transfer(contract, me, other, [partyToken1], [0]), "can batch transfer 0 of PartyToken 1");
succ(do_batch_transfer(contract, me, other, [partyToken1, partyToken2, partyToken3], [0, 0, 0]), "can batch transfer 0 of PT0, PT1 and PT2");
fail(do_batch_transfer(contract, me, other, [partyToken1], [666]), "cannot batch transfer when balance is insufficient");
fail(do_batch_transfer(contract, me, other, [partyToken1, partyToken2, partyToken3], [666, 0, 0]), "cannot batch transfer when balance is insufficient");
fail(do_batch_transfer(contract, me, other, [partyToken1, partyToken2, partyToken3], [0, 666, 0]), "cannot batch transfer when balance is insufficient");
fail(do_batch_transfer(contract, me, other, [partyToken1, partyToken2, partyToken3], [0, 0, 666]), "cannot batch transfer when balance is insufficient");

assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 10, "PartyToken 1 should have balance 10 after transferring 0 party tokens");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 10, "PartyToken 2 should have balance 10 after transferring 0 party tokens");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 10, "PartyToken 3 should have balance 10 after transferring 0 party tokens");

succ(do_batch_transfer(contract, me, other, [partyToken1], [1]), "can batch transfer 1 of PartyToken 1");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 9, "PartyToken 1 should have balance 9 after batch transfer of 1 of PartyToken 1");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 10, "PartyToken 2 should have balance 10 after batch transfer of 1 of PartyToken 1");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 10, "PartyToken 3 should have balance 10 after batch transfer of 1 of PartyToken 1");

succ(do_batch_transfer(contract, me, other, [partyToken1, partyToken2], [1, 3]), "can batch transfer 1 x PT0 and 3 x PT1");

assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 8, "PartyToken 1 should have balance 8 after transferring 1 of it");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 7, "PartyToken 2 should have balance 7 after transferring 3 of it");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 10, "PartyToken 3 should have balance 10 after transferring only PT0 and PT1");

fail(do_batch_transfer(contract, me, "0x0000000000000000000000000000000000000000", [partyToken2], [1]), "Fail when _to is 0 (ERC-1155 requirement).");
fail(do_batch_transfer(contract, me, other, [], [1]), "fail when len(_ids) != len(_values)");
fail(do_batch_transfer(contract, me, other, [partyToken1], []), "fail when len(_ids) != len(_values)");
fail(do_batch_transfer(contract, me, other, [2], [9, 8, 7]), "fail when len(_ids) != len(_values)");

// Ensure that all transfer fail when last is invalid
var amounts = [1, 3, 100];
fail(do_batch_transfer(contract, me, other, [partyToken3, partyToken2, partyToken1], amounts), "fail when last input value is illegal");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 10, "PartyToken 3 balance is unchanged after failed transfer");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 7, "PartyToken 2 balance is unchanged after failed transfer");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 8, "PartyToken 1 balance is unchanged after failed transfer");

// Fix last (invalid) amount and verify that batch transfer now succeeds
amounts[2] = 4;
succ(do_batch_transfer(contract, me, other, [partyToken3, partyToken2, partyToken1], amounts), "succeed when last amount value is now legal");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 9, "PartyToken 3 balance reduced by 1 after successful transfer");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 4, "PartyToken 2 balance reduced by 3 after successful transfer");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 4, "PartyToken 1 balance reduced by 4 after successful transfer");

// Verify that multiple calls for same token ID are allowed
succ(do_batch_transfer(contract, me, other, [partyToken3, partyToken3, partyToken1], [1, 3, 2]), "Allow multiple calls for same token ID");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 5, "PartyToken 3 balance reduced by 4 after call with repeated token ID");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 4, "PartyToken 2 balance reduced by 0 after call with repeated token ID");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 2, "PartyToken 1 balance reduced by 2 after call with repeated token ID");

/* Verify that approval for this endpoint works */
assertEquals(contract.balanceOf(other, partyToken1).toNumber(), 8, "Verify other's PartyToken 1 balance");
assertEquals(contract.balanceOf(other, partyToken2).toNumber(), 6, "Verify other's PartyToken 2 balance");
assertEquals(contract.balanceOf(other, partyToken3).toNumber(), 5, "Verify other's PartyToken 3 balance");
fail(do_implicit_batch_transfer(contract, other, me, [], [], me), "Disallow transfer from other account when not approved, empty arrays");
fail(do_implicit_batch_transfer(contract, other, me, [partyToken2], [1], me), "Disallow transfer from other account when not approved, single entry");
fail(do_implicit_batch_transfer(contract, other, me, [partyToken1, partyToken2], [1, 2], me), "Disallow transfer from other account when not approved, multiple entries");
fail(do_implicit_batch_transfer(contract, other, me, [partyToken1, partyToken2, partyToken3], [1, 2], me), "Disallow transfer from other account when not approved, unequal length of arrays");

succ(do_setApprovalForAll(contract, me, true, other), "Other can successfully approve me");
succ(do_implicit_batch_transfer(contract, other, me, [partyToken2], [1], me), "Allow transfer from other account when approved, single entry");
assertEquals(contract.balanceOf(other, partyToken1).toNumber(), 8, "Verify other's PartyToken 1 balance, after 1st withdrawal");
assertEquals(contract.balanceOf(other, partyToken2).toNumber(), 5, "Verify other's PartyToken 2 balance, after 1st withdrawal");
assertEquals(contract.balanceOf(other, partyToken3).toNumber(), 5, "Verify other's PartyToken 3 balance, after 1st withdrawal");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 2, "Verify own PartyToken 1 balance, after 1st receive");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 5, "Verify own PartyToken 2 balance, after 1st receive");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 5, "Verify own PartyToken 3 balance, after 1st receive");

succ(do_implicit_batch_transfer(contract, other, me, [partyToken1, partyToken2], [1, 2], me), "Allow transfer from other account when approved, multiple entries");
assertEquals(contract.balanceOf(other, partyToken1).toNumber(), 7, "Verify other's PartyToken 1 balance, after 2nd withdrawal");
assertEquals(contract.balanceOf(other, partyToken2).toNumber(), 3, "Verify other's PartyToken 2 balance, after 2nd withdrawal");
assertEquals(contract.balanceOf(other, partyToken3).toNumber(), 5, "Verify other's PartyToken 3 balance, after 2nd withdrawal");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 3, "Verify own PartyToken 1 balance, after 2nd receive");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 7, "Verify own PartyToken 2 balance, after 2nd receive");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 5, "Verify own PartyToken 3 balance, after 2nd receive");

fail(do_implicit_batch_transfer(contract, other, me, [partyToken1, partyToken2, partyToken3], [1, 2], me), "Disallow transfer from other account when *approved*, unequal length of arrays");

// no-ops

succ(do_batch_transfer(contract, me, me, [partyToken1], [1]), "Make sure that sending to oneself is a no-op");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 3, "The balance should remain the same after transferring to oneself");

succ(do_batch_transfer(contract, me, me, [partyToken2, partyToken3], [1, 2]), "Make sure that sending to oneself is a no-op");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 3, "The balance should remain the same after transferring to oneself");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 7, "The balance should remain the same after transferring to oneself");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 5, "The balance should remain the same after transferring to oneself");

succ(do_batch_transfer(contract, me, other, [partyToken1, partyToken2, partyToken3], [1, 2, 0]), "Allow batch transfer when one (last) amount is 0");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 2, "...");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 5, "...");
assertEquals(contract.balanceOf(me, partyToken3).toNumber(), 5, "...");
