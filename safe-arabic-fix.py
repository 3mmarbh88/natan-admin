from pathlib import Path
import re
import shutil

p = Path(r".\src\App.tsx")
backup = Path(r".\src\App.tsx.backup-before-arabic-fix.tsx")
before_fix = Path(r".\src\App.tsx.before-safe-arabic-fix.tsx")

def mojibake_count(s):
    patterns = [
        r"ط§", r"ظ„", r"ط±", r"ط¨",
        r"طª", r"ط¢", r"ظ…", r"ظ„ظ"
    ]
    return sum(len(re.findall(x, s)) for x in patterns)

def repair_once(s):
    # UTF-8 bytes were decoded as Windows-1252/Latin-1.
    # Reverse that corruption only where the resulting text is valid UTF-8.
    try:
        return s.encode("latin1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return s

if not p.exists():
    raise SystemExit("ERROR: App.tsx not found")

if not backup.exists():
    raise SystemExit("ERROR: backup not found")

original = p.read_text(encoding="utf-8")
backup_text = backup.read_text(encoding="utf-8")

before = mojibake_count(original)

# Extra rollback copy made immediately before modification.
shutil.copy2(p, before_fix)

fixed = repair_once(original)
after = mojibake_count(fixed)

print("MOJIBAKE BEFORE:", before)
print("MOJIBAKE AFTER:", after)

if after < before:
    p.write_text(fixed, encoding="utf-8")
    print("RESULT: REPAIRED")
    print("FILE: App.tsx")
    print("ROLLBACK COPY: App.tsx.before-safe-arabic-fix.tsx")
else:
    p.write_text(original, encoding="utf-8")
    print("RESULT: ROLLED BACK")
    print("REASON: NO IMPROVEMENT")
