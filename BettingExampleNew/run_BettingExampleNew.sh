#!/bin/bash
set -e

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset'" "'CHF'" 0 500000 > /dev/null
./compile_and_deploy.pl out example/DataFeed0.sol > /dev/null
./compile_and_deploy.pl out BettingExampleNew/BettingExampleNew.dag > /dev/null

# read -p "Contracts published. Press key to run test."
cat lib.js BettingExampleNew/BettingExampleNew.js > out/test.js
./run_code.pl out out/test.js
