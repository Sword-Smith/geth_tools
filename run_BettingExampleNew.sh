#!/bin/bash

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20PartyToken.sol "'PartyToken0'" "'pos0'" 0 0
./compile_and_deploy.pl out example/Erc20PartyToken.sol "'PartyToken1'" "'pos1'" 0 0
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset'" "'CHF'" 0 20000
./compile_and_deploy.pl out example/DataFeed0.sol
./compile_and_deploy.pl out example/BettingExampleNew.dag


# read -p "Contracts published. Press key to run test."
./run_code.pl out example/BettingExampleNew.js
