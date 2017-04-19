#!/bin/bash
outdir="out"
tmc_path="../Heather/solidity/Tmc4.sol"
DF_path="../Heather/solidity/DataFeed0.sol"
TC_path="../Heather/examples/TestObs0.bahr"
con_exe_path="./test/contract_execution/con_exec_DataFeed0_with_DC.js"

rm -rf $outdir
./compile_and_deploy $outdir $tmc_path 1000 "'EUR'" 0 "'EUR'"
./compile_and_deploy $outdir $DF_path
./compile_and_deploy $outdir $TC_path
./run_code $outdir $con_exe_path
