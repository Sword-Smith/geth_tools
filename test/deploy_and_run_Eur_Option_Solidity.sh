
#!/bin/bash
outdir="out"
tmc_path="../Heather/solidity/Tmc4.sol"
TC_path="../Heather/solidity/Eur_option.sol"
DF_path="../Heather/solidity/DataFeed0.sol"
con_exe_path="test/contract_execution/con_exec_Eur_Option_Solidity.js"
my_address=$(cat my_address)

rm -rf $outdir
tmc_addr=$(./compile_and_deploy $outdir $tmc_path 1000 "'EUR'" 0 "'EUR'")
echo "TMC ADDR"
echo $tmc_addr
df_addr=$(./compile_and_deploy $outdir $DF_path)
echo "DF ADDR"
echo $df_addr
./compile_and_deploy $outdir $TC_path $tmc_addr $df_addr "'0x0000000000000000000000000000000000000000'" $my_address
./run_code $outdir $con_exe_path
sleep 180
./run_code $outdir $con_exe_path
