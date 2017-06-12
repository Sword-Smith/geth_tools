#!/usr/bin/env perl
use v5.24;

use File::HomeDir; # To get homedir

my $password_fn               = "password.txt";
my $required_arguments_offset = 2;
my $outdir                    = $ARGV[0];
my $system_platform           = $^O;

# Load password
open( my $fh, "<", $password_fn ) || die;
my $password = <$fh>;
chomp $password;
close( $fh ) || die;

if ( scalar @ARGV < $required_arguments_offset ){
    die "Usage: run_code <outdir> <file to execute>";
}

my $home = File::HomeDir->my_home();
my $ipcpath;
if ( $system_platform eq "linux" ){
    $ipcpath = "$home/.ethereum/geth.ipc";
} elsif ( $system_platform eq "darwin" ){
    $ipcpath = "$home/Library/Ethereum/geth.ipc";
} else {
    die "The system platform is not Linux or Darwin, we only support one of these";
}

