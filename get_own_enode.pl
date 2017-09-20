#!/usr/bin/env perl
use v5.22;

use experimental 'smartmatch';

use Net::Address::IP::Local;

my $outdir       = "out";
my $error_log_fn = "$outdir/error.log";

my $own_ip = Net::Address::IP::Local->public();

open( my $fh, "<", $error_log_fn);

while( my $line = <$fh> ){
    chomp $line;

    # Find one string that looks like the enode and print it.
    if ( $line =~ /enode:/ ){
        my @elems = grep { $_ =~ /enode:\/\// } (split /\s+/, $line);
        die "Error!" if scalar @elems != 1;
        my $enode_string = $elems[0];

        # Replace local IP with the public IP
        $enode_string =~ /enode:\/\/([a-f0-9]+)\@.*?(:[0-9]+)/;
        say "$1\@$own_ip:$2";
        exit(0);
    }
}

die "No enode found in $error_log_fn";
