#!/usr/bin/env perl
use v5.22;

use File::HomeDir;
use Net::Address::IP::Local;

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

my $own_ip = Net::Address::IP::Local->public();

# Open geth and mine, pipe output to /out/error.log
system("geth --fast --cache 512 --ipcpath $ipcpath --networkid 42 --port 30301 --rpc --rpcaddr $own_ip --rpcport 30302 --datadir ./.ethereum_testserver_data --jspath ./scripts/ --mine --minerthreads=1 console 2>> ./out/error.log");
