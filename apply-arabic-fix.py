from pathlib import Path

p = Path(r".\src\App.tsx")

# Backup
backup = p.with_name(p.name + ".backup-before-arabic-fix")
backup.write_bytes(p.read_bytes())

s = p.read_text(encoding="utf-8")
lines = s.splitlines(keepends=True)

out = []
changed = 0

for line in lines:
    try:
        fixed = line.encode("latin1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        fixed = line

    if fixed != line and any("\u0600" <= c <= "\u06ff" for c in fixed):
        line = fixed
        changed += 1

    out.append(line)

new_text = "".join(out)
p.write_text(new_text, encoding="utf-8")

print("========================================")
print("NATAN ADMIN Arabic Repair")
print("========================================")
print("Changed lines:", changed)
print("Backup:", backup)
print("File:", p)
print("========================================")
