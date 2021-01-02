s#!/bin/bash
set -e # Halt on error

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset0'" "'DAI'" 0 20000 > /dev/null
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset1'" "'GOLEM'" 0 20000 > /dev/null
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset2'" "'AGI'" 0 20000 > /dev/null
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset3'" "'LINK'" 0 20000 > /dev/null
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset4'" "'WBTC'" 0 20000 > /dev/null
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset5'" "'REV'" 0 20000 > /dev/null
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset6'" "'HT'" 0 20000 > /dev/null
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset7'" "'SNX'" 0 20000 > /dev/null

cp example/DataFeed2.sol example/DataFeed3.sol
sed -i 's/DataFeed2/DataFeed3/g' example/DataFeed3.sol; # compilation output comes from class name from file
cp example/DataFeed2.sol example/DataFeed4.sol
sed -i 's/DataFeed2/DataFeed4/g' example/DataFeed4.sol;
cp example/DataFeed2.sol example/DataFeed5.sol
sed -i 's/DataFeed2/DataFeed5/g' example/DataFeed5.sol;
cp example/DataFeed2.sol example/DataFeed6.sol
sed -i 's/DataFeed2/DataFeed6/g' example/DataFeed6.sol;
./compile_and_deploy.pl out example/DataFeed0.sol
./compile_and_deploy.pl out example/DataFeed1.sol
./compile_and_deploy.pl out example/DataFeed2.sol
./compile_and_deploy.pl out example/DataFeed3.sol
./compile_and_deploy.pl out example/DataFeed4.sol
./compile_and_deploy.pl out example/DataFeed5.sol
./compile_and_deploy.pl out example/DataFeed6.sol
rm example/DataFeed6.sol
rm example/DataFeed5.sol
rm example/DataFeed4.sol
rm example/DataFeed3.sol
./compile_and_deploy.pl out DeepNestedContractMultiplePayoutsMultipleAssets2/DeepNestedContractMultiplePayoutsMultipleAssets2.dag > /dev/null
# prepend lib to every test-set
cat lib.js DeepNestedContractMultiplePayoutsMultipleAssets2/DeepNestedContractMultiplePayoutsMultipleAssets2.js > out/test.js
./run_code.pl out out/test.js
