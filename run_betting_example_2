#!/usr/bin/env bash
set -e

rm -f out/contracts.json

echo $PWD
sleep 1

sleep 1
./compile_and_deploy.pl out/ example/Erc20.sol "'CHF'" "'CHF'" 2 200000
sleep 1
./compile_and_deploy.pl out/ example/DataFeed0.sol
sleep 1
./compile_and_deploy.pl out/ example/BettingExample2.dag
sleep 1
./run_code.pl out example/executeBettingExample2.js
