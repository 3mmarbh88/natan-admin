from pathlib import Path
import re
import shutil

P = Path(r".\src\App.tsx")
BACKUP = Path(r".\src\App.tsx.backup-before-arabic-fix.tsx")
ROLLBACK = Path(r".\src\App.tsx.before-safe-arabic-fix.tsx")

def count_mojibake(text):
    patterns = [
        r"ط§",
        r"ط±",
        r"ط¨",
        r"طª",
        r"ط¢",
        r"ط£",
        r"ظ„",
        r"ظ…",
        r"ظ†",
        r"ظ„ظ",
        r"ظ…ظ",
        r"ظ†ظ",
        r"ظ‡",
        r"ظˆ",
        r"ط",
        r"ظ"
    ]
    return sum(len(re.findall(x, text)) for x in patterns)

def count_arabic(text):
    return len(re.findall(r"[\u0600-\u06FF]", text))

if not P.exists():
    raise SystemExit("ERROR: App.tsx not found")

if not BACKUP.exists():
    raise SystemExit("ERROR: backup not found")

original = P.read_text(encoding="utf-8")

# حفظ نسخة تراجع إضافية قبل أي تغيير
shutil.copy2(P, ROLLBACK)

before_mojibake = count_mojibake(original)
before_arabic = count_arabic(original)

print("BEFORE MOJIBAKE:", before_mojibake)
print("BEFORE ARABIC:", before_arabic)

# محاولة الإصلاح بالطريقة الصحيحة للمشكلة:
# النص الحالي يحتوي على أحرف ظهرت نتيجة فك UTF-8 كـ CP1252.
def cp1252_repair(text):
    try:
        return text.encode("cp1252").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return None

candidate = cp1252_repair(original)

if candidate is None:
    print("CP1252 REPAIR: FAILED")
    print("RESULT: ROLLED BACK")
    raise SystemExit(0)

after_mojibake = count_mojibake(candidate)
after_arabic = count_arabic(candidate)

print("AFTER MOJIBAKE:", after_mojibake)
print("AFTER ARABIC:", after_arabic)

# لا نقبل الإصلاح إلا إذا:
# 1. انخفض التشويه
# 2. لم تنخفض كمية العربية
if after_mojibake < before_mojibake and after_arabic >= before_arabic:
    P.write_text(candidate, encoding="utf-8")

    # تحقق نهائي من الملف بعد الكتابة
    verify = P.read_text(encoding="utf-8")
    verify_mojibake = count_mojibake(verify)
    verify_arabic = count_arabic(verify)

    print("VERIFY MOJIBAKE:", verify_mojibake)
    print("VERIFY ARABIC:", verify_arabic)

    if verify_mojibake < before_mojibake and verify_arabic >= before_arabic:
        print("RESULT: REPAIRED")
        print("ROLLBACK COPY: App.tsx.before-safe-arabic-fix.tsx")
    else:
        shutil.copy2(ROLLBACK, P)
        print("RESULT: ROLLED BACK")
        print("REASON: VERIFY FAILED")
else:
    shutil.copy2(ROLLBACK, P)
    print("RESULT: ROLLED BACK")
    print("REASON: NO SAFE IMPROVEMENT")

