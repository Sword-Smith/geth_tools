web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];

var contract = SimpleTransfer_;

var ptBalance0 = contract.balanceOf(me, 0).toNumber();
var saBalance0 = Erc20_CHF.balanceOf(me).toNumber();

assertEquals(ptBalance0, 0, "Party token balance before activating is 0.");
assertEquals(saBalance0, 20000, "Settlement asset balance before activating is 20,000.");

do_approve(1000, 3000000, contract.address);

get_transaction(contract.activate(5));

var ptBalance1 = contract.balanceOf(me, 0).toNumber();
var saBalance1 = Erc20_CHF.balanceOf(me).toNumber();

assertEquals(ptBalance1, 5, "Party token balance after activate(5) is 5.");
assertEquals(saBalance1, 19995, "Settlement asset balance after activate(5) is 19,995.");

get_transaction(contract.pay());

var ptBalance2 = contract.balanceOf(me, 0).toNumber();
var saBalance2 = Erc20_CHF.balanceOf(me).toNumber();

assertEquals(ptBalance2, 0, "Party token balance after pay() is 0.");
assertEquals(saBalance2, 20000, "Settlement asset balance after pay() is 20,000.");
