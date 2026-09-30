samples = [
    "ط­ط¯ط« ط®ط·ط£",
    "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ط¨ظ†ط¬ط§ط­",
    "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…",
    "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±"
]

def repair(s):
    current = s

    for i in range(5):
        try:
            candidate = current.encode("latin1").decode("utf-8")
        except Exception:
            break

        if candidate == current:
            break

        current = candidate

    return current

for x in samples:
    print("ORIGINAL:", x)
    print("RESULT  :", repair(x))
    print("---")
