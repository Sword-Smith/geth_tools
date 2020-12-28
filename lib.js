function l(a){
  console.log(a);
}

function get_transaction(b_A){
  t0_A = web3.eth.getTransaction(b_A);
  while (t0_A.blockNumber === null) {
      t0_A = web3.eth.getTransaction(b_A);
  }

  // Print data sent in transaction
  //console.log(t0_A.input);

  // Check if transaction reverted
  var rec = web3.eth.getTransactionReceipt(b_A);

  // rec.status should be "0x1" for success and "0x0" for failure
  var statusCode = parseInt(rec.status);
  if (!statusCode) {
    console.log(b_A + " was reverted");
    throw b_A + " was reverted";
  }

  return rec;
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
function do_approve_on(approveAmount, erc20Contract, spenderAddress) {
  try {
    b_A = erc20Contract.approve(spenderAddress, approveAmount, {
      from: me,
      gas: 3000000
    });
    t0_A = web3.eth.getTransaction(b_A);
    while (t0_A.blockNumber === null) {
      t0_A = web3.eth.getTransaction(b_A);
    }
    erc20Contract.allowance.call(me, contract_address,
      function(error, allowance) {
        assertEquals(allowance, approveAmount, "Check allowance after correct approve call..");
      });
    } catch (error) {return RES.FAIL;} return RES.SUCC;
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

function do_batch_transfer(contract, from, to, ids, values) {
  try {
    get_transaction(contract.safeBatchTransferFrom(from, to, ids, values, 0));
  } catch (error) {return RES.FAIL;} return RES.SUCC;
}

function do_implicit_batch_transfer(contract, from, to, ids, values, caller) {
  try {
    get_transaction(contract.safeBatchTransferFrom(from, to, ids, values, 0, { from: caller, gas: 3000000 }));
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

function assert(condition, reason) {
  if (condition) {
    formatSuccess(reason);
  } else {
    formatError(condition, !condition, reason);
  }
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

function assertArrayEquals(actual, expected, reason) {
  if (actual.length !== expected.length) {
    formatArrayError(actual, expected, reason);
  }

  for (var i = 0; i < actual.length; i++) {
    if (actual[i] !== expected[i]) {
      formatArrayError(actual, expected, reason);
    }
  }

  formatSuccess(reason);
}

function assertAddressEquals(actual, expected, reason) {
  var avoidZeroPadding = new RegExp('^0x0*');
  var actualNoPadding = actual.replace(avoidZeroPadding, '0x');
  assertEquals(actualNoPadding, expected, reason);
}

function formatSuccess(reason) {
  console.log("\x1b[32m" + " ✓ " + reason + "\x1b[0m");
}

function formatError(actual, expected, reason) {
  throw "\x1b[31m\nActual: " + actual.toString() + " type: " + typeof(actual) +
    "\nExpected: " + expected.toString() + " type: " + typeof(expected) +
    "\n" + (reason === "" ? "" : reason + " ... FAIL\x1b[0m");
}

function formatArrayError(actual, expected, reason) {
  var actualS = "[ " + actual.join(", ") + " ]";
  var expectedS = "[ " + expected.join(", ") + " ]";
  formatError(actualS, expectedS, reason);
}

function sleep(ms) {
    var date = new Date();
    var curDate = null;
    do {
        curDate = new Date();
    }
    while (curDate - date < ms);
}
