import os
from pathlib import Path

# Method 1: Using pathlib (Recommended - works on Windows, Mac, Linux)
desktop_pathlib = Path.home() / "Desktop"
file_path_1 = desktop_pathlib / "example1.txt"

with open(file_path_1, 'w', encoding='utf-8') as f:
    f.write("Method 1: Using pathlib")

print(f"Saved using pathlib: {file_path_1}")

# Method 2: Using os.path (Alternative)
desktop_ospath = os.path.join(os.path.expanduser("~"), "Desktop")
file_path_2 = os.path.join(desktop_ospath, "example2.txt")

with open(file_path_2, 'w', encoding='utf-8') as f:
    f.write("Method 2: Using os.path")

print(f"Saved using os.path: {file_path_2}")

# Method 3: Save other types of files (CSV, JSON, etc.)
import json

# Save JSON file
json_file = desktop_pathlib / "data.json"
data = {"name": "John", "age": 30}
with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print(f"Saved JSON file: {json_file}")

# Method 4: Check if desktop exists and create if needed
desktop = Path.home() / "Desktop"
if not desktop.exists():
    desktop.mkdir(parents=True, exist_ok=True)

# Save with custom filename
timestamp_file = desktop / f"log_{os.path.basename(__file__)}.txt"
with open(timestamp_file, 'w', encoding='utf-8') as f:
    f.write(f"Created at: {os.popen('date /t').read().strip()}")

print(f"Saved timestamped file: {timestamp_file}")


