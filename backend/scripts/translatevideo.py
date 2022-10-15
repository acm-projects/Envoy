"""
Drives the process to create a transription job, translate it into another language,
create subtitles, use Amazon Polly to synthesize an alternate audio track, 
and finally put it all together into a new video.

Credits: Rob Dachowski
Modified by the Envoy team

"""

import sys
import time
import os
import glob
import re

from amazonUtils import *
from srtUtils import *
from videoUtils import *

os.chdir(os.getcwd() + "\\backend\\scripts")

# Parse arguments
bucketRegion = sys.argv[1]
bucketName = sys.argv[2]
inputFileName = sys.argv[3]
outputLanguage = sys.argv[4]
accessKey = sys.argv[5]
secretAccessKey = sys.argv[6]

# Print out parameters and key header information for the user
print("==> translatevideo.py:\n")
print("==> Parameters: ")
print("\tInput bucket/object: " + bucketName + "/" + inputFileName)

print("\n==> Target Language Translation Output: ")
print("\t" + bucketName + inputFileName)

# Create transcription job
response = createTranscribeJob(
    bucketRegion, bucketName, inputFileName, accessKey, secretAccessKey
)

# Loop until the job successfully completes
print(
    "\n==> Transcription Job: "
    + response["TranscriptionJob"]["TranscriptionJobName"]
    + "\n\tIn Progress",
    end="",
)

while response["TranscriptionJob"]["TranscriptionJobStatus"] == "IN_PROGRESS":
    print(".", end="")
    time.sleep(5)
    response = getTranscriptionJobStatus(
        response["TranscriptionJob"]["TranscriptionJobName"],
        accessKey,
        secretAccessKey,
    )

# Get the subtitle URI from AWS Transcribe
subtitleURI = response["TranscriptionJob"]["Subtitles"]["SubtitleFileUris"][0]

# Print transcription job details
print("\n\nJob Complete")
print("\tStart Time: " + str(response["TranscriptionJob"]["CreationTime"]))
print("\tEnd Time: " + str(response["TranscriptionJob"]["CompletionTime"]))
print("\tSubtitle URI: " + subtitleURI)

# Download the original video file
downloadFile(inputFileName, bucketName, inputFileName, accessKey, secretAccessKey)

# Write the subtitles to file
subtitles = getSubtitles(subtitleURI)
writeToFile("subtitles-en.srt", subtitles)

# Process the SRT for translation
captions_list = srtToCaptions("subtitles-en.srt")

# Convert SRT file to a delimited file
delimitedSubtitles = srtToDelimitedFile(captions_list)
writeToFile("subtitles-" + outputLanguage + ".delimited", delimitedSubtitles)

# Translate the delimited file
translatedDelimitedSubtitles = translateFile(
    "subtitles-" + outputLanguage + ".delimited",
    "en",
    outputLanguage,
    bucketRegion,
    accessKey,
    secretAccessKey,
)
writeToFile("subtitles-" + outputLanguage + ".processed", delimitedSubtitles)

# Convert the translated delimited file back to translated text
translatedCaptionsList = delimitedToSRTFile(
    captions_list, translatedDelimitedSubtitles, "<span>"
)
translatedText = captionsToSRT(translatedCaptionsList)

# Write the translated text to an SRT file
translatedSRTFileName = "subtitles-" + outputLanguage + ".srt"
writeToFile(translatedSRTFileName, translatedText + "\n\n")

# Create the subtitled translated video
createVideo(
    inputFileName,
    translatedSRTFileName,
    "translated-" + inputFileName,
    "",
    True,
)

# Upload the final video to S3
response = uploadFile(
    "translated-" + inputFileName,
    bucketName,
    inputFileName,
    accessKey,
    secretAccessKey,
)

# Generate S3 signed URL
print(
    "\n"
    + createPresignedURL(
        bucketName,
        inputFileName,
        accessKey,
        secretAccessKey,
    )
)

# Cleanup
for filename in glob.glob("*.mp4"):
    os.remove(filename)

for filename in glob.glob("*.srt"):
    os.remove(filename)

for filename in glob.glob("*.delimited"):
    os.remove(filename)

for filename in glob.glob("*.processed"):
    os.remove(filename)

for filename in glob.glob("*.log"):
    os.remove(filename)
