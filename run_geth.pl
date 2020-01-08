#!/usr/bin/env perl
use v5.22;

use File::HomeDir;
#use Net::Address::IP::Local;

my $system_platform = `uname`; # Runs uname and stores the output in var
chomp $system_platform;

my $home = File::HomeDir->my_home();
my $ipcpath;
if ( $system_platform eq "Linux" ){
    $ipcpath = "$home/.ethereum/geth.ipc";
} elsif ( $system_platform eq "Darwin" ){
    $ipcpath = "$home/Library/Ethereum/geth.ipc";
} else {
    die "The system platform is not Linux or Darwin, we only support one of these";
}

# Comment out own_ip to fix Truffle compliance
# Truffle could prob. also be fixed to work with this, but this seemed easier.
#my $own_ip = Net::Address::IP::Local->public();

# Open geth and mine, pipe output to /out/error.log
system("mkdir -p out");
system("geth --dev --nousb --cache 512 --ipcpath $ipcpath --networkid 42 --port 30301 --rpc --rpcport 30302 --rpcaddr localhost --rpccorsdomain '*' --rpcapi 'eth,net,web3' --datadir ./.ethereum_testserver_data --jspath ./scripts/ --allow-insecure-unlock console");
