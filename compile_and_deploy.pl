#!/usr/bin/env perl
use v5.24;

use experimental 'smartmatch';
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
my $system_platform                   = $^O; #DEVFIX

system("mkdir -p $outdir");
system("mkdir -p $gen_js_dir");

my $home = File::HomeDir->my_home();
my $ipcpath;
if ( $system_platform eq "linux" ){
    $ipcpath = "$home/.ethereum/geth.ipc";
} elsif ( $system_platform eq "darwin" ){
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

# Precompile source code by replacing keywords with addresses. Also create backup.
my $source_fn = $ARGV[1];
system("cp $source_fn $source_fn"."_backup");
my $file = path($source_fn);
my $data = $file->slurp_utf8;
open( $fh, "+<", $source_fn );
while( my $line = <$fh> ){
    chomp $line;
    if ( $line =~ /_address_([^\s,]*)/ ){
        my $address = `python $find_any_address_constructor_args $outdir _address_$1`;
        die "No address found for address replacement for _address_$1 in source code file $source_fn" unless $address =~ /^0x/;
        $data =~ s/_address_$1/$address/g;
    }
}
close( $fh );
$file->spew_utf8($data);

# Do Check that .sol file names are capitalized and do the actual calculation
# by invoking solc/daggerc.
my $basename  = basename("$source_fn");
$basename     =~ /(.*?)\.([^.]*)$/;
my $file_ext  = $2;
my $fn_no_ext = $1;
if ( $file_ext eq "sol" ){
    die "Invalid file name, first letter must be capitalized!" unless $basename =~ /^[[:upper:]]/;
    system("solc -o $outdir --abi --bin --overwrite $source_fn");
} elsif ( $file_ext ~~ [qw(bahr dag)] ){
    system("daggerc -o $outdir $source_fn");
} else {
    die "This program only supports .sol, .dag, and .bahr file extensions";
}

# Restore the source code file 
system("cp $source_fn"."_backup $source_fn");

# Find filenames
my $abi_def_fn = "$outdir/$fn_no_ext.abi"; # DEVNOTE: Should $basename or $fn_no_ext be used here?
say $abi_def_fn;
my $abi_source = path($abi_def_fn)->slurp; # Store the whole file content in $abi_source
my $bin_fn     = "$outdir/$fn_no_ext.bin";
open( $fh, "<", $bin_fn );
my $bin        = <$fh> // die "Unable to read the produced binary file $bin_fn";
$bin           = "0x" . $bin;
close( $fh );

my $expected_number_of_args    = `python $constructor_args_script $abi_def_fn`;
my $number_of_provided_constructor_args = scalar @ARGV - $requried_arguments_offset;

if ( $expected_number_of_args != $number_of_provided_constructor_args ){
    say "Wrong number of arguments given for the constructor: Expected $expected_number_of_args but got $number_of_provided_constructor_args";
    die "Otherwise, you may also want to check that the constructor has the same name as the contract";
}

# Prepare argument string for the constructor

# Find all addresses for replacement in the provided arguments
my %name2address = ();
for my $arg (@ARGV[2..scalar @ARGV - 1]){
    if ( $arg =~ /^_address_(.*)/ ){
        my $address = $1 eq "my" ? $my_address : `python $find_any_address_constructor_args $outdir $arg`;
        die "No address found for address replacement for _address_$1 in source code file $source_fn" unless $address =~ /^0x/;
        $name2address{$1} = $address unless exists $name2address{$1};
    }
}

# Loop over all provided arguments and replace _address arguments with addresses
my $precompiled_constructor_args = "";
for my $arg ( (@ARGV[2..scalar @ARGV - 1]) ){
    $precompiled_constructor_args .= exists $name2address{$arg} ? $name2address{$arg} : $arg;
}

# DEVNOTE: Is $abi_source needed here? How do we count the number of required arguments?
# We have a Python scipt for that but it is also possible in Perl.

