#!/usr/bin/env python3
import json
import re

def convert_tab_separated_to_json(input_file, output_file):
    # Define the field names based on the latest JSON structure
    field_names = ["kdpn", "kdpp", "kdkp","nmkp", "aktif"]

    # Read the tab-separated data
    with open(input_file, 'r', encoding='utf-8') as infile:
        lines = infile.readlines()

    # Convert each line to a dictionary
    data = []
    for line in lines:
        values = line.strip().split('\t')
        if len(values) == len(field_names):
            entry = dict(zip(field_names, values))
            data.append(entry)
        else:
            print(f"Skipping line due to incorrect number of columns: {line.strip()}")

    # Write the JSON output
    with open(output_file, 'w', encoding='utf-8') as outfile:
        json.dump(data, outfile, ensure_ascii=False, indent=2)

    print(f"Conversion complete. JSON data written to {output_file}")

# Example usage
if __name__ == "__main__":
    input_file = "src/data/keg_prioritas.json"
    output_file = "src/data/keg_prioritas_fixed.json"
    convert_tab_separated_to_json(input_file, output_file)
