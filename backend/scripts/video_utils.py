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
# Function: create_video
# Purpose: This function drives the MoviePy code needed to put all of the pieces together and create a new subtitled video
# Parameters:
#                 input_filename - the filename of the orignal conent (e.g. "originalVideo.mp4")
#                 subtitles_filename - the filename of the SRT file (e.g. "mySRT.srt")
#                 output_filename - the filename of the output video file (e.g. "outputFileName.mp4")
#
# ==================================================================================
def create_video(
    input_filename,
    subtitles_filename,
    output_filename,
):
    print("\n==> create_video ")

    # Load the original clip
    print(f"\tReading video clip: {input_filename}")

    video = VideoFileClip(input_filename)

    print("\t\t==> Video duration: " + str(video.duration))

    # Create a lambda function that will be used to generate the subtitles for each sequence in the SRT
    def generator(txt):
        return TextClip(
            txt, font="Arial Unicode", font_size=30, bg_color="black", color="white"
        )

    # Read in the subtitles files
    print(
        "\t" + strftime("%H:%M:%S", gmtime()),
        "Reading subtitle file: " + subtitles_filename,
    )

    subtitles = SubtitlesClip(subtitles_filename, generator, encoding="utf_8_sig")

    print(
        "\t" + strftime("%H:%M:%S", gmtime()),
        "Creating composited video: " + output_filename,
    )

    # Overlay the text clip on the first video clip
    final = CompositeVideoClip([video, subtitles.with_position(("center", "bottom"))])

    print(f"\tWriting video file: {output_filename}")

    final.write_videofile(output_filename)
