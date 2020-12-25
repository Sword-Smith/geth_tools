#!/bin/bash
set -e

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset'" "'CHF'" 0 20000
./compile_and_deploy.pl out example/DataFeed0.sol
./compile_and_deploy.pl out example/DataFeed1.sol
./compile_and_deploy.pl out SafeSub/SafeSub.dag
# prepend lib to every test-set
cat lib.js SafeSub/SafeSub.js > out/test.js
./run_code.pl out out/test.js
