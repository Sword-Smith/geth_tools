function l(a){
  console.log(a);
}
function get_transaction(b_A){
  t0_A = web3.eth.getTransaction(b_A);
  while (t0_A.blockNumber === null) {
      t0_A = web3.eth.getTransaction(b_A);
  }

  // Check if transaction reverted
  var rec = web3.eth.getTransactionReceipt(b_A);

  // rec.status should be "0x1" for success and "0x0" for failure
  var statusCode = parseInt(rec.status);
  if (!statusCode) {
    throw b_A + " was reverted";
  }
}
function do_set(dataFeed, num) {
  try {
    get_transaction(dataFeed.set(0, num));
  } catch (error) {return RES.FAIL;} return RES.SUCC;
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

function do_pay(contract) {
  try {
    get_transaction(pay = contract.pay());
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

function do_transfer(contract, from, to, id, value) {
  try {
    get_transaction(contract.safeTransferFrom(from, to, id, value, 0));
  } catch (error) {return RES.FAIL;} return RES.SUCC;
}

function do_implicit_transfer(contract, from, to, id, value, caller) {
  try {
    get_transaction(contract.safeTransferFrom(from, to, id, value, 0, { from: caller, gas: 3000000 }));
  } catch (error) {console.log(error); return RES.FAIL;} return RES.SUCC;
}

function do_setApprovalForAll(contract, operator, approved, caller) {
  try {
    get_transaction(contract.setApprovalForAll(operator, approved, { from: caller, gas: 3000000 }));
  } catch (error) {console.log(error); return RES.FAIL;} return RES.SUCC;
}

function do_isApprovedForAll(contract, owner, operator) {
  return contract.isApprovedForAll(owner, operator);
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
function fail(call, reason){
  assertEquals(call, RES.FAIL, reason);
}
function succ(call, reason){ //xD
  assertEquals(call, RES.SUCC, reason);
}
function assertEquals(actual, expected, reason) {
    if (actual !== expected) {
        formatError(actual, expected, reason);
    } else {
        formatSuccess(reason);
    }
}
function assertNotEquals(actual, expected, reason) {
    if (actual === expected) {
        formatError(actual, expected, reason);
    } else {
      formatSuccess(reason);
    }
}

function formatSuccess(reason) {
  console.log("\x1b[32m" + " ✓ " + reason + "\x1b[0m");
}

function formatError(actual, expected, reason) {
  throw "\x1b[31m\nActual: " + actual.toString() + " type: " + typeof(actual) +
    "\nExpected: " + expected.toString() + " type: " + typeof(expected) +
    "\n" + (reason === "" ? "" : reason + " ... FAIL\x1b[0m");
}

function sleep(ms) {
    var date = new Date();
    var curDate = null;
    do {
        curDate = new Date();
    }
    while (curDate - date < ms);
}
