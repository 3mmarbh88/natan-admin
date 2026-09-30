from pathlib import Path

p = Path(r".\src\App.tsx")

# Create a fresh backup
backup = p.with_name(p.name + ".backup-before-cp1256-fix")
backup.write_bytes(p.read_bytes())

s = p.read_text(encoding="utf-8")

def repair(text):
    try:
        return text.encode("cp1256").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return text

lines = s.splitlines(keepends=True)

out = []
changed = 0

for line in lines:
    fixed = repair(line)

    if fixed != line and any("\u0600" <= c <= "\u06ff" for c in fixed):
        print("BEFORE:", line.rstrip())
        print("AFTER :", fixed.rstrip())
        print("-" * 80)
        line = fixed
        changed += 1

    out.append(line)

p.write_text("".join(out), encoding="utf-8")

print()
print("========================================")
print("NATAN ADMIN CP1256 REPAIR COMPLETE")
print("Changed lines:", changed)
print("Backup:", backup)
print("File:", p)
print("========================================")
