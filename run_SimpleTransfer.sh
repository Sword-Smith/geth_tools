#!/bin/bash

set -e

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset'" "'CHF'" 0 20000
./compile_and_deploy.pl out example/SimpleTransfer.dag
cat lib.js example/SimpleTransfer.js > out/test.js
./run_code.pl out out/test.js
