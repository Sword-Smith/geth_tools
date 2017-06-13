#!/bin/bash
outdir="out"
tmc_path="../Daggerc/solidity/Tmc4.sol"
TC_path="../Daggerc/examples/NewScaleAndExp.bahr"
con_exe_path="./test/contract_execution/con_exec_NewScaleAndExp.js"

rm -rf $outdir
./compile_and_deploy.pl $outdir $tmc_path 1000 "'EUR'" 0 "'EUR'"
./compile_and_deploy.pl $outdir $tmc_path 1000 "'USD'" 0 "'USD'"
./compile_and_deploy.pl $outdir $TC_path
./run_code.pl $outdir $con_exe_path
sleep 120
./run_code.pl $outdir $con_exe_path
./run_code.pl $outdir $con_exe_path
