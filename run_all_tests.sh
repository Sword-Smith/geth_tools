#!/bin/bash
set -e # Halt on error

./SafeAdd/run_SafeAdd.sh
./SafeSub/run_SafeSub.sh
./SafeMul/run_SafeMul.sh &&
./SafeDiv/run_SafeDiv.sh &&
./ActivationChecks/run_ActivationChecks.sh
./BalanceChecks/run_BalanceChecks.sh
./MintChecks/run_MintChecks.sh
./TransferChecks/run_TransferChecks.sh
./BatchTransferChecks/run_BatchTransferChecks.sh
./BatchBalanceChecks/run_BatchBalanceChecks.sh
# ./run_InputValidation.sh &&
# ./run_BettingExampleNewScale.sh &&
# ./run_BettingExampleNew.sh
