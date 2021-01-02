s#!/bin/bash
set -e # Halt on error

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset0'" "'DAI'" 0 1100000000000000000 > /dev/null
./compile_and_deploy.pl out example/DataFeed0.sol
./compile_and_deploy.pl out ScientificNotation/ScientificNotation.dag > /dev/null
# prepend lib to every test-set
cat lib.js ScientificNotation/ScientificNotation.js > out/test.js
./run_code.pl out out/test.js
