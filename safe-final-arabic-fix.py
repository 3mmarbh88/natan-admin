from pathlib import Path
import re
import shutil

P = Path(r".\src\App.tsx")
BACKUP = Path(r".\src\App.tsx.backup-before-arabic-fix.tsx")
ROLLBACK = Path(r".\src\App.tsx.before-final-arabic-fix.tsx")

if not P.exists():
    raise SystemExit("ERROR: App.tsx not found")

if not BACKUP.exists():
    raise SystemExit("ERROR: backup not found")

original = P.read_text(encoding="utf-8")

# نسخة تراجع قبل أي تعديل
shutil.copy2(P, ROLLBACK)

def bad_score(s):
    patterns = [
        "ط§","ط±","ط¨","طª","ط­","ط®","ط¯","ط°",
        "ط³","ط´","طµ","ط¶","ط¹","ط؛",
        "ط¥","ط£","ط¢","ط§",
        "ظ„","ظ…","ظ†","ظ‡","ظˆ","ظƒ","ظٹ",
        "ظ„ظ","ظ…ظ","ظ†ظ","ظ‡ظ","ظƒظ"
    ]
    return sum(s.count(x) for x in patterns)

def arabic_score(s):
    return len(re.findall(r"[\u0600-\u06FF]", s))

def try_repair(text):
    current = text

    # التشويه الناتج عن UTF-8 -> Latin-1 يمكن عكسه أحيانًا
    # على مراحل. نتوقف عندما لا يحدث تحسن.
    for _ in range(4):
        try:
            candidate = current.encode("latin1").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            break

        if bad_score(candidate) < bad_score(current):
            current = candidate
        else:
            break

    return current

before_bad = bad_score(original)
before_arabic = arabic_score(original)

print("BEFORE MOJIBAKE:", before_bad)
print("BEFORE ARABIC:", before_arabic)

# نقسم الملف إلى أجزاء صغيرة ونصلح فقط الأجزاء التي تبدو مشوهة.
# هذا يمنع تحويل العربية الصحيحة الموجودة أصلًا.
parts = re.split(r'(\s+|["\'`<>()[\]{}:,;=+*/?-]+)', original)

changed_parts = 0
candidate_parts = []

for part in parts:
    if bad_score(part) > 0:
        fixed = try_repair(part)

        if fixed != part and bad_score(fixed) < bad_score(part):
            candidate_parts.append(fixed)
            changed_parts += 1
        else:
            candidate_parts.append(part)
    else:
        candidate_parts.append(part)

candidate = "".join(candidate_parts)

after_bad = bad_score(candidate)
after_arabic = arabic_score(candidate)

print("AFTER MOJIBAKE:", after_bad)
print("AFTER ARABIC:", after_arabic)
print("CHANGED PARTS:", changed_parts)

# شروط الأمان:
# التشويه يجب أن ينخفض، والعربية لا تنخفض.
if after_bad < before_bad and after_arabic >= before_arabic:
    P.write_text(candidate, encoding="utf-8")

    # تحقق من الملف المكتوب فعليًا
    verify = P.read_text(encoding="utf-8")
    verify_bad = bad_score(verify)
    verify_arabic = arabic_score(verify)

    print("VERIFY MOJIBAKE:", verify_bad)
    print("VERIFY ARABIC:", verify_arabic)

    if verify_bad < before_bad and verify_arabic >= before_arabic:
        print("RESULT: REPAIRED")
        print("ROLLBACK COPY: App.tsx.before-final-arabic-fix.tsx")
    else:
        shutil.copy2(ROLLBACK, P)
        print("RESULT: ROLLED BACK")
        print("REASON: VERIFY FAILED")
else:
    shutil.copy2(ROLLBACK, P)
    print("RESULT: ROLLED BACK")
    print("REASON: NO SAFE IMPROVEMENT")
