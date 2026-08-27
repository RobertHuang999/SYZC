#!/usr/bin/env python3
"""Merge 功能清单.md content into 主PRD.md and delete function list files."""

import re
from pathlib import Path

ROOT = Path("/Users/robert/Desktop/SYZC/02-PRD文档")
SECTION_TITLE = "## 4. 功能清单"
MERGE_NOTE = "> 功能能力矩阵由原《{name}功能清单》合并；规则细节见《{name}业务规则规格》。"


def get_module_name(fl_path: Path) -> str:
    stem = fl_path.stem
    if stem.endswith("功能清单"):
        return stem[: -len("功能清单")]
    return stem


def find_main_prd(dir_path: Path, module_name: str) -> Path | None:
    for suffix in ("主PRD.md", "主需求文档.md"):
        p = dir_path / f"{module_name}{suffix}"
        if p.exists():
            return p
    for p in dir_path.glob(f"{module_name}主*.md"):
        if "功能清单" not in p.name and "字段" not in p.name and "规则" not in p.name:
            return p
    return None


def extract_function_list_body(text: str) -> str:
    lines = text.splitlines()
    start = 0
    for i, line in enumerate(lines):
        if line.strip() == "---" and i > 0:
            start = i + 1
            break
        if line.startswith("## ") or line.startswith("| "):
            start = i
            break
    end = len(lines)
    for i, line in enumerate(lines):
        if re.match(r"^##\s*修订记录", line):
            end = i
            break
    body = "\n".join(lines[start:end]).strip()
    # Remove duplicate file title if present
    body = re.sub(r"^# .+\n+", "", body)
    return body


def renumber_sections_after_insert(text: str, insert_before_pattern: str) -> str:
    """If inserting §4 功能清单 before §4 验收, bump 验收 and later numbered sections +1."""

    def bump_section_num(match: re.Match) -> str:
        num = int(match.group(1))
        if num >= 4:
            return f"## {num + 1}. {match.group(2)}"
        return match.group(0)

    # Only bump sections that were >= 4 before the insert point
    parts = re.split(r"(?=^## \d+\.)", text, flags=re.MULTILINE)
    result = []
    inserted = False
    for part in parts:
        if not part.strip():
            continue
        m = re.match(r"^## (\d+)\.\s*(.+)$", part, re.MULTILINE)
        if m and int(m.group(1)) >= 4 and not inserted:
            # This is the first section >= 4; insert 功能清单 before it handled externally
            inserted = True
        result.append(part)
    return text  # renumber done in insert_merge_section


def insert_merge_section(prd_text: str, fl_body: str, module_name: str) -> str:
    if SECTION_TITLE in prd_text or "## 功能清单" in prd_text:
        return prd_text

    merge_block = (
        f"\n---\n\n{SECTION_TITLE}\n\n"
        + MERGE_NOTE.format(name=module_name)
        + f"\n\n{fl_body.strip()}\n"
    )

    # Insert before 验收 / 修订记录; renumber §4+ if needed
    accept_match = re.search(r"\n## (\d+)\.\s*验收", prd_text)
    rev_match = re.search(r"\n## 修订记录", prd_text)

    if accept_match:
        insert_pos = accept_match.start()
        sec_num = int(accept_match.group(1))
        if sec_num >= 4:
            # Renumber this and all later ## N. sections
            tail = prd_text[insert_pos:]

            def bump(m: re.Match) -> str:
                n = int(m.group(1))
                if n >= sec_num:
                    return f"## {n + 1}. {m.group(2)}"
                return m.group(0)

            tail = re.sub(r"^## (\d+)\.\s*(.+)$", bump, tail, flags=re.MULTILINE)
            prd_text = prd_text[:insert_pos] + merge_block + tail
            return prd_text

    if rev_match:
        return prd_text[: rev_match.start()].rstrip() + merge_block + prd_text[rev_match.start() :]

    return prd_text.rstrip() + merge_block + "\n"


def add_revision_entry(prd_text: str, module_name: str) -> str:
    marker = f"合并原《{module_name}功能清单》"
    if marker in prd_text:
        return prd_text
    entry = f"| 2026-08-20 | — | 合并原《{module_name}功能清单》至本文件 §4 功能清单 |"
    if "## 修订记录" in prd_text:
        return re.sub(
            r"(## 修订记录\s*\n\s*\|[^\n]+\|\s*\n\s*\|[^\n]+\|\s*\n)",
            r"\1" + entry + "\n",
            prd_text,
            count=1,
        )
    return prd_text.rstrip() + f"\n\n## 修订记录\n\n| 日期 | 版本 | 变更 |\n| :--- | :---: | :--- |\n{entry}\n"


def process_pair(fl_path: Path) -> dict:
    dir_path = fl_path.parent
    module_name = get_module_name(fl_path)
    prd_path = find_main_prd(dir_path, module_name)
    result = {"fl": str(fl_path), "status": "skipped", "reason": ""}

    if not prd_path:
        result["reason"] = "no main PRD"
        return result

    fl_text = fl_path.read_text(encoding="utf-8")
    prd_text = prd_path.read_text(encoding="utf-8")

    if SECTION_TITLE in prd_text:
        fl_path.unlink()
        result["status"] = "deleted_only"
        return result

    fl_body = extract_function_list_body(fl_text)
    new_prd = insert_merge_section(prd_text, fl_body, module_name)
    new_prd = add_revision_entry(new_prd, module_name)

    prd_path.write_text(new_prd, encoding="utf-8")
    fl_path.unlink()
    result["status"] = "merged"
    result["prd"] = str(prd_path)
    return result


def update_references():
    for md in ROOT.rglob("*.md"):
        if md.name.endswith("功能清单.md"):
            continue
        text = md.read_text(encoding="utf-8")
        if "功能清单" not in text:
            continue
        if md.name.endswith("主PRD.md") or "主需求文档" in md.name:
            if "## 4. 功能清单" in text:
                continue
        new = text
        new = re.sub(
            r"\[([^\]]+)功能清单\.md\]\(([^)]*)\)",
            r"[\1主PRD.md](\2)#4-功能清单",
            new,
        )
        new = re.sub(
            r"《([^》]+)功能清单》",
            r"《\1主PRD》§4 功能清单",
            new,
        )
        new = re.sub(
            r"主 PRD \+ 字段 \+ \[功能清单\]\(([^)]+)功能清单\.md\)",
            r"主 PRD（含功能清单）+ 字段",
            new,
        )
        new = re.sub(
            r"\| \[功能\]\([^)]*功能清单\.md\)",
            "| [功能清单§](./{module}主PRD.md#4-功能清单)",
            new,
        )
        # Fix index table: point 功能 column to main PRD anchor
        new = re.sub(
            r"\[功能\]\(\./([^/]+)/([^)]+)功能清单\.md\)",
            r"[功能§](./\1/\2主PRD.md#4-功能清单)",
            new,
        )
        if new != text:
            md.write_text(new, encoding="utf-8")


def main():
    files = sorted(ROOT.rglob("*功能清单.md"))
    stats = {"merged": 0, "deleted_only": 0, "skipped": 0, "errors": []}
    for fl in files:
        try:
            r = process_pair(fl)
            stats[r["status"]] = stats.get(r["status"], 0) + 1
            if r["status"] == "skipped":
                stats["errors"].append(f"{r['fl']}: {r['reason']}")
        except Exception as e:
            stats["skipped"] += 1
            stats["errors"].append(f"{fl}: {e}")
    update_references()
    print(f"Merged: {stats.get('merged', 0)}")
    print(f"Deleted only: {stats.get('deleted_only', 0)}")
    print(f"Skipped: {stats.get('skipped', 0)}")
    for e in stats["errors"]:
        print(f"  - {e}")
    print(f"Remaining 功能清单: {len(list(ROOT.rglob('*功能清单.md')))}")


if __name__ == "__main__":
    main()
