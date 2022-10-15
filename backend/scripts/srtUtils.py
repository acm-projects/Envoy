"""
Provides a number of utility functions for creating SubRip Subtitle files (.SRT)

Credits: Rob Dachowski
Modified by the Envoy team

"""

import math
import html
import webvtt

# ==================================================================================
# Function: srtToCaptions
# Purpose: Parses the given SRT file to convert them into a usable Python format
# Parameters:
#                 srtFileName - the filename of the .srt file to be used
# ==================================================================================
def srtToCaptions(srtFileName):
    captions = []
    file = open(srtFileName, "r")

    for srtcaption in webvtt.from_srt(file.name):
        caption = {}
        caption["start"] = formatTimetoSeconds(srtcaption.start)
        caption["end"] = formatTimetoSeconds(srtcaption.end)
        caption["caption"] = srtcaption.lines[0]
        captions.append(caption)

    return captions


# ==================================================================================
# Function: captionsToSRT
# Purpose: Converts the captions object back into an SRT file format
# Parameters:
#                 captions - the captions object to be converted
# ==================================================================================
def captionsToSRT(captions):
    srt = ""
    index = 1

    for caption in captions:
        srt += str(index) + "\n"
        srt += (
            formatTimeSRT(float(caption["start"]))
            + " --> "
            + formatTimeSRT(float(caption["end"]))
            + "\n"
        )
        srt += caption["caption"] + "\n\n"
        index += 1

    return srt.rstrip()


# ==================================================================================
# Function: srtToDelimitedFile
# Purpose: Converts a SRT file to an HTML delimited file for translation
# Parameters:
#                 inputCaptions - the SRT captions to be converted
# ==================================================================================
def srtToDelimitedFile(inputCaptions):
    marker = "<span>"
    # Convert captions to text with marker between caption lines
    inputEntries = map(lambda c: c["caption"], inputCaptions)
    inputDelimited = marker.join(inputEntries)
    return inputDelimited


# ==================================================================================
# Function: srtToDelimitedFile
# Purpose: Converts a delimited file back to an SRT file.
# Parameters:
#                 sourceCaptions - the original captions object
#                 delimitedCaptions - the delimited captions to be converted
#                 delimiter - the delimiter keyword
# ==================================================================================
def delimitedToSRTFile(sourceCaptions, delimitedCaptions, delimiter):
    delimitedCaptions = html.unescape(delimitedCaptions)

    entries = delimitedCaptions.split(delimiter)

    outputWebCaptions = []
    for i, c in enumerate(sourceCaptions):
        caption = {}
        caption["start"] = c["start"]
        caption["end"] = c["end"]
        caption["caption"] = entries[i]
        caption["sourceCaption"] = c["caption"]
        outputWebCaptions.append(caption)

    return outputWebCaptions


# ==================================================================================
# Function: formatTimeSRT
# Purpose: Converts a delimited file back to an SRT file.
# Parameters:
#                 sourceCaptions - the original captions object
#                 delimitedCaptions - the delimited captions to be converted
#                 delimiter - the delimiter keyword
# ==================================================================================
def formatTimeSRT(timeSeconds):
    ONE_HOUR = 60 * 60
    ONE_MINUTE = 60
    hours = math.floor(timeSeconds / ONE_HOUR)
    remainder = timeSeconds - (hours * ONE_HOUR)
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


# ==================================================================================
# Function: formatTimetoSeconds
# Purpose: Formats the SRT timestamp syntax into a usable time
# Parameters:
#                 timeHMSf - The SRT timestamp to be converted
# ==================================================================================
def formatTimetoSeconds(timeHMSf):
    hours, minutes, seconds = (timeHMSf.split(":"))[-3:]
    hours = int(hours)
    minutes = int(minutes)
    seconds = float(seconds)
    timeSeconds = float(3600 * hours + 60 * minutes + seconds)
    return str(timeSeconds)


# ==================================================================================
# Function: writeToFile
# Purpose: Helper method that writes the given text to a file
# Parameters:
#                 fileName - File name of the new file
#                 text - The text to be written in the file
# ==================================================================================
def writeToFile(fileName, text):
    filehandle = open(fileName, "w", encoding="utf_8_sig")
    filehandle.write(text)
    filehandle.close()
