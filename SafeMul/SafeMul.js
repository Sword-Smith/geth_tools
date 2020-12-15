web3.eth.defaultAccount = web3.eth.accounts[0];
var me = web3.eth.accounts[0];
var contract = SafeMul_;

log_big("SafeMul.");
succ(do_approve(2000, 3000000, contract.address), "approve");
succ(do_activate(contract, 40), "activate(40)");
fail(do_activate(contract, 40), "fail repeated activate(40)");

// Force branch to be picked
succ(do_set(DataFeed0_, 1));

// Multiply 0 with 2^254 inside contract
// succ(do_set(DataFeed1_, 0), "set DF1=0");
// succ(do_set(DataFeed2_, Math.pow(2,254)), "set DF1=0");
// succ(do_pay(contract));
// do_pay_a_bit(contract, contract.address);

// SafeMul must fail on eval((-1) * (-2^255)) since this overflows
succ(do_set(DataFeed1_, -1), "set DF2=-1");
succ(do_set(DataFeed2_, -Math.pow(2,255)), "set DF1=int256.Min");
fail(do_pay(contract), "Must revert execution on special case overflow");

// SafeMul must fail on eval((-3) * 2^254) since this overflows
succ(do_set(DataFeed1_, -3), "set DF1 = -3");
succ(do_set(DataFeed2_, Math.pow(2,254)), "set DF2 = 2^254");
fail(do_pay(contract), "Must revert on overflow 2");

// SafeMul must fail on eval(3 * (-2^254)) since this overflows
do_set(DataFeed1_, 3);
do_set(DataFeed2_, -Math.pow(2,254));
fail(do_pay(contract));

// SafeMul must fail on eval((-3) * (-2^254)) since this overflows
do_set(DataFeed1_, -3);
do_set(DataFeed2_, -Math.pow(2,254));
fail(do_pay(contract));

// SafeMul must fail on eval(3 * 2^254) since this overflows
do_set(DataFeed1_, 3);
do_set(DataFeed2_, Math.pow(2,254));
fail(do_pay(contract));

// then it tries some legal number, and succeeds
do_set(DataFeed1_, 1);
succ(do_pay(contract));
