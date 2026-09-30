samples = [
    "ط­ط¯ط« ط®ط·ط£",
    "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ط¨ظ†ط¬ط§ط­",
    "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…",
    "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±"
]

def repair(s):
    # Remove one intermediate mojibake layer.
    # ط -> Ø
    # ظ -> Ù
    intermediate = s.replace("ط", "Ø").replace("ظ", "Ù")

    try:
        return intermediate.encode("latin1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return s

for x in samples:
    print("ORIGINAL:", x)
    print("RESULT  :", repair(x))
    print("---")
