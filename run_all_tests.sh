#!/bin/bash
set -e # Halt on error

# ./run_SafeAdd.sh &&
# ./run_SafeSub.sh &&
# ./run_SafeMul.sh &&
# ./run_SafeDiv.sh &&
./ActivationChecks/run_ActivationChecks.sh
./BalanceChecks/run_BalanceChecks.sh
./MintChecks/run_MintChecks.sh
# ./run_InputValidation.sh &&
# ./run_BettingExampleNewScale.sh &&
# ./run_BettingExampleNew.sh
