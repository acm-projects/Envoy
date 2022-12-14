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
import re

from amazon_utils import *
from srt_utils import *
from video_utils import *
from audio_utils import *

os.chdir(os.path.join(os.getcwd(), "backend", "scripts"))

# Parse arguments
bucket_region = sys.argv[1]  # Region where AWS services will be used
bucket_name = sys.argv[2]  # Name of the bucket that contains the file
input_filename = sys.argv[3]  # Filename of the video to be translated
output_language = sys.argv[4]  # Output language code, based on Amazon Translate
access_key = sys.argv[5]  # Access key for AWS services
secret_access_key = sys.argv[6]  # Secret access key for AWS services

# Print input file location
print("==> translate_video.py:")
print(f"\tInput file: {bucket_name}/{input_filename}")

#
# Transcription
#

# Create transcription job
response = transcribe_video(
    input_filename, bucket_region, bucket_name, access_key, secret_access_key
)

# Loop until the transcription job successfully completes
print(
    f'\n==> Transcription Job: {response["TranscriptionJob"]["TranscriptionJobName"]}'
)
print("\tIn Progress", end="")

while response["TranscriptionJob"]["TranscriptionJobStatus"] == "IN_PROGRESS":
    print(".", end="")
    time.sleep(5)
    response = get_transcription_job_status(
        response["TranscriptionJob"]["TranscriptionJobName"],
        bucket_region,
        access_key,
        secret_access_key,
    )

# Store the subtitle URL from the transcribe output
subtitle_url = response["TranscriptionJob"]["Subtitles"]["SubtitleFileUris"][0]

# Print transcription job details
print("\n==> Job Complete")
print(f'\tStart Time: {str(response["TranscriptionJob"]["CreationTime"])}')
print(f'\tEnd Time: {str(response["TranscriptionJob"]["CompletionTime"])}')
print(f"\tSubtitle URL: {subtitle_url}")

# Download the original video file
download_file(
    input_filename,
    input_filename,
    bucket_region,
    bucket_name,
    access_key,
    secret_access_key,
)

# Write the subtitles to file
file_prefix = input_filename[: len(input_filename) - 4]
subtitles = get_subtitles(subtitle_url)
write_to_file(f"{file_prefix}-subtitles-en.srt", subtitles)

#
# Translation
#

print("\n==> Translating subtitles")

# Process the SRT for translation
captions_list = srt_to_captions(f"{file_prefix}-subtitles-en.srt")

# Convert SRT file to a delimited file
delimited_subtitles = captions_to_delimited(captions_list)
write_to_file(
    f"{file_prefix}-subtitles-{output_language}.delimited", delimited_subtitles
)

# Translate the delimited file
translated_delimited_subtitles = translate_file(
    f"{file_prefix}-subtitles-{output_language}.delimited",
    "en",
    output_language,
    bucket_region,
    access_key,
    secret_access_key,
)
write_to_file(
    f"{file_prefix}-subtitles-{output_language}.processed",
    translated_delimited_subtitles,
)

# Convert the translated delimited file back to translated text
translated_captions_list = delimited_to_captions(
    captions_list, translated_delimited_subtitles, "<span>"
)
translated_text = captions_to_srt(translated_captions_list)

# Write the translated text to an SRT file
translated_srt_filename = f"{file_prefix}-subtitles-{output_language}.srt"
write_to_file(translated_srt_filename, translated_text + "\n\n")

#
# Speech synthesis
#

envoy_algorithm(
    input_filename,
    translated_srt_filename,
    output_language,
    bucket_region,
    access_key,
    secret_access_key,
)

#
# Merging
#

# Create the subtitled translated video
create_video(
    f"translated-{input_filename}",
    translated_srt_filename,
    f"final-{input_filename}",
)

# Upload the final video to S3
response = upload_file(
    f"final-{input_filename}",
    input_filename,
    bucket_region,
    bucket_name,
    access_key,
    secret_access_key,
)

# Generate S3 signed URL
print(
    create_presigned_url(
        input_filename,
        bucket_region,
        bucket_name,
        access_key,
        secret_access_key,
    )
)
