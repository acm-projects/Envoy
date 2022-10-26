import glob
import os

os.chdir(os.path.join(os.getcwd(), "backend", "scripts"))

# Cleanup
for filename in glob.glob("*.mp4"):
    os.remove(filename)

for filename in glob.glob("*.mp3"):
    os.remove(filename)

for filename in glob.glob("*.srt"):
    os.remove(filename)

for filename in glob.glob("*.delimited"):
    os.remove(filename)

for filename in glob.glob("*.processed"):
    os.remove(filename)

for filename in glob.glob("*.log"):
    os.remove(filename)
