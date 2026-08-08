from enum import Enum

class Season(str, Enum):
    spring = "SPRING"
    summer = "SUMMER"
    winter = "WINTER"
    fall = "FALL"


class MediaFormat(str, Enum):
    tv = "TV"
    tv_short = "TV_SHORT"
    movie = "MOVIE"
    special = "SPECIAL"
    ova = "OVA"
    ona = "ONA"
    music = "MUSIC"
    novel = "NOVEL"
    one_shot = "ONE_SHOT"
