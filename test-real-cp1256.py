from pathlib import Path

p = Path(r".\src\App.tsx")
s = p.read_text(encoding="utf-8")

def repair(text):
    try:
        return text.encode("cp1256").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return text

lines = s.splitlines()

count = 0

for i, line in enumerate(lines, 1):
    if "ط" in line or "ظ" in line:
        fixed = repair(line)

        if fixed != line:
            print(f"LINE {i}")
            print("BEFORE:", line[:300])
            print("AFTER :", fixed[:300])
            print("-" * 80)
            count += 1

            if count >= 20:
                break

print()
print("SAFE CP1256 CHANGES FOUND:", count)
