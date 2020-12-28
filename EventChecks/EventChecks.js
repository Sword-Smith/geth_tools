web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
other = web3.eth.accounts[1];

web3.eth.sendTransaction({to:other, from:me, value:web3.toWei("0.5", "ether")});
// web3.eth.subscribe("logs", {}, function(hm) {
//     console.log("An event!");
//     console.log(hm);
// });

var contract = EventChecks_;
log_big("EventChecks_ test.");
do_approve(1000, 3000000, contract.address);

succ(do_activate(contract, 10), "Allow activation with 10 party tokens");

var partyToken1 = 1;
var partyToken2 = 2;

assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 10, "PartyToken 1 should have balance 10 after activation");
//assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 10, "PartyToken 2 should have balance 10 after activation");

// event TransferSingle(indexed _operator, indexed _from, indexed _to, _id, _value);
var receipt1 = get_transaction(contract.safeTransferFrom(me, other, partyToken1, 6, 0));

var events1 = receipt1.logs;
assertEquals((events1 || []).length, 1, "1 event has been emitted");

var event1 = receipt1.logs[0];
assertEquals((event1.topics || []).length, 4, "4 topics have been emitted");

var topics = event1.topics;
var _signature = topics[0]; // SHA3("TransferSingle(...)")
var _operator = topics[1];
var _from = topics[2];
var _to = topics[3];

assertAddressEquals(_operator, me, "_operator topic should be 'me'");
assertAddressEquals(_from, me, "_from topic should also be 'me'");
assertAddressEquals(_to, other, "_to topic should be 'other'")

function assertAddressEquals(actual, expected, reason) {
    var avoidZeroPadding = new RegExp('^0x0*');
    var actualNoPadding = actual.replace(avoidZeroPadding, '0x');
    assertEquals(actualNoPadding, expected, reason);
}

assertEquals(
    event1.data,
    "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000006",
    "event data contains (1) the party token ID being transferred, (2) the amount transfered");