#!/bin/bash

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset'" "'CHF'" 0 1000000 &&
./compile_and_deploy.pl out example/DataFeed0.sol &&
./compile_and_deploy.pl out BettingExampleNewScale/BettingExampleNewScale.dag &&
cat lib.js BettingExampleNewScale/BettingExampleNewScale.js > out/test.js
./run_code.pl out out/test.js
