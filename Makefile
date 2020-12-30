b:
	cd ../Sword && stack install
r:
	./run_geth.pl
t:
	./run_all_tests.sh

reset:
	rm -rf my_address out/ .ethereum_testserver_data/

