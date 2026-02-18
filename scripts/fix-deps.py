import shutil
import os
import subprocess
import glob as g

# Find actual project path
candidates = [
    "/vercel/share/v0-project",
    "/vercel/share/v0-next-shadcn",
]

base = None
for c in candidates:
    if os.path.exists(c):
        base = c
        print(f"Found project at: {c}")
        break

if not base:
    # Try to find it
    share = "/vercel/share"
    if os.path.exists(share):
        for item in os.listdir(share):
            full = os.path.join(share, item)
            if os.path.isdir(full) and os.path.exists(os.path.join(full, "package.json")):
                base = full
                print(f"Found project at: {full}")
                break

if not base:
    print("Could not find project directory")
    exit(1)

nm = os.path.join(base, "node_modules")
next_cache = os.path.join(base, ".next")

# Remove corrupted node_modules
if os.path.exists(nm):
    print("Removing node_modules...")
    shutil.rmtree(nm, ignore_errors=True)
    # Double check - force remove any remaining dirs
    if os.path.exists(nm):
        os.system(f"rm -rf {nm}")
    print("Removed node_modules")

# Remove .next cache
if os.path.exists(next_cache):
    print("Removing .next cache...")
    shutil.rmtree(next_cache, ignore_errors=True)
    if os.path.exists(next_cache):
        os.system(f"rm -rf {next_cache}")
    print("Removed .next cache")

# Remove package-lock to allow clean install
lock = os.path.join(base, "package-lock.json")
if os.path.exists(lock):
    os.remove(lock)
    print("Removed package-lock.json")

# Run npm install
print("Running npm install...")
result = subprocess.run(
    ["npm", "install"],
    cwd=base,
    capture_output=True,
    text=True,
    timeout=180
)
print("STDOUT:", result.stdout[-1000:] if len(result.stdout) > 1000 else result.stdout)
if result.stderr:
    print("STDERR:", result.stderr[-1000:] if len(result.stderr) > 1000 else result.stderr)
print("Return code:", result.returncode)
