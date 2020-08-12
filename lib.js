function l(arg){
  console.log(arg);
}

function do_pay(contract, contract_address) {
  log_info("Calling pay() on DC");
  try {
      pay = contract.pay();
      console.log(pay);
      sleep(2000)
      pay_tx = web3.eth.getTransaction(pay);
      while (pay_tx.blockNumber === null) {
          sleep(2000)
          pay_tx = web3.eth.getTransaction(pay);
      }
  } catch (error) {
      console.error(error);
  }
  printBalances(contract_address);
}

function do_activate(contract, contract_address, num) {
  log_info("Calling activate(" + num + ") on DC");
  b_A = contract.activate(num);
  t0_A = web3.eth.getTransaction(b_A);
  while (t0_A.blockNumber === null) {
      t0_A = web3.eth.getTransaction(b_A);
  }
  printBalances(contract_address);
}

function do_set (dataFeed, price) {
  var ret = dataFeed.set(0, price);
  t0_A = web3.eth.getTransaction(ret);
  while (t0_A.blockNumber === null) {
      t0_A = web3.eth.getTransaction(ret);
  }
}

function do_approve(validApproveAmount, gas_amount, contract, contract_address) {
  log_info("Calling approve(" + validApproveAmount + ") on SA");
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
  printBalances(contract_address);
}

function printBalances(contract_address) {
    Erc20_CHF.balanceOf.call(me, function(error, balance) {
        console.log("My balance on token contract CHF is: " + balance)
    });
    Erc20_CHF.balanceOf.call(contract_address, function(error, balance) {
        console.log("Derivative contract balance on token contract CHF is: " + balance)
    });
    Erc20PartyToken_pos0.balanceOf.call(me, function(error, balance) {
        console.log("PT.pos0.balance(me): " + balance)
    });
    Erc20PartyToken_pos1.balanceOf.call(me, function(error, balance) {
        console.log("PT.pos1.balance(me): " + balance)
    });
}

function log_info(title) {
    console.log("\n\nInfo: " + title);
}

function log_big(title) {
    console.log("\n\n******* " + title + " *******");
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
        "\n" +
        (reason === "" ? "" : reason + " ... FAIL");
}

function sleep(ms) {
    var date = new Date();
    var curDate = null;
    do {
        curDate = new Date();
    }
    while (curDate - date < ms);
}
