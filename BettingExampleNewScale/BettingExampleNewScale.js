web3.eth.defaultAccount = web3.eth.accounts[0];
var me = web3.eth.accounts[0];
var other = web3.eth.accounts[1];

// Check state before activate
var BettingAddress = BettingExampleNewScale_.address;
var contract = BettingExampleNewScale_;
do_set(DataFeed0_, 1); // set branch determining observable to avoid risk of time not having run out when pay() is called

// WIP listen to events
var abi = [{"payable":"","type":"function","inputs":[],"constant":"","name":"execute","outputs":[]},{"outputs":[],"name":"pay","constant":"","inputs":[],"type":"function","payable":""},{"type":"function","inputs":[{"type":"uint256","name":"amount"}],"payable":"","name":"activate","constant":"","outputs":[]},{"type":"function","inputs":[{"name":"amount","type":"uint256"}],"payable":"","outputs":[],"constant":"","name":"mint"},{"type":"function","payable":"","inputs":[{"name":"amount","type":"uint256"}],"constant":"","name":"burn","outputs":[]},{"payable":"","type":"function","inputs":[{"type":"uint256","name":"party"}],"outputs":[],"name":"take","constant":""},{"name":"Activated","anonymous":"","type":"event","inputs":[]}]
var mc = web3.eth.contract(abi);
var mci = mc.at(BettingAddress)
var events = mci.allEvents();
events.watch(function(error, event) { console.log(event); });

assertEquals(Erc20_CHF.allowance(me, contract.address).toNumber(), 0, "Allowance before activate 0.");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 1000000, "SA Allowance before activate 1,000,000.");

succ(do_approve(1000, 300000, BettingAddress));
assertEquals(Erc20_CHF.allowance(me, contract.address).toNumber(), 1000, "Allowance after approve is 1,000.");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 1000000, "Balance after approve still 1,000,000.");

do_activate(contract, 7);
assertEquals(contract.balanceOf(me, 0).toNumber(), 7, "PT0 balance 7 after activate(7)");
assertEquals(contract.balanceOf(me, 1).toNumber(), 7, "PT1 balance 7 after activate(7)");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 999944, "SA balance correct after activate(7).");

succ(do_burn(contract, 4), "Allow burning of 4 when balance is 7");
assertEquals(contract.balanceOf(me, 0).toNumber(), 3, "PT0 balance 3 after burn(4)");
assertEquals(contract.balanceOf(me, 1).toNumber(), 3, "PT1 balance 3 after burn(4)");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 999976, "SA balance correct after burn(4).");

fail(do_burn(contract, 5), "Fail burning 5 when balance is 3");

succ(do_mint(contract, 17), "Succeed in mint 17");
assertEquals(contract.balanceOf(me, 0).toNumber(), 20, "PT0 balance 20 after mint(17)");
assertEquals(contract.balanceOf(me, 1).toNumber(), 20, "PT1 balance 20 after mint(17)");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 999840, "SA balance 999,840 after mint(17)");

fail(do_burn(contract, 30000), "Fail in burning more than lowest PT balance");

// Send 1 PT0 token away and verify that this affects how much can be burned
var partyToken0 = 0;
do_transfer(contract, me, other, partyToken0, 1);
assertEquals(contract.balanceOf(me, 0).toNumber(), 19, "PT0 balance 19 after transfer of 1");
assertEquals(contract.balanceOf(me, 1).toNumber(), 20, "PT0 balance 20 after transfer of PT0");

fail(do_burn(contract, 20), "Disallow burning of one more token than lowest balance");
succ(do_burn(contract, 19), "Allow burning of lowest balance")
assertEquals(contract.balanceOf(me, 0).toNumber(), 0, "PT0 balance 20 after burn(19)");
assertEquals(contract.balanceOf(me, 1).toNumber(), 1, "PT1 balance 20 after burn(19)");
assertEquals(Erc20_CHF.balanceOf(me).toNumber(), 999992, "SA balance 999,992 after burn(19)");
