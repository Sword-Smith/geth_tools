#!/bin/bash
set -e # Halt on error

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset'" "'CHF'" 0 20000 > /dev/null
./compile_and_deploy.pl out example/DataFeed0.sol > /dev/null
./compile_and_deploy.pl out example/DataFeed1.sol > /dev/null
./compile_and_deploy.pl out BatchTransferChecks/BatchTransferChecks.dag > /dev/null
# prepend lib to every test-set
cat lib.js BatchTransferChecks/BatchTransferChecks.js > out/test.js
./run_code.pl out out/test.js
