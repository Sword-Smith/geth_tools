#!/usr/bin/env perl
use v5.24;

use feature qw(signatures);
no warnings qw(experimental::signatures);

use Cwd;
use File::Basename; # Provides access to basename subroutine
use File::HomeDir;
use Path::Tiny qw(path);

sub usage(){
    die "Usage: compile <outdir> <source file> [arg0 of constructor] [arg1 of constructor] ...";
}

my $outdir                            = $ARGV[0] // usage();
my $gen_js_dir                        = "$outdir/auto_generated_js";
my $datadir                           = ".ethereum_testserver_data"; # Also hardcoded in run_geth.pl
my $constructor_args_script           = "get_constructor_args.py";
my $save_json_of_results              = "save_json_of_results.py";
my $find_any_address_constructor_args = "find_any_address_constructor_args.py";
my $requried_arguments_offset         = 2;
my $tool_dir                          = "tools";
my $password_fn                       = "password.txt";
my $current_dir                       = getcwd();
my $system_platform                   = `uname`; #DEVFIX
chomp $system_platform;

system("mkdir -p $outdir");
system("mkdir -p $gen_js_dir");

my $home = File::HomeDir->my_home();
my $ipcpath;
if ( $system_platform eq "Linux" ){
    $ipcpath = "$home/.ethereum/geth.ipc";
} elsif ( $system_platform eq "Darwin" ){
    $ipcpath = "$home/Library/Ethereum/geth.ipc";
} else {
    die "The system platform is not Linux or Darwin, we only support one of these";
}

# Check that the source code file is provided
usage() if scalar @ARGV < $requried_arguments_offset;

# Check that the source code file exists
unless ( -e $ARGV[1]) {
    die "Source file $ARGV[1] was not found.";
}

# Get own Ethereum address
open( my $fh, "<", "my_address"); # DEVNOTE: Is it smart to hardcode my_address filename?
my $my_address = <$fh>;
close $fh || die;


say $my_address;

# In the next step, we call a python script to find an address
# Perhaps we can reuse the Python script for now and then later port that to Perl?
# Given a constructor argument matching _address.*, we seek the corresponding address
# So we want to loop through all arguments except the first two
# BUT in the origninal BASH script, strings beginning with _address_ within the source
# code are also replaced. Here, we only replace those which are given in the command line.
my %name2address = ();
for my $arg (@ARGV[2..scalar @ARGV - 1]){
    if ( $arg =~ /^_address_(.*)/ ){
        my $address = `python $find_any_address_constructor_args $outdir $arg`;
        $name2address{$1} = $address;
    }
}

# Precompile source code by replacing keywords with addresses. Also create backup.
my $source_fn = $ARGV[1];
system("cp $source_fn $source_fn"."_backup");
my $file = path($source_fn);
my $data = $file->slurp_utf8;
open( $fh, "+<", $source_fn );
while( my $line = <$fh> ){
    chomp $line;
    if ( $line =~ /_address_([^\s]*)/ ){
        my $address = `python $find_any_address_constructor_args $outdir _address_$1`;
        $data =~ s/_address_$1/$address/g;
    }
}
close( $fh );
$file->spew_utf8($data);

# Do Check that .sol file names are capitalized and do the actual calculation
# by invoking solc/daggerc.
$source_fn =~ /(.*?\.)(.*)$/;
my $file_ext = $2;
my $basename = basename("$source_fn");
if ( $file_ext eq "sol" ){
    die "File name of a Solidity file must begin with a capital letter." if $basename =~ /^(?i)[a-z0-9](?-i)/;
    system("solc -o $outdir --abi --bin --overwrite $source_fn");
} elsif ( $file_ext ~~ [ qw(bahr dag) ] ){
    system("daggerc -o $outdir $source_fn");
} else {
    die "This program only supports .dag and .sol source files";
}

# Find filenames
my $abi_def_fn = "$outdir/$bn.abi"
my $abi_source = path($abi_def_fn)->slurp; # Store the whole file content in $abi_source
my $bin_fn     = "$outdir/$bn.bin"
open( $fh, "<", $bin_fn );
my $bin        = <$fh> // die "Unable to read the produced binary file $bin_fn";
$bin           = "0x" . $bin;

# DEVNOTE: Is $abi_source needed here? How do we count the number of required arguments?
# We have a Python scipt for that but it is also possible in Perl.
