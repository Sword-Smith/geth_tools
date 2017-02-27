#!/usr/bin/env python
# -*- coding: utf-8 -*-
# sys.argv[1] is outdir
# sys.argv[2] is name of the deployed contract (file name and constructor name)
# sys.argv[3] is token symbol
# DEVFIX: Add better error handling here!

import json
import sys

json_fn   =sys.argv[1] + "contracts.json"
abi_def_fn=sys.argv[1] + sys.argv[2] + ".sol:" + sys.argv[2] + ".abi"

def get_address():
    with open(json_fn, "r") as fh:
        data = json.load(fh)
        for item in data:
            target = filter( lambda x: x["name"] == "tokenSymbol" and x["value"] == sys.argv[3], item["args"] )
            if (len(target) == 1):
                print "address: " + item["address"]
                return
            if (len(target) > 1):
                print "ambiguous argument names recorded in " + json_fn
                sys.exit(1)
        print "ERROR: data for deployed contract " + sys.argv[2] + ", " + sys.argv[3] + " not found!"
        sys.exit(1)

def get_abi_definition():
    with open(abi_def_fn) as fh:
        print "ABI_DEF: " + fh.read()

get_address()
get_abi_definition()
