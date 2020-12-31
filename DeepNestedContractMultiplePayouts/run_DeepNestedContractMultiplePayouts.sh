s#!/bin/bash
set -e # Halt on error

rm -f out/contracts.json
./compile_and_deploy.pl out example/Erc20.sol "'SettledAsset'" "'DAI'" 0 20000 > /dev/null
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
./compile_and_deploy.pl out DeepNestedContractMultiplePayouts/DeepNestedContractMultiplePayouts.dag > /dev/null
# prepend lib to every test-set
cat lib.js DeepNestedContractMultiplePayouts/DeepNestedContractMultiplePayouts.js > out/test.js
./run_code.pl out out/test.js
