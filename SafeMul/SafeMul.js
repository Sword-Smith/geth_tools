web3.eth.defaultAccount = web3.eth.accounts[0];
var me = web3.eth.accounts[0];
var contract = SafeMul_;

log_big("SafeMul_ test.");
succ(do_approve(2000, 3000000, contract.address), "approve");
succ(do_activate(contract, 40), "activate(40)");
assertEquals(contract.balanceOf(me, 1).toNumber(), 40, "PT1 balance is 40 after succeeded activate()");
assertEquals(contract.balanceOf(me, 2).toNumber(), 40, "PT2 balance is 40 after succeeded activate()");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19200, "Settlement asset is 19,200 after successful activate");

// Force branch to be picked -- this means that we don't have to wait the
// one second from deployment before the contract resolves as this could
// make a call to `pay()` have no effect.
do_set(DataFeed0_, 1);

// SafeMul must fail on eval((-2^255) * (-1)) since this overflows
do_set(DataFeed1_, -Math.pow(2,255));
do_set(DataFeed2_, -1);
fail(do_pay(contract), "Must revert on overflow 0");
assertEquals(contract.balanceOf(me, 1).toNumber(), 40, "PT1 balance is unaffected after failed pay");
assertEquals(contract.balanceOf(me, 2).toNumber(), 40, "PT2 balance is unaffected after failed pay");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19200, "Settlement asset balance is unaffected after failed pay");

// SafeMul must fail on eval((-1) * (-2^255)) since this overflows
do_set(DataFeed1_, -1);
do_set(DataFeed2_, -Math.pow(2,255));
fail(do_pay(contract), "Must revert execution on special case overflow");

// SafeMul must fail on eval((-3) * 2^254) since this overflows
do_set(DataFeed1_, -3);
do_set(DataFeed2_, Math.pow(2,254));
fail(do_pay(contract), "Must revert on overflow 2");

// SafeMul must fail on eval(3 * (-2^254)) since this overflows
do_set(DataFeed1_, 3);
do_set(DataFeed2_, -Math.pow(2,254));
fail(do_pay(contract), "Must revert on overflow 3");

// SafeMul must fail on eval((-3) * (-2^254)) since this overflows
do_set(DataFeed1_, -3);
do_set(DataFeed2_, -Math.pow(2,254));
fail(do_pay(contract), "Must revert on overflow 4");

// SafeMul must fail on eval(3 * 2^254) since this overflows
do_set(DataFeed1_, 3);
do_set(DataFeed2_, Math.pow(2,254));
fail(do_pay(contract), "Must revert on overflow 5");

// SafeMul must fail on eval((-2^128) * (-2^128)) since this overflows
do_set(DataFeed1_, -Math.pow(2,128));
do_set(DataFeed2_, -Math.pow(2,128));
fail(do_pay(contract), "Must revert on overflow 6");

// SafeMul must fail on eval((-2^128) * 2^128) since this overflows
do_set(DataFeed1_, -Math.pow(2,128));
do_set(DataFeed2_, Math.pow(2,128));
fail(do_pay(contract), "Must revert on overflow 7");

// SafeMul must fail on eval(2^128 * (-2^128)) since this overflows
do_set(DataFeed1_, Math.pow(2,128));
do_set(DataFeed2_, -Math.pow(2,128));
fail(do_pay(contract), "Must revert on overflow 8");

// SafeMul must fail on eval(2^128 * 2^128) since this overflows
do_set(DataFeed1_, Math.pow(2,128));
do_set(DataFeed2_, Math.pow(2,128));
fail(do_pay(contract), "Must revert on overflow 8");
assertEquals(contract.balanceOf(me, 1).toNumber(), 40, "PT1 balance is unaffected after failed pay");
assertEquals(contract.balanceOf(me, 2).toNumber(), 40, "PT2 balance is unaffected after failed pay");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19200, "Settlement asset balance is unaffected after failed pay");

// Try a legal set of numbers and verify success
do_set(DataFeed1_, 1);
succ(do_pay(contract), "Allow calculation of 1*2^128");
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PT1 balance is zero after call to pay");
assertEquals(contract.balanceOf(me, 2).toNumber(), 0, "PT2 balance is zero after call to pay");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset balance returned to init value after pay execution");

// Try another legal number and verify success
succ(do_mint(contract, 40), "activate(40)");
do_set(DataFeed1_, Math.pow(2,2));
do_set(DataFeed2_, Math.pow(2,252));
succ(do_pay(contract), "Allow calculation of 2^2*2^252");
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PT1 balance is zero after 2nd call to pay");
assertEquals(contract.balanceOf(me, 2).toNumber(), 0, "PT2 balance is zero after 2nd call to pay");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset balance returned to init value after 2nd pay execution");
