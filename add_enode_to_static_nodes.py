import json
import sys
import re
import os
import os.path

FILENAME = ".ethereum_testserver_data/static-nodes.json"

def main(argv):
    if re.match("enode://[a-f0-9]{128}@(\\d{1,3}\\.){3}\\d{1,3}:\\d{1,5}", argv[1]):
        if os.path.isfile(FILENAME):
            with open(FILENAME, "r+") as data_file:
                data = json.load(data_file)
                data.append(argv[1])

                data_file.seek(0)
                data_file.truncate() # Clear file

                json.dump(data, data_file)
            return
        with open(FILENAME, "w") as data_file:
            json.dump([argv[1]], data_file)
    else:
        exit("Invalid enode format")

if __name__ == '__main__':
    main(sys.argv)
