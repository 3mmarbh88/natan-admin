from pathlib import Path
import re
import shutil

P = Path(r".\src\App.tsx")
BACKUP = Path(r".\src\App.tsx.backup-before-arabic-fix.tsx")
ROLLBACK = Path(r".\src\App.tsx.before-local-arabic-fix.tsx")

if not P.exists():
    raise SystemExit("ERROR: App.tsx not found")

if not BACKUP.exists():
    raise SystemExit("ERROR: backup not found")

original = P.read_text(encoding="utf-8")
shutil.copy2(P, ROLLBACK)

# علامات شائعة للنص العربي المشوه
BAD_CHARS = set("طظ")
BAD_PATTERNS = (
    "ط§", "ط±", "ط¨", "طª", "ط¢", "ط£",
    "ط³", "ط´", "طµ", "ط¶", "ط¹",
    "ظ„", "ظ…", "ظ†", "ظ‡", "ظˆ",
    "ظ„ظ", "ظ…ظ", "ظ†ظ", "ظ‡ظ"
)

def is_bad(text):
    return any(x in text for x in BAD_PATTERNS)

def mojibake_count(text):
    return sum(text.count(x) for x in BAD_PATTERNS)

def arabic_count(text):
    return len(re.findall(r"[\u0600-\u06FF]", text))

before_bad = mojibake_count(original)
before_arabic = arabic_count(original)

print("BEFORE MOJIBAKE:", before_bad)
print("BEFORE ARABIC:", before_arabic)

# نحاول إصلاح كل كلمة/مقطع مشوه منفردًا.
# نترك النصوص التي لا يمكن تحويلها كما هي.
token_pattern = re.compile(r"[^\s\"'`<>(),;:{}\[\]]+")

changed = 0
candidate = original

def repair_token(match):
    global changed

    token = match.group(0)

    if not is_bad(token):
        return token

    # المحاولة الأولى: Windows-1252
    try:
        fixed = token.encode("cp1252").decode("utf-8")
        if fixed != token and not is_bad(fixed):
            changed += 1
            return fixed
    except (UnicodeEncodeError, UnicodeDecodeError):
        pass

    # المحاولة الثانية: Latin-1
    try:
        fixed = token.encode("latin1").decode("utf-8")
        if fixed != token and not is_bad(fixed):
            changed += 1
            return fixed
    except (UnicodeEncodeError, UnicodeDecodeError):
        pass

    return token

candidate = token_pattern.sub(repair_token, candidate)

after_bad = mojibake_count(candidate)
after_arabic = arabic_count(candidate)

print("AFTER MOJIBAKE:", after_bad)
print("AFTER ARABIC:", after_arabic)
print("TOKENS CHANGED:", changed)

# قبول الإصلاح فقط إذا انخفض التشويه
# ولم تنخفض كمية العربية.
if after_bad < before_bad and after_arabic >= before_arabic:
    P.write_text(candidate, encoding="utf-8")

    verify = P.read_text(encoding="utf-8")
    verify_bad = mojibake_count(verify)
    verify_arabic = arabic_count(verify)

    print("VERIFY MOJIBAKE:", verify_bad)
    print("VERIFY ARABIC:", verify_arabic)

    if verify_bad < before_bad and verify_arabic >= before_arabic:
        print("RESULT: REPAIRED")
        print("ROLLBACK COPY: App.tsx.before-local-arabic-fix.tsx")
    else:
        shutil.copy2(ROLLBACK, P)
        print("RESULT: ROLLED BACK")
        print("REASON: VERIFY FAILED")
else:
    shutil.copy2(ROLLBACK, P)
    print("RESULT: ROLLED BACK")
    print("REASON: NO SAFE IMPROVEMENT")

