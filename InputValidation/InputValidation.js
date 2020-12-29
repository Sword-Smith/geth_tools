web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract = InputValidation_;
var contract_address = contract.address;
do_set(DataFeed0_, 1); // set branch determining observable to avoid risk of time not having run out when pay() is called

log_big("InputValidation_ test.");
do_approve(1000, 3000000, contract_address);
do_set(DataFeed1_, 2);
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PT1 balance zero at init");
assertEquals(contract.balanceOf(me, 2).toNumber(), 0, "PT2 balance zero at init");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset balance is 20,000 at init");

// Verify that activate validates inputs
fail(do_activate(contract, -10652), "activate(-10652) fails");
fail(do_activate(contract, -1), "activate(-1) fails");
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PT1 balance zero after failed activate call, 1");
assertEquals(contract.balanceOf(me, 2).toNumber(), 0, "PT2 balance zero after failed activate call, 1");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset balance is 20,000 after failed activate call, 1");

fail(do_activate(contract, 0), "activate(0) fails");
assertEquals(contract.balanceOf(me, 1).toNumber(), 0, "PT1 balance zero after failed activate call, 2");
assertEquals(contract.balanceOf(me, 2).toNumber(), 0, "PT2 balance zero after failed activate call, 2");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 20000, "Settlement asset balance is 20,000 after failed activate call, 2");

succ(do_activate(contract, 1), "activate(1) succeeds");
assertEquals(contract.balanceOf(me, 1).toNumber(), 1, "PT1 balance is 1 after successful activate call");
assertEquals(contract.balanceOf(me, 2).toNumber(), 1, "PT2 balance is 1 after successful activate call");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19724, "Settlement asset balance is 19724 after successful activate call");

fail(do_mint(contract, -10652), "mint(-10652) fails");
fail(do_mint(contract, -1), "mint(-1) fails");
fail(do_mint(contract, 0), "mint(0) fails");
succ(do_mint(contract, 1), "mint(1) works");
assertEquals(contract.balanceOf(me, 1).toNumber(), 2, "PT1 balance is 2 after successful mint call");
assertEquals(contract.balanceOf(me, 2).toNumber(), 2, "PT2 balance is 2 after successful mint call");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19448, "Settlement asset balance is 19448 successful mint call");

fail(do_burn(contract, -10652), "burn(-10652) fails");
fail(do_burn(contract, -1), "burn(-1) fails");
fail(do_burn(contract, 0), "burn(0) fails");
succ(do_burn(contract, 1), "burn(1) fails");
assertEquals(contract.balanceOf(me, 1).toNumber(), 1, "PT1 balance is 1 after successful burn call");
assertEquals(contract.balanceOf(me, 2).toNumber(), 1, "PT2 balance is 1 after successful burn call");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 19724, "Settlement asset balance is 19724 after successful burn call");

fail(do_burn(contract, -106526123), "burn(-106526123) fails again");
fail(do_burn(contract, -1), "burn(-1) fails again");
fail(do_burn(contract, 0), "burn(0) fails again");
fail(do_burn(contract, 2), "burn(2) fails due to too low PT balance");
fail(do_burn(contract, 3), "burn(3) fails due to too low PT balance");
fail(do_burn(contract, 4), "burn(4) fails due to too low PT balance");
fail(do_burn(contract, 5), "burn(5) fails due to too low PT balance");
fail(do_burn(contract, 9872), "burn(9872) fails due to too low PT balance");
fail(do_burn(contract, 4187957214), "burn(4187957214) fails due to too low PT balance");

succ(do_pay(contract, contract_address));
