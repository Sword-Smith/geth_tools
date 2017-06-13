#!/usr/bin/env perl
use v5.24;

use experimental 'smartmatch';
use feature qw(signatures);
no warnings qw(experimental::signatures);

use Cwd;                 # For getting the current directory
use File::Basename;      # Provides access to basename subroutine
use File::HomeDir;       # To get homedir
use Path::Tiny qw(path); # To get slurp for writing to file

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

# Create folders to store the output
system("mkdir -p $outdir");
system("mkdir -p $gen_js_dir");

# ipcpath is used when interacting with geth
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
open( my $fh, "<", "my_address");
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
    while ( $line =~ /_address_([^\s,]*)/ ){
        my $contract_name = $1;
        my $address = $contract_name eq "my" ? $my_address : `python $find_any_address_constructor_args $outdir _address_$1`;
        chomp $address;
        die "No address found for address replacement for _address_$1 in source code file $source_fn" unless $address =~ /^0x/;
        $data =~ s/_address_$contract_name/$address/g;
        $line =~ s/_address_$contract_name//; # This prevents an infinite loop by removing what has already been replaced
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

# Find all addresses for replacement in the provided arguments
my %name2address = ();
for my $arg (@ARGV[2..scalar @ARGV - 1]){
    if ( $arg =~ /^_address_(.*)/ ){
        my $address = $1 eq "my" ? $my_address : `python $find_any_address_constructor_args $outdir $arg`;
        die "No address found for address replacement for _address_$1 in source code file $source_fn" unless $address && $address =~ /^0x/;
        $name2address{$1} = $address unless exists $name2address{$1};
    }
}

# Loop over all provided arguments and replace _address arguments with addresses
my @precompiled_args = ();
for my $arg ( (@ARGV[2..scalar @ARGV - 1]) ){
    push @precompiled_args, (exists $name2address{$arg} ? $name2address{$arg} : $arg);
}
my $precompiled_args_string = join ", ", @precompiled_args;
$precompiled_args_string .= ", " if @precompiled_args;

# Define Javascript to invoke the constructor and to deploy the contract on the
# blockchain waiting for it to be mined.
my $filter_out_string = "Javascript message: ";
my $js_code = <<"EOF";
var contractObject = web3.eth.contract($abi_source);
var gas = web3.eth.estimateGas({data: '$bin' })*5;
var submittedContract = contractObject.new($precompiled_args_string {from:web3.eth.accounts[0], data:'$bin', gas: gas}, function(e, contract){
    if(!e){
        if (!contract.address){
            console.log('$filter_out_string Contract transaction sent: TransactionHash: ' + contract.transactionHash + ' waiting to be mined ...');
        }
    }
});
var t=web3.eth.getTransaction(submittedContract.transactionHash);
while( t === null || t.blockNumber === null  ){
    t=web3.eth.getTransaction(submittedContract.transactionHash);
}
console.log('$filter_out_string Transaction included in block ' + t.blockNumber );
console.log('$filter_out_string Gas provided: ' + gas);
var rcpt = eth.getTransactionReceipt(submittedContract.transactionHash);
if (rcpt.contractAddress && web3.eth.getCode(rcpt.contractAddress) != '0x'){
    console.log('$filter_out_string Contract created on address:');
    console.log(rcpt.contractAddress);
    console.log('$filter_out_string Gas used: ' + rcpt.gasUsed);
} else {
    console.log('Contract address not found. Something went wrong. Perhaps too little gas.')
}
EOF

# Write JS string to file and read password in a variable
my $js_fn = "$gen_js_dir/javascript_$fn_no_ext.js";
open( $fh, ">", $js_fn) || die;
print $fh $js_code;
close( $fh ) || die;
open( $fh, "<", $password_fn ) || die;
my $password = <$fh>;
chomp $password;
close( $fh ) || die;
# Run the produced Javascript in Geth and store the output in $op
my $geth_output = `geth --exec "personal.unlockAccount(web3.eth.accounts[0], '$password'); loadScript('$js_fn');" attach $ipcpath`;
say "output from Geth execution:\n$geth_output";

# Find address in $geth_output and store it in a JSON file
my $contract_address;
my @lines = split /\n/, $geth_output;
for my $line (@lines) {
    $contract_address = $line if $line =~ /^0x[0-9a-f]{40}$/;
    last if $contract_address;
}
die "No contract address found in output. Something went wrong" unless $contract_address;

my $exit_code = system("python '$save_json_of_results' $outdir $fn_no_ext $precompiled_args_string $contract_address");
if ( $exit_code ){
    die "FAILURE! Something went wrong. Contract $source_fn was not deployed.";
} else {
    say "SUCCESS! Contract $source_fn deployed and placed on address $contract_address.";
}
