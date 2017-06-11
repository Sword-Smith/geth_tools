#!/bin/bash
outdir="out"
tmc_path="../Daggerc/solidity/Tmc4.sol"
TC_path="../Daggerc/examples/twoDifferentTranslateUsingKeywordsTmc4.bahr"
con_exe_path="test/contract_execution/twoDifferentTranslateUsingKeywordsTmc4.js"

rm -rf $outdir
./compile_and_deploy.pl $outdir $tmc_path 1000 "'EUR'" 0 "'EUR'"
./compile_and_deploy.pl $outdir $tmc_path 1000 "'USD'" 0 "'USD'"
./compile_and_deploy.pl $outdir $TC_path
./run_code $outdir $con_exe_path
sleep 60
./run_code $outdir $con_exe_path
./run_code $outdir $con_exe_path
