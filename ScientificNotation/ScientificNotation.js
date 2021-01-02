/* Verify that scientific notation for numbers works */
web3.eth.defaultAccount = web3.eth.accounts[0];
var me = web3.eth.accounts[0];
var other = web3.eth.accounts[1];
web3.eth.sendTransaction({to:other, from:me, value:web3.toWei("1", "ether")});

var contract = ScientificNotation_;
log_big("ScientificNotation_ test.");
do_approve_on(1e18, Erc20_DAI, contract.address);
do_set(DataFeed0_, 1);

assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 11e17, "Settlement asset held by me should be 11e17 before activation");

fail(do_activate(contract, 2), "Disallow activation with 2");
succ(do_activate(contract, 1), "Allow activation with 1");
assertEquals(contract.balanceOf(me, 0).toNumber(), 1, "PartyToken 0 should have balance 1 after activation");
assertEquals(contract.balanceOf(me, 1).toNumber(), 1, "PartyToken 1 should have balance 1 after activation");
assertEquals(contract.balanceOf(me, 2).toNumber(), 1, "PartyToken 2 should have balance 1 after activation");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 1e17, "Settlement asset held by me should be reduced by 1e18");

var pt0 = 0;
var pt1 = 1;
var pt2 = 2;
succ(do_transfer(contract, me, other, pt0, 1), "Allow me to transfer away 1 PT0");
succ(do_transfer(contract, me, other, pt2, 1), "Allow me to transfer away 1 PT2");

succ(do_pay_implicit(contract, me), "Can execute pay, #1");
assertEquals(Erc20_DAI.balanceOf(me).toNumber(), 11e17, "Settlement asset held by me should be 11e17 after pay");
assertEquals(contract.balanceOf(me, 0).toNumber(), 0, "PartyToken 0 should have balance 0 after activation");
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PartyToken 1 should have balance 0 after activation");
assertEquals(contract.balanceOf(me, 2).toNumber(), 0, "PartyToken 2 should have balance 0 after activation");
