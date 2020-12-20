#!/bin/bash
set -e # Halt on error

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset'" "'CHF'" 0 20000 > /dev/null
./compile_and_deploy.pl out BatchBalanceChecks/BatchBalanceChecks.dag > /dev/null
# prepend lib to every test-set
cat lib.js BatchBalanceChecks/BatchBalanceChecks.js > out/test.js
./run_code.pl out out/test.js
