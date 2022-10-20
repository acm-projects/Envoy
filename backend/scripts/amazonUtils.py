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
# Function: translateFile
# Purpose: Translate a given file to the language specified in the target language code
# Parameters:
#                 fileName - the filename of the .srt file to be used
#                 sourceLangCode - the language code for the original content (e.g. English = "EN")
#                 targetLangCode - the language code for the translated content (e.g. Spanish = "ES")
#                 region - the AWS region in which to run the Translation (e.g. "us-east-1")
# ==================================================================================
def translateFile(
    fileName, sourceLangCode, targetLangCode, region, accessKey, secretAccessKey
):
    print("\n==> Translating from " + sourceLangCode + " to " + targetLangCode)
    
    # Open file
    text_file = open(fileName, "r")
    text = text_file.read()
    text_file.close()

    # set up the Amazon Translate client
    translate = boto3.client(
        service_name="translate",
        region_name=region,
        aws_access_key_id=accessKey,
        aws_secret_access_key=secretAccessKey,
    )

    # call Translate  with the text, source language code, and target language code.  The result is a JSON structure containing the
    # translated text
    translation = translate.translate_text(
        Text=text, SourceLanguageCode=sourceLangCode, TargetLanguageCode=targetLangCode
    )

    return translation["TranslatedText"]


# ==================================================================================
# Function: createTranscribeJob
# Purpose: Function to format the input parameters and invoke the Amazon Transcribe service
# Parameters:
#                 region - the AWS region in which to run AWS services (e.g. "us-east-1")
#                 bucket - the Amazon S3 bucket name (e.g. "mybucket/") found in region that contains the media file for processing.
#                 fileName - the name of the content to process (e.g. "myvideo.mp4")
#
# ==================================================================================
def createTranscribeJob(region, bucket, fileName, accessKey, secretAccessKey):
    # Initialize the Transcribe client
    transcribe = boto3.client(
        "transcribe",
        aws_access_key_id=accessKey,
        aws_secret_access_key=secretAccessKey,
    )

    # Set up the full uri for the bucket and media file
    mediaUri = "https://" + "s3-" + region + ".amazonaws.com/" + bucket + "/" + fileName

    print("\n==> Creating Job: " + "transcribe" + fileName + " for " + mediaUri)

    # Use the uuid functionality to generate a unique job name.  Otherwise, the Transcribe service will return an error
    jobName = "transcribe_" + uuid.uuid4().hex + "_" + fileName

    # Starts the transcription job
    response = transcribe.start_transcription_job(
        TranscriptionJobName=jobName,
        LanguageCode="en-US",
        MediaFormat="mp4",
        Media={"MediaFileUri": mediaUri},
        Subtitles={"Formats": ["srt"], "OutputStartIndex": 1},
    )

    # return the response structure found in the Transcribe Documentation
    return response


# ==================================================================================
# Function: getTranscriptionJobStatus
# Purpose: Helper function to return the status of a job running the Amazon Transcribe service
# Parameters:
#                 jobName - the unique jobName used to start the Amazon Transcribe job
# ==================================================================================
def getTranscriptionJobStatus(jobName, accessKey, secretAccessKey):
    transcribe = boto3.client(
        "transcribe",
        aws_access_key_id=accessKey,
        aws_secret_access_key=secretAccessKey,
    )

    response = transcribe.get_transcription_job(TranscriptionJobName=jobName)
    return response


# ==================================================================================
# Function: getSubtitles
# Purpose: Helper function to return the subtitle file based on the signed URI in S3 as produced by the Transcript job
# Parameters:
#                 transcriptURI - the signed S3 URI for the Transcribe output
# ==================================================================================
def getSubtitles(subtitleURI):
    # Get the resulting Transcription Job and store the JSON response in transcript
    result = requests.get(subtitleURI)

    return result.text


# ==================================================================================
# Function: uploadFile
# Purpose: Uploads a file from S3
# Parameters:
#                 fileName - the local filename of the file to upload
#                 bucket - the bucket to upload the file into
#                 key - the name of the object in S3
# ==================================================================================
def uploadFile(fileName, bucket, key, accessKey, secretAccessKey):
    print("\n==> Uploading file " + fileName)
    s3 = boto3.client(
        "s3",
        aws_access_key_id=accessKey,
        aws_secret_access_key=secretAccessKey,
    )

    try:
        s3.upload_file(fileName, bucket, key)
    except botocore.exceptions.ClientError as e:
        logging.error(e)


# ==================================================================================
# Function: uploadFile
# Purpose: Downloads a file from S3
# Parameters:
#                 fileName - the local filename of the file after it is downloaded
#                 bucket - the bucket to get the object from
#                 key - the name of the object to be downloaded in S3
# ==================================================================================
def downloadFile(fileName, bucket, key, accessKey, secretAccessKey):
    print("\n==> Downloading file " + fileName)
    s3 = boto3.client(
        "s3",
        aws_access_key_id=accessKey,
        aws_secret_access_key=secretAccessKey,
    )

    try:
        s3.download_file(bucket, key, fileName)
    except botocore.exceptions.ClientError as e:
        logging.error(e)


def createPresignedURL(bucket, key, accessKey, secretAccessKey, expiration=3600):
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=accessKey,
        aws_secret_access_key=secretAccessKey,
    )

    try:
        response = s3_client.generate_presigned_url(
            "get_object", Params={"Bucket": bucket, "Key": key}, ExpiresIn=expiration
        )
    except botocore.exceptions.ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response
