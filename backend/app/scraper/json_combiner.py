import json
from pathlib import Path
from datetime import datetime

json1_path = Path("backend") / "app" / "scraper" / "json-dump" / "bronx1-10.json"
json2_path = Path("backend") / "app" / "scraper" / "json-dump" / "bronx11-end.json"

# Load the two JSON files
with open(json1_path, "r") as f1, open(json2_path, "r") as f2:
    json1 = json.load(f1)  # Load as list
    json2 = json.load(f2)  # Load as list

# Merge lists
combined_json = json1 + json2



formatted_dump_path = Path("backend") / "app" / "scraper" / "json-dump" / f"bronx-{formatted_time}.json"

# Save the merged data
with open(formatted_dump_path, "w") as f:
    json.dump(combined_json, f, indent=4)

print("JSON files successfully merged!")
