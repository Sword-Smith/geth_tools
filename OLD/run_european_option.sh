#!/bin/bash

rm -f out/contracts.json
./compile_and_deploy.pl out/ example/Erc20.sol "'Dai'" "'DAI'" 0 20000
./compile_and_deploy.pl out/ example/DataFeed0.sol
./compile_and_deploy.pl out/ example/European_option.dag
./run_code.pl out example/european_option.js
