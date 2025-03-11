import json
from pathlib import Path

json1_path = Path("backend") / "app" / "scraper" / "json-dump" / "manhattan1-50"
json2_path = Path("backend") / "app" / "scraper" / "json-dump" / "manhattan51-end"

# Load the two JSON files
with open("data1.json", "r") as f1, open("data2.json", "r") as f2:
    json1 = json.load(f1)  # Load as list
    json2 = json.load(f2)  # Load as list

# Merge lists
combined_json = json1 + json2

# Save the merged data
with open("merged.json", "w") as f:
    json.dump(combined_json, f, indent=4)

print("JSON files successfully merged!")
