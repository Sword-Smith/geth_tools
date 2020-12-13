web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
other = web3.eth.accounts[1];

web3.eth.sendTransaction({to:other, from:me, value:web3.toWei("0.5", "ether")});

var contract = BatchTransferChecks_;
var contract_address = contract.address;
log_big("BatchTransferChecks_ test.");
do_approve(1000, 3000000, contract_address);

var partyToken0 = 0;
var partyToken1 = 1;
var partyToken2 = 2;

// before activation

assertEquals(contract.balanceOf(me, partyToken0).toNumber(), 0, "PartyToken 0 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 0, "PartyToken 1 should have balance 0 before activation");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 0, "PartyToken 2 should have balance 0 before activation");

// activation

succ(do_activate(contract, 10), "Allow activation with 10");

assertEquals(contract.balanceOf(me, partyToken0).toNumber(), 10, "PartyToken 0 should have balance 10 after activation");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 10, "PartyToken 1 should have balance 10 after activation");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 10, "PartyToken 2 should have balance 10 after activation");

// safeBatchTransferFrom that don't do anything

succ(do_batch_transfer(contract, me, other, [], []), "allows empty lists of _ids and _values");
succ(do_batch_transfer(contract, me, other, [partyToken0], [0]), "can batch transfer 0 of PartyToken 0");
succ(do_batch_transfer(contract, me, other, [partyToken0, partyToken1, partyToken2], [0, 0, 0]), "can batch transfer 0 of PT0, PT1 and PT2");

assertEquals(contract.balanceOf(me, partyToken0).toNumber(), 10, "PartyToken 0 should have balance 10 after transferring 0 of it");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 10, "PartyToken 1 should have balance 10 after transferring 0 of PartyToken 0");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 10, "PartyToken 2 should have balance 10 after transferring 0 of PartyToken 0");

succ(do_batch_transfer(contract, me, other, [partyToken0], [1]), "can batch transfer 1 of PartyToken 0");
assertEquals(contract.balanceOf(me, partyToken0).toNumber(), 9, "PartyToken 0 should have balance 9 after batch transfer of 1 of PartyToken 0");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 10, "PartyToken 1 should have balance 10 after batch transfer of 1 of PartyToken 0");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 10, "PartyToken 2 should have balance 10 after batch transfer of 1 of PartyToken 0");

succ(do_batch_transfer(contract, me, other, [partyToken0, partyToken1], [1, 3]), "can batch transfer 1 x PT0 and 3 x PT1");

assertEquals(contract.balanceOf(me, partyToken0).toNumber(), 8, "PartyToken 0 should have balance 8 after transferring 1 of it");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 7, "PartyToken 1 should have balance 7 after transferring 3 of it");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 10, "PartyToken 2 should have balance 10 after transferring only PT0 and PT1");

fail(do_batch_transfer(contract, me, "0x0000000000000000000000000000000000000000", [partyToken1], [1]), "Fail when _to is 0 (ERC-1155 requirement).");
fail(do_batch_transfer(contract, me, other, [2], [9, 8, 7]), "fail when len(_ids) != len(_values)");

// simple batch transfer of one PT
// negative:
//  - len(_ids) = 0, len(_values) = 1
//  - len(_ids) = 1, len(_values) = 1
//  - len(_ids) = 0, len(_values) = 1

// valid + invalid party token
// all sufficient funds
// sufficient + zeros
// sufficient + insufficient
// sufficient + insufficient + zeros