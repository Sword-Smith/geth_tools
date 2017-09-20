#!/usr/bin/env perl
use v5.22;

use feature qw(postderef);
no warnings qw(experimental::postderef);
use experimental 'smartmatch';
use feature qw(signatures);
no warnings qw(experimental::signatures);

use File::HomeDir; # To get homedir
use JSON::Parse qw(parse_json);

my $password_fn               = "password.txt";
my $required_arguments_offset = 2;
my $outdir                    = $ARGV[0];
my $system_platform           = $^O;

sub get_deployed_contracts( $dir ) {
    open( my $fh, "<", "$dir/contracts.json" );
    local $/;
    my $data = <$fh>;
    my $json = parse_json($data);
    my @contracts = $json->@*;
    my @parsed_contracts;
    for my $contract (@contracts){
        my ($token_arg) = grep { $_->{name} eq "tokenSymbol" } $contract->{args}->@*;
        my $token_symbol = $token_arg->{value};
        my $parsed_contract = {
            name        => $contract->{name},
            address     => $contract->{address},
            tokenSymbol => $token_symbol, # May be undef
        };
        push( @parsed_contracts, $parsed_contract );
    }
    return \@parsed_contracts;
}

sub create_decs_to_add_vars_to_scope( $dir, $parsed_contracts ){
    my $var_string = "";
    for my $contract ( $parsed_contracts->@* ){
        my $contract_name = $contract->{name};
        my $address       = $contract->{address};
        my $tokenSymbol   = $contract->{tokenSymbol} // "";
        open( my $fh, "<", "$dir/$contract_name.abi");
        my $abi_def = <$fh>; # Should only be one line
        chomp $abi_def; # I think this is not needed since abi_def does not contain nl
        $var_string .=
            "var $contract_name"."_$tokenSymbol = web3.eth.contract($abi_def).at('$address');";
    }
    return $var_string;
}

if ( scalar @ARGV < $required_arguments_offset ){
    die "Usage: run_code <outdir> <file to execute>";
}

# Load password
open( my $fh, "<", $password_fn ) || die;
my $password = <$fh>;
chomp $password;
close( $fh ) || die;

# Set ipcpath
my $home = File::HomeDir->my_home();
my $ipcpath;
if ( $system_platform eq "linux" ){
    $ipcpath = "$home/.ethereum/geth.ipc";
} elsif ( $system_platform eq "darwin" ){
    $ipcpath = "$home/Library/Ethereum/geth.ipc";
} else {
    die "The system platform is not Linux or Darwin, we only support one of these";
}

# Generate string to declare variables in scope representing deployed contracts
my $deployed_contracts  = get_deployed_contracts( $outdir );
my $declarations_string = create_decs_to_add_vars_to_scope( $outdir, $deployed_contracts );

# Write the variable declaration string to a JS file
system("mkdir -p $outdir/generated_js/");
my $dec_var_fn = "$outdir/generated_js/dec_var.js"; # Is overwrited each run which is fine
open( $fh, ">", $dec_var_fn ) || die;
print $fh $declarations_string;
close( $fh ) || die;

# Get own Ethereum address
open( my $fh, "<", "my_address");
my @my_address;
while (<$fh>) {
     push @my_address, $_;
}
close $fh || die;

my $unlock_string;

for (my $i = 0; $i < scalar @my_address; $i++) {
    $unlock_string .= "personal.unlockAccount(web3.eth.accounts[$i], '$password');";
}

my $commands_fn = $ARGV[1]; # Contains the actual code (besides the var decls) to run
my $exec_output = `geth --exec "$unlock_string loadScript('$dec_var_fn'); loadScript('$commands_fn');" attach $ipcpath`;

say "output from executing JavaScript in Geth is: $exec_output";
