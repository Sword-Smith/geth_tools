/* For a contract with deeply nested if/within, verify that payouts go to the right token IDs */
web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
var other = web3.eth.accounts[1];
var third = web3.eth.accounts[2];
web3.eth.sendTransaction({to:other, from:me, value:web3.toWei("1", "ether")});

var contract = DeepNestedContractMultiplePayoutsMultipleAssets1_;
log_big("DeepNestedContractMultiplePayoutsMultipleAssets1_ test.");
do_approve_on(188, Erc20_DAI, contract.address);
do_approve_on(188, Erc20_GOLEM, contract.address);
do_approve_on(188, Erc20_AGI, contract.address);
do_approve_on(188, Erc20_LINK, contract.address);
do_approve_on(188, Erc20_WBTC, contract.address);
do_approve_on(188, Erc20_REV, contract.address);
do_approve_on(188, Erc20_HT, contract.address);
do_approve_on(188, Erc20_SNX, contract.address);
var assets = [Erc20_DAI, Erc20_GOLEM, Erc20_AGI, Erc20_LINK, Erc20_WBTC, Erc20_REV, Erc20_HT, Erc20_SNX];
var assetsReceivedByMe = [Erc20_LINK];
var assetsReceivedByOther = [Erc20_DAI, Erc20_GOLEM, Erc20_AGI, Erc20_WBTC, Erc20_REV, Erc20_HT, Erc20_SNX];
var assetsReceivedByThird = [];

// Ensure that PT4 and PT12 (a LINK payout) are in the money of the associated sword contract
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
for (var j = 0; j < assets.length; j++) {
    assertEquals(assets[j].balanceOf(me).toNumber(), 20000, "Settlement asset should have balance 20,000 before activation");
    assertEquals(assets[j].balanceOf(contract.address).toNumber(), 0, "DC Settlement asset balance be 0 before activation");
}

succ(do_activate(contract, 47), "Allow activation with 47");
for (var i = 0; i <= 16; i++) {
    assertEquals(contract.balanceOf(me, i).toNumber(), 47, "PartyToken " + i.toString() + " should have balance 47 after activation");
}
for (var j = 0; j < assets.length; j++) {
    assertEquals(assets[j].balanceOf(me).toNumber(), 19812, "Settlement asset should have balance 19812 after activation");
    assertEquals(assets[j].balanceOf(contract.address).toNumber(), 188, "DC Settlement asset balance be 188 after activation");
}

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
for (var j = 0; j < assets.length; j++) {
    assertEquals(assets[j].balanceOf(me).toNumber(), 19812, "Settlement asset should be unchanged");
    assertEquals(assets[j].balanceOf(contract.address).toNumber(), 188, "DC Settlement asset should be unchanged");
}

// Execute pay and verify that balances are unaffected since contract has not yet reached maturity
succ(do_pay_implicit(contract, me), "Can execute pay, #1");
for (var i = 0; i < 19; i++) {
    console.log(get_storage_at(contract, i));
}

// sleep 12 seconds to ensure that the contract is ready for evaluation/payout
sleep(12000);
succ(do_pay_implicit(contract, me), "Can execute pay, #2");
for (var i = 0; i <= 16; i++) {
    assertEquals(contract.balanceOf(me, i).toNumber(), 0, "PartyToken " + i.toString() + " should have balance 0 after 2nd pay");
}
for (var j = 0; j < assetsReceivedByMe.length; j++) {
    console.log(j);
    assertEquals(assetsReceivedByMe[j].balanceOf(me).toNumber(), 20000, "Settlement asset received by me should be 20000 after pay");
    assertEquals(assetsReceivedByMe[j].balanceOf(contract.address).toNumber(), 0, "DC Settlement asset received by me should be 0 after pay");
}
for (var j = 0; j < assetsReceivedByOther.length; j++) {
    console.log(j);
    assertEquals(assetsReceivedByOther[j].balanceOf(other).toNumber(), 0, "other should not have settlement asset before call to pay");
    assertEquals(assetsReceivedByOther[j].balanceOf(contract.address).toNumber(), 188, "DC Settlement asset balance should be unchanged");
}

for (var i = 0; i <= 16; i++) {
    var expectedBalance = i === 4 || i ===12 ? 0 : 47;
    assertEquals(contract.balanceOf(other, i).toNumber(), expectedBalance, "other's partyToken " + i.toString() + " should have balance " + expectedBalance + " after 2nd pay");
}
succ(do_pay_implicit(contract, other), "Other can execute pay, #3");
for (var j = 0; j < assetsReceivedByOther.length; j++) {
    console.log(j);
    assertEquals(assetsReceivedByOther[j].balanceOf(other).toNumber(), 188, "Settlement asset received by other should be 188 after pay");
    assertEquals(assetsReceivedByOther[j].balanceOf(contract.address).toNumber(), 0, "DC Settlement asset received by other should be 0 after pay");
}for (var i = 0; i <= 16; i++) {
    assertEquals(contract.balanceOf(other, i).toNumber(), 0, "other's partyToken " + i.toString() + " should have balance 0 after 3rd pay");
}

// Other can call pay again without this having any effect
succ(do_pay_implicit(contract, other), "Other can execute pay, #4");
for (var j = 0; j < assetsReceivedByOther.length; j++) {
    console.log(j);
    assertEquals(assetsReceivedByOther[j].balanceOf(other).toNumber(), 188, "Settlement asset received by other should be 188 after pay again");
    assertEquals(assetsReceivedByOther[j].balanceOf(contract.address).toNumber(), 0, "DC Settlement asset received by other should be 0 after pay again");
}for (var i = 0; i <= 16; i++) {
    assertEquals(contract.balanceOf(other, i).toNumber(), 0, "other's partyToken " + i.toString() + " should have balance 0 after pay again");
}

for (var j = 0; j < assets.length; j++) {
    assertEquals(assets[j].balanceOf(contract.address).toNumber(), 0, "DC Settlement asset balance be 0 all calls to pay");
}

