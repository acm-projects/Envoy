"""
Provides a number of utility functions for creating SubRip Subtitle files (.SRT)

Credits: Siva Rajamani and Raju Penmatcha
Modified by the Envoy team

"""

import html
import webvtt
import math

# ==================================================================================
# Function: srt_to_captions
# Purpose: Parses the given SRT file to convert them into a usable Python format (a list of dictionaries)
# Parameters:
#                 srt_filename - the filename of the .srt file to be used
#
# ==================================================================================
def srt_to_captions(srt_filename):
    captions = []
    file = open(srt_filename, "r")

    for srt_caption in webvtt.from_srt(file.name):
        caption = {}
        print(f"\tSRT Caption start time: {srt_caption.start}")
        print(f"\tSRT Caption end time: {srt_caption.end}")
        caption["start"] = srt_caption.start.replace(".", ",")
        caption["end"] = srt_caption.end.replace(".", ",")
        caption["caption"] = srt_caption.lines[0]
        captions.append(caption)

    return captions


# ==================================================================================
# Function: captions_to_srt
# Purpose: Converts the captions object back into an SRT file format
# Parameters:
#                 captions - the captions list to be converted
#
# ==================================================================================
def captions_to_srt(captions):
    srt = ""
    index = 1

    for caption in captions:
        srt += str(index) + "\n"
        srt += f'{caption["start"]} --> {caption["end"]}\n'
        srt += caption["caption"] + "\n\n"
        index += 1

    return srt.rstrip()


# ==================================================================================
# Function: captions_to_delimited
# Purpose: Converts a captions object to an HTML delimited file for translation
# Parameters:
#                 input_captions - the SRT captions to be converted
#
# ==================================================================================
def captions_to_delimited(input_captions):
    marker = "<span>"
    # Convert captions to text with marker between caption lines
    inputEntries = map(lambda c: c["caption"], input_captions)
    inputDelimited = marker.join(inputEntries)
    return inputDelimited


# ==================================================================================
# Function: delimited_to_captions
# Purpose: Converts a delimited file back to an object
# Parameters:
#                 source_captions - the original captions object
#                 delimited_captions - the delimited captions to be converted
#                 delimiter - the delimiter keyword
#
# ==================================================================================
def delimited_to_captions(source_captions, delimited_captions, delimiter):
    delimited_captions = html.unescape(delimited_captions)

    # Get each translated caption and store them in a list
    translatedCaptionChunks = delimited_captions.split(delimiter)

    outputSRTCaptions = []
    for i, c in enumerate(source_captions):
        # If the subtitle is empty, extend the start time of this chunk to the next chunk
        if not translatedCaptionChunks[i]:
            source_captions[i + 1]["start"] = c["start"]
        else:
            caption = {}
            caption["start"] = c["start"]  # Start time
            caption["end"] = c["end"]  # End time
            caption["caption"] = " " + translatedCaptionChunks[i]
            outputSRTCaptions.append(caption)

    return outputSRTCaptions


# ==================================================================================
# Function: writeToFile
# Purpose: Helper method that writes the given text to a file
# Parameters:
#                 filename - File name of the new file
#                 text - The text to be written in the file
#
# ==================================================================================
def write_to_file(filename, text):
    filehandle = open(filename, "w", encoding="utf_8_sig")
    filehandle.write(text)
    filehandle.close()


# ==================================================================================
# Function: format_srt_time_to_seconds
# Purpose: Format an SRT timestamp from HH:MM:SS,mmm to seconds
# Parameters:
#                 srt_time - the srt timestamp to be formatted
#
# ==================================================================================
def format_srt_time_to_seconds(srt_time):
    hours, minutes, seconds = (srt_time.split(":"))[-3:]
    hours = int(hours)
    minutes = int(minutes)
    seconds = float(seconds)
    timeSeconds = float(3600 * hours + 60 * minutes + seconds)
    return str(timeSeconds)


# ==================================================================================
# Function: format_seconds_to_srt_time
# Purpose: Format seconds to an SRT timestamp (HH:MM:SS,mmm)
# Parameters:
#                 time_seconds - the time (in seconds) to be formatted
#
# ==================================================================================
def format_seconds_to_srt_time(time_seconds):
    ONE_HOUR = 60 * 60
    ONE_MINUTE = 60
    hours = math.floor(time_seconds / ONE_HOUR)
    remainder = time_seconds - (hours * ONE_HOUR)
    minutes = math.floor(remainder / 60)
    remainder = remainder - (minutes * ONE_MINUTE)
    seconds = math.floor(remainder)
    remainder = remainder - seconds
    millis = remainder
    return (
        str(hours).zfill(2)
        + ":"
        + str(minutes).zfill(2)
        + ":"
        + str(seconds).zfill(2)
        + ","
        + str(math.floor(millis * 1000)).zfill(3)
    )
