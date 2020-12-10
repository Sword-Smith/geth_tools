function l(a){
  console.log(a);
}
function get_transaction(b_A){
  t0_A = web3.eth.getTransaction(b_A);
  while (t0_A.blockNumber === null) {
      t0_A = web3.eth.getTransaction(b_A);
  }
}
function do_set(dataFeed, num) {
  get_transaction(dataFeed.set(0, num));
}
function get_balance(contract, address, index) {
  b_A = contract.balanceOf(address, index);
  return b_A;
}
function do_approve(validApproveAmount, gas_amount, contract_address) {
  try {
    b_A = Erc20_CHF.approve(contract_address, validApproveAmount, {
      from: me,
      gas: 3000000
    });
    t0_A = web3.eth.getTransaction(b_A);
    while (t0_A.blockNumber === null) {
      t0_A = web3.eth.getTransaction(b_A);
    }
    Erc20_CHF.allowance.call(me, contract_address,
      function(error, allowance) {
        assertEquals(allowance, validApproveAmount, "Check allowance after correct approve call..");
      });
    } catch (error) {return RES.FAIL;} return RES.SUCC;
  }
function do_changeAdmin(contract_address) {
  // Cannot read `.admin`. If this is to work, we need to implement
  // a `.getAdmin()` method on the PT. Please check OpenZeppelin ERC20 or ERC1155.
  // l("Old admin: ", Erc20PartyToken_pos0.admin)
  // l("Old admin: ", Erc20PartyToken_pos1.admin)
  try {
    tx0 = Erc20PartyToken_pos0.changeAdmin(contract_address);
    tx1 = Erc20PartyToken_pos1.changeAdmin(contract_address);
    while (tx0 === null || tx1 === null) {
      tx0 = Erc20PartyToken_pos0.changeAdmin(contract_address);
      tx1 = Erc20PartyToken_pos1.changeAdmin(contract_address);
    }
  //l("New admin: ", Erc20PartyToken_pos0.admin)
  //l("New admin: ", Erc20PartyToken_pos1.admin)
  } catch (error) {return RES.FAIL;} return RES.SUCC;
}
function do_activate(contract, num) {
  try {
    get_transaction(contract.activate(num));
  } catch (error) {return RES.FAIL;} return RES.SUCC;
}

function do_pay_a_bit(contract, contract_address) {
  for (i = 0; i < 3; i += 1){
    l(get_transaction(pay = contract.pay()));
  }
}

function do_pay(contract, contract_address) {
  try {
    var before = getBalances(contract_address);
    get_transaction(pay = contract.pay());
    while (before === getBalances(contract_address)){
      sleep(1000);
      get_transaction(pay = contract.pay());
    }
  } catch (error) {return RES.FAIL;} return RES.SUCC;
}
function do_mint(contract, num) {
  try {
    get_transaction(contract.mint(num));
  } catch (error) {return RES.FAIL;} return RES.SUCC;
}
function do_burn(contract, num) {
  try {
    get_transaction(contract.burn(num));
  } catch (error) {return RES.FAIL;} return RES.SUCC;
}
function getBalances(contract_address) {
  var res_string = "";
  Erc20_CHF.balanceOf.call(me, function(error, balance) {
    res_string += "My balance on token contract CHF is: " + balance + "\n";
  });
  Erc20_CHF.balanceOf.call(contract_address, function(error, balance) {
    res_string += "Derivative contract balance on token contract CHF is: " + balance + "\n";
  });
  Erc20PartyToken_pos0.balanceOf.call(me, function(error, balance) {
    res_string += "PT.pos0.balance(me): " + balance + "\n";
  });
  Erc20PartyToken_pos1.balanceOf.call(me, function(error, balance) {
    res_string += "PT.pos1.balance(me): " + balance + "\n";
  });
  return res_string;
}
function log_info(title) {
    console.log("\n\nInfo: " + title);
}
function log_big(title) {
    console.log("\n\n******* " + title + " *******");
}
var RES = {
  FAIL: "fail",
  SUCC: "succ"
}
function fail(call){
  assertEquals(call, RES.FAIL);
}
function succ(call){ //xD
  assertEquals(call, RES.SUCC);
}
function assertEquals(actual, expected, reason) {
    if (actual !== expected) {
        formatError(actual, expected, reason);
    }
}
function assertNotEquals(actual, expected, reason) {
    if (actual === expected) {
        formatError(actual, expected, reason);
    }
}

function formatError(actual, expected, reason) {
  throw "\nActual: " + actual.toString() + " type: " + typeof(actual) +
    "\nExpected: " + expected.toString() + " type: " + typeof(expected) +
    "\n" + (reason === "" ? "" : reason + " ... FAIL");
}
function sleep(ms) {
    var date = new Date();
    var curDate = null;
    do {
        curDate = new Date();
    }
    while (curDate - date < ms);
}
