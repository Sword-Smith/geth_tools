web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract_address = SafeDiv_.address;
var contract = SafeDiv_;

log_big("Preparing for the safe division test.");
succ(do_approve(1000, 3000000, contract_address));
succ(do_activate(contract, 5), "activate(5)");
assertEquals(contract.balanceOf(me, 4).toNumber(), 5, "PT0 balance is correct after activation");
assertEquals(contract.balanceOf(me, 5).toNumber(), 5, "PT1 balance is correct after activation");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19900, "Settlement asset balance should be 19,900 after activation");

// first it tries to overflow, gets rejected
do_set(DataFeed1_, 1);
do_set(DataFeed2_, 0);
do_set(DataFeed0_, 1); // Ensure pay works if called within 1 second of deployment
fail(do_pay(contract, contract_address), "Verify that 1/0 throws an error");
assertEquals(contract.balanceOf(me, 4).toNumber(), 5, "PT0 balance is unaffected by failed pay");
assertEquals(contract.balanceOf(me, 5).toNumber(), 5, "PT1 balance is unaffected by failed pay");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19900, "Settlement asset balance is unaffected by failed pay");

do_set(DataFeed1_, -Math.pow(2,255));
do_set(DataFeed2_, -1);
fail(do_pay(contract, contract_address), "Verify that 2^255/(-1) throws an error");
assertEquals(contract.balanceOf(me, 4).toNumber(), 5, "PT0 balance is unaffected by failed pay");
assertEquals(contract.balanceOf(me, 5).toNumber(), 5, "PT1 balance is unaffected by failed pay");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19900, "Settlement asset balance is unaffected by failed pay");

// then it tries some legal number, and succeeds
do_set(DataFeed1_, 1);
do_set(DataFeed2_, 1);
succ(do_pay(contract, contract_address), "Allow 1/1 calculation");
assertEquals(contract.balanceOf(me, 4).toNumber(), 0, "PT0 balance is zero after successful pay");
assertEquals(contract.balanceOf(me, 5).toNumber(), 0, "PT1 balance is zero after successful pay");

do_set(DataFeed1_, 0);
succ(do_mint(contract, 5), "mint(1)");
succ(do_pay(contract, contract_address), "Allow 0/1 calculation");
assertEquals(contract.balanceOf(me, 4).toNumber(), 0, "PT0 balance is zero after successful pay, 2");
assertEquals(contract.balanceOf(me, 5).toNumber(), 0, "PT1 balance is zero after successful pay, 2");

// Try other legal values and verify their correctness
for (var i = 0; i < 10; i++) {
    do_mint(contract, 1);
    var logNumerator = Math.floor(Math.random() * 256);
    var logDenominator = Math.floor(Math.random() * 256);
    var numerator = Math.pow(2, logNumerator);
    var denominator = Math.pow(2, logDenominator);
    do_set(DataFeed1_, numerator);
    do_set(DataFeed2_, denominator);
    succ(do_pay(contract, contract_address), "Allow 2^" + logNumerator.toString() + "/2^" + logDenominator.toString() + " calculation");
}
