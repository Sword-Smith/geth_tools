web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
other = web3.eth.accounts[1];

var contract = BatchBalanceChecks_;
var contract_address = contract.address;
log_big("BatchBalanceChecks_ test.");
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

do_transfer(contract, me, other, partyToken0, 1);
do_transfer(contract, me, other, partyToken1, 2);
do_transfer(contract, me, other, partyToken2, 3);

assertEquals(contract.balanceOf(me, partyToken0).toNumber(), 9, "PartyToken 0 should have balance 9 after transfer");
assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 8, "PartyToken 1 should have balance 8 after transfer");
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 7, "PartyToken 2 should have balance 7 after transfer");

// function balanceOfBatch(address[] _owners, uint256[] _ids) returns (uint256[]);

// assertEquals(contract.balanceOfBatch([], []), [], "an empty batch gives an empty result");

assertEquals(contract.balanceOfBatch([], []).length, 0, "The empty batch requests gives no results");
assertEquals(contract.balanceOfBatch([me], [partyToken0]).length, 1, "Singleton request returns singleton");

assertEquals(contract.balanceOfBatch([me], [partyToken0])[0].toNumber(), 9, "Verify expected balance");
assertEquals(contract.balanceOfBatch([me], [partyToken1])[0].toNumber(), 8, "Verify expected balance");
assertEquals(contract.balanceOfBatch([me], [partyToken2])[0].toNumber(), 7, "Verify expected balance");

assertEquals(contract.balanceOfBatch([other], [partyToken0])[0].toNumber(), 1, "Verify expected balance");
assertEquals(contract.balanceOfBatch([other], [partyToken1])[0].toNumber(), 2, "Verify expected balance");
assertEquals(contract.balanceOfBatch([other], [partyToken2])[0].toNumber(), 3, "Verify expected balance");

assertArrayEquals(
    contract.balanceOfBatch([me, me], [partyToken0, partyToken0]).map(function(x) { return x.toNumber(); }),
    [9, 9],
    "Verify expected balance");

assertArrayEquals(
    contract.balanceOfBatch([me, me, me], [partyToken0, partyToken1, partyToken2]).map(function(x) { return x.toNumber(); }),
    [9, 8, 7],
    "Verify expected balance");

assertArrayEquals(
    contract.balanceOfBatch([me, other, me], [partyToken0, partyToken1, partyToken2]).map(function(x) { return x.toNumber(); }),
    [9, 2, 7],
    "Verify expected balance");

try {
    contract.balanceOfBatch([me], []);
    assertEquals(1, 2, ":(");
} catch (error) { assertEquals(1, 1, ":)"); }

try {
    contract.balanceOfBatch([], [partyToken0]);
    assertEquals(1, 2, ":(");
} catch (error) { assertEquals(1, 1, ":)"); }

try {
    contract.balanceOfBatch([me], [partyToken0, partyToken1]);
    assertEquals(1, 2, ":(");
} catch (error) { assertEquals(1, 1, ":)"); }
