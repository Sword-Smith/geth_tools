#!/usr/bin/env python
 # -*- coding: utf-8 -*-
import json
import sys

requried_arguments_offset = 3

def is_num(test):
    try:
        int(test)
        return True
    except ValueError:
        return False

def is_digit(test):
    try:
        float(test)
        return True
    except ValueError:
        return False

    # sys.argv[1] is outdir path, sys.argv[2] is basename of source file
with open( sys.argv[1] + sys.argv[2] + ".sol:" + sys.argv[2] + ".abi") as data_file:
    data = json.load(data_file)
    arg_list = []
    i=requried_arguments_offset

    for item in data:
        if (item["type"] == "constructor"):
            for constructor_args in item["inputs"]:
                temp = constructor_args

                if (is_num(sys.argv[i].strip(','))):
                    temp.update({"value": int(sys.argv[i].strip(','))})
                elif (is_digit(sys.argv[i].strip(','))):
                    temp.update({"value": float(sys.argv[i].strip(','))})
                else:
                    temp.update({"value": sys.argv[i].strip(',"\'')})

                arg_list.append(constructor_args)
                i+=1

    final_dict = {"name": sys.argv[2], "args": arg_list, "address" : sys.argv[i]}

with open(sys.argv[1] + "contracts.txt", "a") as data_out_file:
    json.dump(final_dict, data_out_file)
    data_out_file.write("\n")
