#!/bin/bash
set -e

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset'" "'CHF'" 0 20000 > /dev/null
./compile_and_deploy.pl out example/DataFeed0.sol
./compile_and_deploy.pl out example/DataFeed1.sol
./compile_and_deploy.pl out example/DataFeed2.sol
./compile_and_deploy.pl out SafeMul/SafeMul.dag
cat lib.js SafeMul/SafeMul.js > out/test.js
./run_code.pl out out/test.js
