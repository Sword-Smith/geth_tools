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
assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 10, "PartyToken 2 should have balance 10 after activation");

// event TransferSingle(indexed _operator, indexed _from, indexed _to, _id, _value);

transferSingle_test_1();

function transferSingle_test_1() {
    var receipt1 = get_transaction(contract.safeTransferFrom(me, other, partyToken1, 6, 0));

    assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 4, "I should have 4 PT1 left after transferring 6 PT1 to other");
    assertEquals(contract.balanceOf(other, partyToken1).toNumber(), 6, "Other should have 6 PT1 after having received them from me");
    assertEquals((receipt1.logs || []).length, 1, "1 event has been emitted (TransferSingle of PT1)");

    var event1 = receipt1.logs[0];
    assertEquals((event1.topics || []).length, 4, "4 topics have been emitted (TransferSingle of PT1)");

    var topics1 = event1.topics;
    var _signature = topics1[0]; // SHA3("TransferSingle(...)")
    var _operator = topics1[1];
    var _from = topics1[2];
    var _to = topics1[3];

    // TODO: assertEquals(_signature, SHA3("TransferSingle(..."), "event signature correct");
    assertAddressEquals(_operator, me, "_operator topic should be 'me'");
    assertAddressEquals(_from, me, "_from topic should also be 'me'");
    assertAddressEquals(_to, other, "_to topic should be 'other'")
    assertEquals(
        event1.data,
        "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000006",
        "event data contains (1) Party Token ID 1 being transferred, (2) the amount 6 transfered");
}

transferSingle_test_2();

function transferSingle_test_2() {
    var receipt2 = get_transaction(contract.safeTransferFrom(me, other, partyToken2, 3, 0));

    assertEquals(contract.balanceOf(me, partyToken2).toNumber(), 7, "I should have 7 PT2 left after transferring 3 PT2 to other");
    assertEquals(contract.balanceOf(other, partyToken2).toNumber(), 3, "Other should have 3 PT2 after having received them from me");

    assertEquals((receipt2.logs || []).length, 1, "1 event has been emitted (TransferSingle of PT2)");

    var event2 = receipt2.logs[0];
    assertEquals((event2.topics || []).length, 4, "4 topics have been emitted (TransferSingle of PT2)");

    var topics2 = event2.topics;
    var _signature = topics2[0]; // SHA3("TransferSingle(...)")
    var _operator = topics2[1];
    var _from = topics2[2];
    var _to = topics2[3];

    // TODO: assertEquals(_signature, SHA3("TransferSingle(..."), "event signature correct again");
    assertAddressEquals(_operator, me, "_operator topic should be 'me' again");
    assertAddressEquals(_from, me, "_from topic should also be 'me' again");
    assertAddressEquals(_to, other, "_to topic should be 'other' again")
    assertEquals(
        event2.data,
        "0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003",
        "event data contains (1) Party Token ID 2 being transferred, (2) the amount 3 transfered");
}

transferSingle_test_3();

function transferSingle_test_3() {
    var receipt3 = get_transaction(contract.safeTransferFrom(other, me, partyToken1, 5, 0, { from: other }));

    assertEquals(contract.balanceOf(me, partyToken1).toNumber(), 9, "I should have 9 PT1 left after other transfers me 5 PT1 back");
    assertEquals(contract.balanceOf(other, partyToken1).toNumber(), 1, "Other should have 1 PT1 after having transferring 5 PT1");

    assertEquals((receipt3.logs || []).length, 1, "1 event has been emitted (TransferSingle of PT2)");

    var event3 = receipt3.logs[0];
    assertEquals((event3.topics || []).length, 4, "4 topics have been emitted (TransferSingle of PT2)");

    var topics3 = event3.topics;
    var _signature = topics3[0]; // SHA3("TransferSingle(...)")
    var _operator = topics3[1];
    var _from = topics3[2];
    var _to = topics3[3];

    // TODO: assertEquals(_signature, SHA3("TransferSingle(..."), "event signature correct again");
    assertAddressEquals(_operator, other, "_operator topic should be 'other'");
    assertAddressEquals(_from, other, "_from topic should also be 'other'");
    assertAddressEquals(_to, me, "_to topic should be 'me'")
    assertEquals(
        event3.data,
        "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000005",
        "event data contains (1) Party Token ID 1 being transferred, (2) the amount 5 transfered");
}
