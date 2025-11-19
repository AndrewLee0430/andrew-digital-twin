from pathlib import Path

# Get desktop path
desktop = Path.home() / "Desktop"

# Save a file to desktop
file_path = desktop / "my_file.txt"

# Write content to the file
with open(file_path, 'w') as f:
    f.write("Hello, World! This file is saved on the desktop.")

print(f"File saved to: {file_path}")


