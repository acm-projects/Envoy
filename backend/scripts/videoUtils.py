"""
Drives the MoviePy functions needed to create the subtitled video

Credits: Rob Dachowski
Modified by the Envoy team

"""

from moviepy.editor import *
from moviepy import editor
from moviepy.video.tools.subtitles import SubtitlesClip
from time import gmtime, strftime

# ==================================================================================
# Function: createVideo
# Purpose: This function drives the MoviePy code needed to put all of the pieces together and create a new subtitled video
# Parameters:
#                 originalClipName - the flename of the orignal conent (e.g. "originalVideo.mp4")
#                 subtitlesFileName - the filename of the SRT file (e.g. "mySRT.srt")
#                 outputFileName - the filename of the output video file (e.g. "outputFileName.mp4")
#                 alternateAudioFileName - the filename of an MP3 file that should be used to replace the audio track
#                 useOriginalAudio - boolean value as to whether or not we should leave the orignal audio in place or overlay it
#
# ==================================================================================
def createVideo(
    originalClipName,
    subtitlesFileName,
    outputFileName,
    alternateAudioFileName,
    useOriginalAudio=True,
):
    # This function is used to put all of the pieces together.
    # Note that if we need to use an alternate audio track, the last parm should = False

    print("\n==> createVideo ")

    # Load the original clip
    print(
        "\t" + strftime("%H:%M:%S", gmtime()), "Reading video clip: " + originalClipName
    )

    video = VideoFileClip(originalClipName)
    print("\t\t==> Original video duration: " + str(video.duration))

    if useOriginalAudio == False:
        print(
            strftime("\t" + "%H:%M:%S", gmtime()),
            "Reading alternate audio track: " + alternateAudioFileName,
        )
        audio = AudioFileClip(alternateAudioFileName)
        audio = audio.subclip(0, video.duration)
        audio.set_duration(video.duration)
        print("\t\t==> Audio duration: " + str(audio.duration))
        video = video.set_audio(audio)
    else:
        print(strftime("\t" + "%H:%M:%S", gmtime()), "Using original audio track...")

    # Create a lambda function that will be used to generate the subtitles for each sequence in the SRT
    def generator(txt):
        return TextClip(txt, font="Arial Unicode", font_size=30, color="white")

    # read in the subtitles files
    print(
        "\t" + strftime("%H:%M:%S", gmtime()),
        "Reading subtitle file: " + subtitlesFileName,
    )

    subtitles = SubtitlesClip(subtitlesFileName, generator, encoding="utf_8_sig")

    print(
        "\t" + strftime("%H:%M:%S", gmtime()),
        "Creating composited video: " + outputFileName,
    )

    # Overlay the text clip on the first video clip
    final = CompositeVideoClip([video, subtitles.with_position(("center", "bottom"))])

    print("\t" + strftime("%H:%M:%S", gmtime()), "Final duration: ", final.duration)

    print(
        "\t" + strftime("%H:%M:%S", gmtime()), "Writing video file: " + outputFileName
    )

    final.write_videofile(outputFileName)
