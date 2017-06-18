# geth_tools

## WARNING
THIS IS INTENDED FOR RUNNING A LOCAL VERSION OF ETHEREUM FOR TESTING PURPOSES.
IT HAS NOT BEEN TESTED HOW THIS SOFTWARE INTERACTS WITH THE REAL BLOCKCHAIN.
DO NOT USE THIS ON A COMPUTER THAT RUNS A REAL ETHEREUM NODE SINCE YOU MAY RISK
LOSING YOUR PRIVATE KEYS IF YOU DO NOT KNOW WHAT YOU ARE DOING!

# About
Tools to avoid having to work in the Geth console directly

# Install
Currently we support OS X and Linux!

## Prerequisite
1. Geth (https://github.com/ethereum/go-ethereum/wiki/geth)
2. DaggerC (https://github.com/Sword-Smith/Daggerc)
3. solc

-- Alternatively run the install_on_linux bash script

To set up geth_tools

1. Clone repo
2. Run "initialize_genesis_block.pl"
3. Run "run_geth.pl"

Now a fully configured geth instance should be running.

Solidity and Dagger contracts can now be deployed by running compile_and_deploy.pl

# How to use it

Make sure a Geth client is running by starting the program ./run_geth.pl

Compile and deploy to a local version of the Ethereum blockchain:
./compile_and_deploy.pl \<outdir\> \<source_code\>

Run methods on the deployed smart contract:
./run_code.pl \<outdir\> \<javascript_to_execute\>

So a smart contract can be deployed and executed without having to intereact
with the geth console.

## JavaScript Code Execution
When writing JavaScript to execute, the deployed smart contracts are
automatically put into scope. They may be referred to as "<contract_name>\_",
i.e., the contract name followed by an underscore. If the deployed contract has
a constructor which has an argument with the name "tokenSymbol" or
"dataFeedSymbol", the value of this constructor (which is set when executing
compile_and_deploy.pl) will be part of the variable name such that this smart
contract is referred to as \<contract_name>\_\<tokenSymbol\> or
\<contract_name\>\_\<dataFeedSymbol\> in the JavaScript. This is to allow the
user to interact with several contracts of the same type but with different
symbols, such as token contracts or data feed contracts.

## Precompiler for Solidity and Dagger
./deploy_and_compile.pl contains a precompiler. This means that you when
defining smart contracts can use keywords to access addresses of other smart
contracts. The keyword "\_address\_my\_" will be substituted with your own
Ethereum address. The keyword "\_address\_\<contract\_name\>_" will be
substituted with the address of a contract that you have alread deployed.
\<contract\>\_\<name\> uses the same naming convention as the JavaScript does,
as described in the section above.
