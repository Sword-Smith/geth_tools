#!/bin/bash
outdir="out"
tmc_path="../Heather/solidity/Tmc3.sol"
TC_path="../Heather/examples/twoDifferentTranslateUsingKeywordsTmc3.bahr"
con_exe_path="test/contract_execution/twoDifferentTranslateUsingKeywordsTmc3.js"

rm -rf $outdir
./compile_and_deploy $outdir $tmc_path 1000 "'EUR'" 0 "'EUR'"
./compile_and_deploy $outdir $tmc_path 1000 "'USD'" 0 "'USD'"
./compile_and_deploy $outdir $TC_path
./run_code $outdir $con_exe_path
sleep 240
./run_code $outdir $con_exe_path
./run_code $outdir $con_exe_path
