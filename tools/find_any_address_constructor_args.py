#!/usr/bin/env python
 # -*- coding: utf-8 -*-
import json
import sys

with open(sys.argv[1]+"/contracts.json") as data_file:
    data = json.load(data_file)
    contract_name = sys.argv[2][9:].split('_')

    for contract in data:
        if ( contract_name[0] == contract["name"]):
            mcs= filter(lambda x:x["name"]=="tokenSymbol", contract["args"])
            if len(mcs) == 1:
                if (mcs[0]["value"] == contract_name[1]):
                    print contract["address"]
            elif len(mcs) == 0:
                print contract["address"]
            else: 
                sys.exit(1)
