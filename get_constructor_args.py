#!/usr/bin/env python
 # -*- coding: utf-8 -*-
import json
import sys

with open(sys.argv[1]) as data_file:
    data = json.load(data_file)

    for item in data:
        if (item["type"] == "constructor"):
            print len(item["inputs"])
            sys.exit(0)

    # This ABI has no constructor
    print 0
