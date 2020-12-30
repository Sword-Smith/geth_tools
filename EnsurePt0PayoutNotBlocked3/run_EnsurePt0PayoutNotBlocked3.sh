#!/bin/bash
set -e # Halt on error

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset'" "'DAI'" 0 20000 > /dev/null
./compile_and_deploy.pl out example/DataFeed0.sol > /dev/null
./compile_and_deploy.pl out example/DataFeed1.sol > /dev/null
./compile_and_deploy.pl out example/DataFeed2.sol > /dev/null
./compile_and_deploy.pl out EnsurePt0PayoutNotBlocked3/EnsurePt0PayoutNotBlocked3.dag > /dev/null
# prepend lib to every test-set
cat lib.js EnsurePt0PayoutNotBlocked3/EnsurePt0PayoutNotBlocked3.js > out/test.js
./run_code.pl out out/test.js
