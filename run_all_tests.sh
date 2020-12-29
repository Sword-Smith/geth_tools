#!/bin/bash
set -e # Halt on error

./SafeAdd/run_SafeAdd.sh
./SafeSub/run_SafeSub.sh
./SafeMul/run_SafeMul.sh
./SafeDiv/run_SafeDiv.sh
./ActivationChecks/run_ActivationChecks.sh
./BalanceChecks/run_BalanceChecks.sh
./MintChecks/run_MintChecks.sh
./MultipleSettlementAssets/run_MultipleSettlementAssets.sh
./PayoutLessThanMaxFactor/run_PayoutLessThanMaxFactor.sh
./EnsurePt0PayoutNotBlocked1/run_EnsurePt0PayoutNotBlocked1.sh
./EnsurePt0PayoutNotBlocked2/run_EnsurePt0PayoutNotBlocked2.sh
./EnsurePt0PayoutNotBlocked3/run_EnsurePt0PayoutNotBlocked3.sh
./TransferChecks/run_TransferChecks.sh
./BatchTransferChecks/run_BatchTransferChecks.sh
./BatchBalanceChecks/run_BatchBalanceChecks.sh
./InputValidation/run_InputValidation.sh
./BettingExampleNew/run_BettingExampleNew.sh
./BettingExampleNewScale/run_BettingExampleNewScale.sh
./PayChecks/run_PayChecks.sh
./EventChecks/run_EventChecks.sh
