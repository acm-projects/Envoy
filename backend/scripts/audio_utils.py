"""
Provides a number of utility audio functions used to create 
synced text-to-speech

Credits: Rob Dachowski
Modified by the Envoy team

"""

import boto3
import sys
import webvtt

from moviepy import AudioFileClip, VideoFileClip, concatenate_videoclips
from moviepy.video.fx import multiply_speed
from contextlib import closing
from srt_utils import (
    captions_to_srt,
    format_seconds_to_srt_time,
    format_srt_time_to_seconds,
    write_to_file,
)

# ==================================================================================
# Function: envoy_algorithm
# Purpose: Generates text-to-speech using Amazon Polly, and syncs the video speed with the newly generated audio
# Parameters:
#                 video_filename - filename of the input video
#                 subtitle_filename - filename of the translated SRT file
#                 source_lang_code - the language code for the original content (e.g. English = "EN")
#                 target_lang_code - the language code for the translated content (e.g. Spanish = "ES")
#                 region - the AWS region in which to run services (e.g. "us-east-1")
#
# ==================================================================================
def envoy_algorithm(
    video_filename,
    subtitle_filename,
    target_lang_code,
    region,
    access_key,
    secret_access_key,
):
    print(f"\n==> Generating and syncing text-to-speech")

    file = open(subtitle_filename, "r")

    # Number of clips
    i = 1

    # Stores the end time of the original subtitle chunk
    original_previous_end_seconds = 0

    # Stores the end time of the new subtitle chunk
    updated_previous_end_seconds = 0

    # Stores the start time of the new subtitle chunk
    updated_start_seconds = 0

    # Stores all of the edited clips
    edited_clips = []

    # Stores updated captions
    new_captions = []

    # Loop through each subtitle chunk
    for srt_caption in webvtt.from_srt(file.name):
        start_seconds = float(format_srt_time_to_seconds(srt_caption.start))
        end_seconds = float(format_srt_time_to_seconds(srt_caption.end))

        # If there is a gap of more than 1 second, create a subclip for it
        if start_seconds - original_previous_end_seconds > 1:
            print(f"\tProcessing {original_previous_end_seconds}s to {start_seconds}s")
            clip = VideoFileClip(video_filename)
            clip = clip.subclip(original_previous_end_seconds, start_seconds)
            edited_clips.append(clip)
            i += 1

            # Update the new starting seconds to reflect the gap
            updated_start_seconds = updated_previous_end_seconds + (
                start_seconds - original_previous_end_seconds
            )
        # If the gap is less than 1 second, combine it with the current chunk
        else:
            start_seconds = original_previous_end_seconds
            updated_start_seconds = updated_previous_end_seconds

        # Create the video subclip corresponding to the subtitle chunk
        print(f"\tProcessing {start_seconds}s to {end_seconds}s")
        clip = VideoFileClip(video_filename)
        clip = clip.subclip(start_seconds, end_seconds)

        # Generate the speech for the subtitle chunk and store the duration
        text = srt_caption.lines[0]
        duration = synthesize_speech(
            text,
            f"audio{i}-{video_filename[: len(video_filename) - 4]}.mp3",
            target_lang_code,
            region,
            access_key,
            secret_access_key,
        )

        # Adjust the speed of the video to match the generated audio's duration
        clip = multiply_speed(clip, final_duration=duration)

        # Add the generated audio to the clip
        audio = AudioFileClip(
            f"audio{i}-{video_filename[: len(video_filename) - 4]}.mp3"
        )
        audio.with_duration(clip.duration)
        clip = clip.with_audio(audio)
        edited_clips.append(clip)

        # Update the subtitle timestamp to reflect the new audio
        caption = {}
        caption["start"] = format_seconds_to_srt_time(updated_start_seconds)
        caption["end"] = format_seconds_to_srt_time(updated_start_seconds + duration)
        caption["caption"] = srt_caption.lines[0]
        new_captions.append(caption)

        # Store the end_time for the next iteration
        i += 1
        original_previous_end_seconds = end_seconds
        updated_previous_end_seconds = updated_start_seconds + duration

    # Finally, merge all of the edited clips into a composite video
    final = concatenate_videoclips(edited_clips)
    final.write_videofile(f"translated-{video_filename}")

    # Update the SRT file
    translated_text = captions_to_srt(new_captions)
    write_to_file(subtitle_filename, translated_text + "\n\n")

    # Close file streams
    file.close()
    audio.close()
    final.close()


# ==================================================================================
# Function: synthesize_speech
# Purpose: Utility to determine how long in seconds it will take for a particular phrase of translated text to be spoken
# Parameters:
#                 text - the raw text to be synthesized
#                 audio_filename - the name (including extension) of the target audio file (e.g. "abc.mp3")
#                 target_lang_code - the language code used for the target Amazon Polly output
#                 region - the AWS region in which to run AWS services (e.g. "us-east-1")
#
# ==================================================================================
def synthesize_speech(
    text, audio_filename, target_lang_code, region, access_key, secret_access_key
):
    print("\tSynthesizing speech")

    # Set up the Polly client
    client = boto3.client(
        "polly",
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_access_key,
    )

    # Use the translated text to create the synthesized speech
    response = client.synthesize_speech(
        OutputFormat="mp3",
        SampleRate="22050",
        Text=text,
        VoiceId=get_voice_id(target_lang_code),
    )

    if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
        print("\tSuccessfully called Polly for speech synthesis")
        write_audio_stream(response, audio_filename)

        # Load the temporary audio clip into an AudioFileClip
        audio = AudioFileClip(audio_filename)
        return audio.duration
    else:
        print("\t==> Error calling Polly for speech synthesis")


# ==================================================================================
# Function: write_audio_stream
# Purpose: Utility to write an audio file from the response from the Amazon Polly API
# Parameters:
#                 response - the Amazon Polly JSON response
#                 audioFileName - the name (including extension) of the target audio file (e.g. "abc.mp3")
#
# ==================================================================================
def write_audio_stream(response, audio_filename):
    # Take the resulting stream and write it to an mp3 file
    if "AudioStream" in response:
        with closing(response["AudioStream"]) as stream:
            output = audio_filename
            write_audio(output, stream)


# ==================================================================================
# Function: write_audio
# Purpose: Writes the bytes associates with the stream to a binary file
# Parameters:
#                 output_filename - the name + extension of the ouptut file (e.g. "abc.mp3")
#                 stream - the stream of bytes to write to the output_file
#
# ==================================================================================
def write_audio(output_filename, stream):
    bytes = stream.read()

    try:
        # Open a file for writing the output as a binary stream
        with open(output_filename, "wb") as file:
            file.write(bytes)
    except IOError as error:
        # Could not write to file, exit gracefully
        print(error)
        sys.exit(-1)


# ==================================================================================
# Function: get_voice_id
# Purpose: Utility to return the name of the voice to use given a language code.
# Currently supported languages: Mandarin (zh), Hindi (hi), Spanish (es), French (fr)
# Parameters:
#                 targetLangCode - the language code used for the target Amazon Polly output
#
# ==================================================================================
def get_voice_id(target_lang_code):
    if target_lang_code == "zh":
        voiceId = "Zhiyu"
    elif target_lang_code == "hi":
        voiceId = "Aditi"
    elif target_lang_code == "es":
        voiceId = "Lupe"
    elif target_lang_code == "fr":
        voiceId = "Chantal"
    elif target_lang_code == "en":
        voiceId = "Salli"
    else:
        voiceId = ""

    return voiceId
