#!/bin/bash
outdir="out"
tmc_path="../Daggerc/solidity/Tmc4.sol"
DF_path0="../Daggerc/solidity/DataFeedBool1.sol"
DF_path1="../Daggerc/solidity/DataFeedBool1.sol"
DF_path2="../Daggerc/solidity/DataFeedBool1.sol"
TC_path="../Daggerc/examples/TestCanonicalNestedBahr.bahr"
con_exe_path="./test/contract_execution/con_exec_TestCanonicalNestedBahr.js"

rm -rf $outdir
./compile_and_deploy.pl $outdir $tmc_path 1000 "'EUR'" 0 "'EUR'"
./compile_and_deploy.pl $outdir $DF_path0 "'ZERO'"
./compile_and_deploy.pl $outdir $DF_path1 "'ONE'"
./compile_and_deploy.pl $outdir $DF_path2 "'TWO'"
./compile_and_deploy.pl $outdir $TC_path
./run_code $outdir $con_exe_path
sleep 120
./run_code $outdir $con_exe_path
sleep 60 
./run_code $outdir $con_exe_path
