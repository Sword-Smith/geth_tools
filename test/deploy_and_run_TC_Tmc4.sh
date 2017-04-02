$outdir=../out
$tmc4_path=../../Heather/solidity/Tmc4.sol
$TC_path=../../Heather/examples/twoDifferentTranslateUsingKeywords.bahr

rm -rf $outdir
../compile_and_deploy $outdir $tmc4_path 1000 "'EUR'" 0 "'EUR'"
../compile_and_deploy $outdir $tmc4_path 1000 "'USD'" 0 "'USD'"
../compile_and_deploy $outdir $TC_path
../run_code $outdir contract_execution/twoDifferentTranslateUsingKeywords.js
sleep 3m
../run_code $outdir contract_execution/twoDifferentTranslateUsingKeywords.js
../run_code $outdir contract_execution/twoDifferentTranslateUsingKeywords.js