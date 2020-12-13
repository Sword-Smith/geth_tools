web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
other = web3.eth.accounts[1];
var thirdAddress = web3.eth.accounts[2];

web3.eth.sendTransaction({to:other, from:me, value:web3.toWei("0.5", "ether")});

var contract = ApprovalChecks_;
var contract_address = contract.address;
log_big("ApprovalChecks_ test.");

// function do_setApprovalForAll(contract, operator, approved, caller) {
// function do_isApprovedForAll(contract, owner, operator) {

assertEquals(do_isApprovedForAll(contract, me, other), false, "Other is not approved by default.");
assertEquals(do_isApprovedForAll(contract, other, me), false, "I am not approved by other by default.");

succ(do_setApprovalForAll(contract, other, false, me), "Allow call to set approval with false");
assertEquals(do_isApprovedForAll(contract, me, other), false, "Other is not approved by call made with false value.");
assertEquals(do_isApprovedForAll(contract, other, me), false, "I am not approved by call made with false value.");

succ(do_setApprovalForAll(contract, other, true, me), "Allow call to set approval with true");
assertEquals(do_isApprovedForAll(contract, me, other), true, "Other *is* approved by call made with true value.");
assertEquals(do_isApprovedForAll(contract, other, me), false, "I am not approved by call made by me for other.");

succ(do_setApprovalForAll(contract, me, true, other), "Allow call from other to set approval with true");
assertEquals(do_isApprovedForAll(contract, me, other), true, "Other *is* still approved.");
assertEquals(do_isApprovedForAll(contract, other, me), true, "I *am* approved by call by other to approve me.");

succ(do_setApprovalForAll(contract, other, false, me), "Withdraw approval for other to withdraw from me.");
assertEquals(do_isApprovedForAll(contract, me, other), false, "Other is *not* approved after approval withdrawal.");
assertEquals(do_isApprovedForAll(contract, other, me), true, "I am still approved after own approval withdrawal.");

succ(do_setApprovalForAll(contract, me, false, other), "Allow call from other to withdraw approval for me");
assertEquals(do_isApprovedForAll(contract, me, other), false, "Other is *not* approved after approval withdrawal, 2nd.");
assertEquals(do_isApprovedForAll(contract, other, me), false, "I am no longer approved after other's approval withdrawal.");

// Verify that approval only applies for the right operator
succ(do_setApprovalForAll(contract, thirdAddress, true, other), "Allow other to approve thirdAddress");
assertEquals(do_isApprovedForAll(contract, me, other), false, "Other is *not* approved after approval withdrawal, 3nd.");
assertEquals(do_isApprovedForAll(contract, other, me), false, "I am no longer approved after other's approval withdrawal, 2nd.");
assertEquals(do_isApprovedForAll(contract, other, thirdAddress), true, "Third address is approved by other after successful call to setApprovalForAll.");

succ(do_setApprovalForAll(contract, thirdAddress, false, other), "Allow other to approve thirdAddress");
assertEquals(do_isApprovedForAll(contract, other, thirdAddress), false, "Third address is no longer approved by other after successful withdrawal of approval.");
