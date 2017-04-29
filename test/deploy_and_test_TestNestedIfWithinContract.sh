#!/bin/bash
outdir="out"
tmc_path="../Heather/solidity/Tmc4.sol"
DF_path="../Heather/solidity/DataFeedBool0.sol"
TC_path="../Heather/examples/TestNestedIfWithin.bahr"
con_exe_path="./test/contract_execution/con_exec_DataFeedBool0_with_Nested_WithinDC.js"

rm -rf $outdir
./compile_and_deploy $outdir $tmc_path 1000 "'EUR'" 0 "'EUR'"
./compile_and_deploy $outdir $DF_path
./compile_and_deploy $outdir $TC_path
./run_code $outdir $con_exe_path
./run_code $outdir $con_exe_path
