#!/usr/bin/env python
# -*- coding: utf-8 -*-
# sys.argv[1] is outdir
# DEVFIX: Add better error handling here!

import json
import sys

json_fn = sys.argv[1] + "contracts.json"

def get_address():
    with open(json_fn, "r") as fh:
        data = json.load(fh)
        finalResult = []
        i=0

        for item in data:
            finalResult.append([])

            finalResult[i].append(item["address"])
            finalResult[i].append(item["name"])

            ts =  filter(lambda x:x["name"] == "tokenSymbol", item["args"])

            if len(ts) == 1:
                finalResult[i].append(ts[0]["value"])
            i+=1

        for item in finalResult:
            print " ".join(item)

if __name__ == '__main__':
    get_address()
