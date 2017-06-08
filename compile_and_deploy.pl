#!/usr/bin/env perl
use v5.24;

use feature qw(signatures);
no warnings qw(experimental::signatures);

use Cwd;
use File::Basename; # Provides access to basename subroutine
use File::HomeDir;

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

my $source_fn = $ARGV[1];
$source_fn =~ /(.*?\.)(.*)$/;
my $file_ext = $2;
my $basename = basename("$source_fn");

# Get own Ethereum address
open( my $fh, "<", "my_address"); # DEVNOTE: Is it smart to hardcode my_address filename?
my $my_address = <$fh>;


say $my_address;

# In the next step, we call a python script to find an address
# Perhaps we can reuse the Python script for now and then later port that to Perl?
