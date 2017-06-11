#!/bin/bash
outdir="out"
tmc_path="../Daggerc/solidity/Tmc4.sol"
DF_path="../Daggerc/solidity/DataFeed0.sol"
TC_path="../Daggerc/examples/TestObs0.bahr"
con_exe_path="./test/contract_execution/con_exec_DataFeed0_with_DC.js"

rm -rf $outdir
./compile_and_deploy.pl $outdir $tmc_path 1000 "'EUR'" 0 "'EUR'"
./compile_and_deploy.pl $outdir $DF_path
./compile_and_deploy.pl $outdir $TC_path
./run_code $outdir $con_exe_path
