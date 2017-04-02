#!/usr/bin/env python
 # -*- coding: utf-8 -*-
import json
import sys
import os

def main(outdir, contractName, fromCmd):
    if os.path.isfile(outdir+"/contracts.json"):
        with open(outdir+"/contracts.json") as data_file:
            data = json.load(data_file)
            contract_name = contractName[9:].split('_')

            for contract in data:
                if ( contract_name[0] == contract["name"]):
                    mcs= filter(lambda x:x["name"]=="tokenSymbol", contract["args"])
                    if len(mcs) == 1:
                        if (mcs[0]["value"] == contract_name[1]):
                            if (fromCmd):
                                print contract["address"]
                            else:
                                return contract["address"]
                    elif len(mcs) == 0:
                            if (fromCmd):
                                print contract["address"]
                            else:
                                return contract["address"]
                    else:
                        sys.exit(1)
    else:
        sys.exit(1)

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], True)
