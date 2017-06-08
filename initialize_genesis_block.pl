#!/usr/bin/env perl
use v5.24;

use feature qw(signatures);
no warnings qw(experimental::signatures);
use experimental 'smartmatch';

my $genesis_fn = "./testserver_genesis.json";
my $datadir    = ".ethereum_testserver_data/";
my $keystore   = "$datadir/keystore";
my $outdir     = "out/";

sub execute ($verbose){
    system("rm -r $datadir");
    say "Creating new genesis block from $genesis_fn:" if $verbose;
    system("geth --datadir $datadir init $genesis_fn");

    # Here the Ethereum address is generated
    say "Creating new account:" if $verbose;
    my $out = system("geth --datadir $datadir --password password.txt account new");

    system("rm -rf $outdir");
    system("mkdir $outdir");

    # Find address and write it to text file my_address
    opendir my($dh), $keystore or die "Couldn't open dir '$keystore': $!";
    my @files = grep {$_ ne "." && $_ ne ".."} readdir $dh;
    closedir $dh;
    die "Wrong number of keys found in '$keystore'. Found " . scalar @files unless scalar @files == 1;
    # Do a regex match on the file name to find the address.
    my $address_fn = $files[0];
    $address_fn =~ /([a-f0-9]+)$/ || die "File name not recognized";
    open( my $fh, ">", "my_address");
    print $fh "0x$1"; #writes generated Ethereum address to text file my_address
    close $fh || die "Failed to close";
}

if ( scalar @ARGV == 1 && $ARGV[0] ~~ [qw( --force -f )] ){
    execute(0);
    exit(0);
}

say "Are you sure you wish to delete any existing blockchain data and *ALL PRIVATE KEYS*? Y/N";
my $prompt = <STDIN>;
chomp $prompt;

if ( $prompt ~~ [qw(Y y)]){
    execute(1);
    exit(0);
}

say "No action taken. Exiting";
exit(0);
