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

// function balanceOfBatch(address[] _owners, uint256[] _ids) returns (uint256[]);

// assertEquals(contract.balanceOfBatch([], []), [], "an empty batch gives an empty result");

var x = contract.balanceOfBatch([], []);
console.log("derp: " + x);

var y = contract.balanceOfBatch([me], [0]);
console.log("me, PT0: " + y);

var z = contract.balanceOfBatch([me, me], [0, 1]);
console.log("me, PT0: " + z);

//assertEquals(contract.balanceOfBatch([me], [partyToken0]), [10], "an empty batch gives an empty result");
