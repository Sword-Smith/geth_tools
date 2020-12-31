/* For a contract with deeply nested if/within, verify that payouts go to the right token IDs */
web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
var other = web3.eth.accounts[1];
var third = web3.eth.accounts[2];
web3.eth.sendTransaction({to:other, from:me, value:web3.toWei("1", "ether")});

var contract = DeepNestedContractMultiplePayouts_;
log_big("DeepNestedContractMultiplePayouts_ test.");
do_approve_on(188, Erc20_DAI, contract.address);

// Ensure that PT4 and PT12 are in the money of the associated sword contract
do_set(DataFeed0_, 1);
do_set(DataFeed1_, 1);
do_set(DataFeed2_, 1);
do_set(DataFeed3_, 1);
do_set(DataFeed4_, 0);
do_set(DataFeed5_, 1);
do_set(DataFeed6_, 1);

for (var i = 1; i <= 16; i++) {
    assertEquals(contract.balanceOf(me, i).toNumber(), 0, "PartyToken " + i.toString() + " should have balance 0 before activation");
}
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 0, "DC Settlement asset balance be 0 before activation");

succ(do_activate(contract, 47), "Allow activation with 47");
for (var i = 0; i <= 16; i++) {
    assertEquals(contract.balanceOf(me, i).toNumber(), 47, "PartyToken " + i.toString() + " should have balance 47 after activation");
}
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19812, "Settlement asset should have balance 19812 after activation");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 188, "DC Settlement asset balance be 188 before activation");

// transfer away all but the PT4 and PT12 tokens
for (var i = 0; i <= 16; i++) {
    if (i != 4 && i != 12) {
        succ(do_transfer(contract, me, other, i, 47), "Allow me to transfer away 47 PT" + i.toString() + "s, #1");
    }
}
for (var i = 0; i <= 16; i++) {
    var expectedBalance = i === 4 || i ===12 ? 47 : 0;
    assertEquals(contract.balanceOf(me, i).toNumber(), expectedBalance, "PartyToken " + i.toString() + " should have balance " + expectedBalance + " after activation");
}
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 19812, "Settlement asset should be unchanged");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 188, "DC Settlement asset should be unchanged");

// Execute pay and verify that balances are unaffected since contract has not yet reached maturity
succ(do_pay_implicit(contract, me), "Can execute pay, #1");
for (var i = 0; i < 19; i++) {
    console.log(get_storage_at(contract, i));
}
for (var i = 0; i <= 16; i++) {
    var expectedBalance = i === 4 || i ===12 ? 47 : 0;
    assertEquals(contract.balanceOf(me, i).toNumber(), expectedBalance, "PartyToken " + i.toString() + " should have unaffected balance " + expectedBalance + " after 1st pay");
}

// sleep 12 seconds to ensure that the contract is ready for evaluation/payout
sleep(12000);
succ(do_pay_implicit(contract, me), "Can execute pay, #2");
for (var i = 0; i <= 16; i++) {
    assertEquals(contract.balanceOf(me, i).toNumber(), 0, "PartyToken " + i.toString() + " should have balance 0 after 2nd pay");
}
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 20000, "I should have all settlement assets after call to pay");
assertEquals(Erc20_DAI.balanceOf(contract.address).toNumber(), 0, "DC should have no settlement assets after call to pay");

for (var i = 0; i <= 16; i++) {
    var expectedBalance = i === 4 || i ===12 ? 0 : 47;
    assertEquals(contract.balanceOf(other, i).toNumber(), expectedBalance, "other's partyToken " + i.toString() + " should have balance " + expectedBalance + " after 2nd pay");
}
assertEquals(Erc20_DAI.balanceOf(other).toNumber(), 0, "Other should have zero settlement assets before their call to pay");
succ(do_pay_implicit(contract, other), "Other can execute pay, #3");
assertEquals(Erc20_DAI.balanceOf(other).toNumber(), 0, "Other should have zero settlement assets after their call to pay");
for (var i = 0; i <= 16; i++) {
    assertEquals(contract.balanceOf(other, i).toNumber(), 0, "other's partyToken " + i.toString() + " should have balance 0 after 3rd pay");
}

// Other can call pay again without this having any effect
succ(do_pay_implicit(contract, other), "Other can execute pay, #4");
assertEquals(Erc20_DAI.balanceOf(other).toNumber(), 0, "Other should have zero settlement assets after repeated call to pay");
for (var i = 0; i <= 16; i++) {
    assertEquals(contract.balanceOf(other, i).toNumber(), 0, "other's partyToken " + i.toString() + " should have balance 0 after repeated call to pay");
}
assertEquals(Erc20_DAI.balanceOf(other).toNumber(), 0, "Other should have zero settlement assets after repeated call to pay");
