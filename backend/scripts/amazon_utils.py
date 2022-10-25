"""
Provides a number of utility functions for leveraging AWS APIs

Credits: Rob Dachowski
Modified by the Envoy team

"""

import boto3
import botocore
import uuid
import requests
import logging


# ==================================================================================
# Function: transcribe_video
# Purpose: Function that calls the Amazon Transcribe service
# Parameters:
#                 filename - the name of the content to process (e.g. "myvideo.mp4")
#                 region - the AWS region in which to run AWS services (e.g. "us-east-1")
#                 bucket_name - the Amazon S3 bucket name (e.g. "mybucket/") found in region that contains the media file for processing.
#
# ==================================================================================
def transcribe_video(filename, region, bucket_name, access_key, secret_access_key):
    # Initialize the Transcribe client
    transcribe = boto3.client(
        "transcribe",
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_access_key,
    )

    # Set up the full url for the bucket and media file
    mediaUri = (
        "https://" + "s3-" + region + ".amazonaws.com/" + bucket_name + "/" + filename
    )

    print(f"\n==> Creating transcribe job for {mediaUri}")

    # Use the uuid functionality to generate a unique job name.
    job_name = f"transcribe_{uuid.uuid4().hex}_{filename}"

    # Starts the transcription job
    response = transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        LanguageCode="en-US",
        MediaFormat="mp4",
        Media={"MediaFileUri": mediaUri},
        Subtitles={"Formats": ["srt"], "OutputStartIndex": 1},
    )

    # return the response structure found in the Transcribe Documentation
    return response


# ==================================================================================
# Function: get_transcription_job_status
# Purpose: Helper function to return the status of a job running the Amazon Transcribe service
# Parameters:
#                 job_name - the unique jobName used to start the Amazon Transcribe job
#                 region - the AWS region in which to run AWS services (e.g. "us-east-1")
#
# ==================================================================================
def get_transcription_job_status(job_name, region, access_key, secret_access_key):
    transcribe = boto3.client(
        "transcribe",
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_access_key,
    )

    response = transcribe.get_transcription_job(TranscriptionJobName=job_name)
    return response


# ==================================================================================
# Function: getSubtitles
# Purpose: Helper function to return the subtitle file based on the signed URL in S3 as produced by the Transcript job
# Parameters:
#                 subtitle_url - the signed S3 URL for the Transcribe output
#
# ==================================================================================
def get_subtitles(subtitle_url):
    result = requests.get(subtitle_url)
    return result.text


# ==================================================================================
# Function: translate_file
# Purpose: Translate a given file to the language specified in the target language code
# Parameters:
#                 filename - the filename of the .srt file to be used
#                 source_lang_code - the language code for the original content (e.g. English = "EN")
#                 target_lang_code - the language code for the translated content (e.g. Spanish = "ES")
#                 region - the AWS region in which to run the Translation (e.g. "us-east-1")
#
# ==================================================================================
def translate_file(
    filename, source_lang_code, target_lang_code, region, access_key, secret_access_key
):
    print("\n==> Translating from " + source_lang_code + " to " + target_lang_code)

    # Open file and read text
    text_file = open(filename, "r")
    text = text_file.read()
    text_file.close()

    # Set up the Amazon Translate client
    translate = boto3.client(
        service_name="translate",
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_access_key,
    )

    # Call Translate with the text, source language code, and target language code
    translation = translate.translate_text(
        Text=text,
        SourceLanguageCode=source_lang_code,
        TargetLanguageCode=target_lang_code,
    )

    return translation["TranslatedText"]


# ==================================================================================
# Function: upload_file
# Purpose: Uploads a file to S3
# Parameters:
#                 filename - the local filename of the file to upload
#                 output_filename - the name of the object in S3
#                 region - the AWS region in which to run AWS services (e.g. "us-east-1")
#                 bucket_name - the bucket to upload the file into
#
# ==================================================================================
def upload_file(
    filename, output_filename, region, bucket_name, access_key, secret_access_key
):
    print(f"\n==> Uploading file {filename}")

    s3 = boto3.client(
        "s3",
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_access_key,
    )

    try:
        s3.upload_file(filename, bucket_name, output_filename)
    except botocore.exceptions.ClientError as e:
        logging.error(e)


# ==================================================================================
# Function: download_file
# Purpose: Downloads a file from S3
# Parameters:
#                 filename - the name of the object in S3
#                 output_filename - the local filename of the file after it is downloaded
#                 region - the AWS region in which to run AWS services (e.g. "us-east-1")
#                 bucket_name - the bucket to get the object from
#
# ==================================================================================
def download_file(
    filename, output_filename, region, bucket_name, access_key, secret_access_key
):
    print(f"\n==> Downloading file {filename}")

    s3 = boto3.client(
        "s3",
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_access_key,
    )

    try:
        s3.download_file(bucket_name, filename, output_filename)
    except botocore.exceptions.ClientError as e:
        logging.error(e)


# ==================================================================================
# Function: create_presigned_url
# Purpose: Creates an S3 signed URL to access files
# Parameters:
#                 filename - the name of the object in S3
#                 region - the AWS region in which to run AWS services (e.g. "us-east-1")
#                 bucketName - the bucket to get the object from
# ==================================================================================
def create_presigned_url(
    filename, region, bucketName, access_key, secret_access_key, expiration=3600
):
    s3_client = boto3.client(
        "s3",
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_access_key,
    )

    try:
        response = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucketName, "Key": filename},
            ExpiresIn=expiration,
        )
    except botocore.exceptions.ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response
