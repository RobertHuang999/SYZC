#!/usr/bin/env python3
"""Merge 业务流程.md content into 业务规则规格.md and delete workflow files."""

import re
from pathlib import Path

ROOT = Path("/Users/robert/Desktop/SYZC/02-PRD文档")
MERGE_SECTION = "## 业务流程与联动"
MERGE_NOTE = "> 以下内容由原《{name}业务流程》合并，与上文规则 ID 配合阅读；重复的状态机定义以上文为准。"


def extract_workflow_body(text: str) -> str:
    """Extract main body from workflow file, skip title/version and revision."""
    lines = text.splitlines()
    start = 0
    for i, line in enumerate(lines):
        if line.strip() == "---" and i > 0:
            start = i + 1
            break
    end = len(lines)
    for i, line in enumerate(lines):
        if re.match(r"^##\s*修订记录", line):
            end = i
            break
    body = "\n".join(lines[start:end]).strip()
    return body


def strip_duplicate_state_diagrams(workflow_body: str, rules_text: str) -> str:
    """Remove stateDiagram blocks from workflow if rules already has stateDiagram."""
    if "stateDiagram" not in rules_text:
        return workflow_body
    pattern = r"```mermaid\s*\nstateDiagram[\s\S]*?```"
    return re.sub(pattern, "", workflow_body).strip()


def remove_workflow_refs(text: str, module_prefix: str) -> str:
    """Remove references to 业务流程.md files."""
    text = re.sub(
        rf"、?\[?{re.escape(module_prefix)}业务流程\.md\]?(\([^)]*\))?",
        "",
        text,
    )
    text = re.sub(rf"《{re.escape(module_prefix)}业务流程》", f"《{module_prefix}业务规则规格》", text)
    text = re.sub(r"、?\[?[^\]]*业务流程\.md\]?(\([^)]*\))?", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def ensure_ssot_header(rules_text: str, module_name: str) -> str:
    """Ensure document has SSOT positioning in header."""
    if "唯一定义来源" in rules_text or "Single Source of Truth" in rules_text:
        return rules_text
    title_match = re.match(r"(# .+\n)", rules_text)
    if not title_match:
        return rules_text
    insert = (
        f"\n> **文档定位**：{module_name}状态机、动作约束、校验规则、权限与计算规则的唯一定义来源。"
        f"主 PRD、字段清单只引用本文件规则 ID，不重复定义规则本体。\n"
    )
    rest = rules_text[len(title_match.group(1)) :]
    return title_match.group(1) + insert + rest


def insert_merge_section(rules_text: str, workflow_body: str, module_name: str) -> str:
    """Insert merged workflow content before 修订记录."""
    if not workflow_body.strip():
        return rules_text

    merge_block = (
        f"\n---\n\n{MERGE_SECTION}\n\n"
        + MERGE_NOTE.format(name=module_name)
        + f"\n\n{workflow_body.strip()}\n"
    )

    rev_match = re.search(r"\n## 修订记录", rules_text)
    if rev_match:
        pos = rev_match.start()
        return rules_text[:pos].rstrip() + merge_block + rules_text[pos:]
    return rules_text.rstrip() + merge_block + "\n"


def add_revision_entry(rules_text: str, module_name: str) -> str:
    """Add merge revision entry if not already present."""
    marker = "合并原《"
    if marker in rules_text and "业务流程" in rules_text.split(marker)[1].split("\n")[0]:
        return rules_text
    entry = f"| 2026-08-20 | — | 合并原《{module_name}业务流程》至本文件「业务流程与联动」章节 |"
    if "## 修订记录" in rules_text:
        return re.sub(
            r"(## 修订记录\s*\n\s*\|[^\n]+\|\s*\n\s*\|[^\n]+\|\s*\n)",
            r"\1" + entry + "\n",
            rules_text,
            count=1,
        )
    return rules_text.rstrip() + f"\n\n## 修订记录\n\n| 日期 | 版本 | 变更 |\n| :--- | :---: | :--- |\n{entry}\n"


def get_module_name(workflow_path: Path) -> str:
    stem = workflow_path.stem
    if stem.endswith("业务流程"):
        return stem[: -len("业务流程")]
    return stem


def process_pair(workflow_path: Path) -> dict:
    dir_path = workflow_path.parent
    module_name = get_module_name(workflow_path)
    rules_path = dir_path / f"{module_name}业务规则规格.md"

    result = {"workflow": str(workflow_path), "status": "skipped", "reason": ""}

    if not rules_path.exists():
        result["reason"] = f"no rules file: {rules_path.name}"
        return result

    workflow_text = workflow_path.read_text(encoding="utf-8")
    rules_text = rules_path.read_text(encoding="utf-8")

    if MERGE_SECTION in rules_text and "合并原《" in rules_text:
        workflow_path.unlink()
        result["status"] = "deleted_only"
        result["reason"] = "already merged"
        return result

    workflow_body = extract_workflow_body(workflow_text)
    workflow_body = strip_duplicate_state_diagrams(workflow_body, rules_text)

    new_rules = rules_text
    new_rules = ensure_ssot_header(new_rules, module_name)
    new_rules = remove_workflow_refs(new_rules, module_name)
    new_rules = insert_merge_section(new_rules, workflow_body, module_name)
    new_rules = add_revision_entry(new_rules, module_name)

    rules_path.write_text(new_rules, encoding="utf-8")
    workflow_path.unlink()

    result["status"] = "merged"
    result["rules"] = str(rules_path)
    return result


def update_prd_references():
    """Update 主PRD and other files referencing 业务流程."""
    for md in ROOT.rglob("*.md"):
        text = md.read_text(encoding="utf-8")
        if "业务流程" not in text:
            continue
        # Do not rewrite merge notes inside rules specs
        if md.name.endswith("业务规则规格.md") and "业务流程与联动" in text:
            continue
        new_text = text
        new_text = re.sub(
            r"《([^》]+)业务流程》",
            r"《\1业务规则规格》",
            new_text,
        )
        new_text = re.sub(
            r"（流程见[^）]*业务流程[^）]*）",
            "（流程见业务规则规格「业务流程与联动」）",
            new_text,
        )
        new_text = re.sub(
            r"详见《([^》]+)业务流程》",
            r"详见《\1业务规则规格》§业务流程与联动",
            new_text,
        )
        new_text = re.sub(
            r"([^\s/]+)业务流程\.md",
            r"\1业务规则规格.md",
            new_text,
        )
        if new_text != text:
            md.write_text(new_text, encoding="utf-8")


def main():
    workflow_files = sorted(ROOT.rglob("*业务流程.md"))
    stats = {"merged": 0, "deleted_only": 0, "skipped": 0, "errors": []}

    for wf in workflow_files:
        try:
            r = process_pair(wf)
            stats[r["status"]] = stats.get(r["status"], 0) + 1
            if r["status"] == "skipped":
                stats["errors"].append(f"{r['workflow']}: {r['reason']}")
        except Exception as e:
            stats["skipped"] += 1
            stats["errors"].append(f"{wf}: {e}")

    update_prd_references()

    print(f"Merged: {stats.get('merged', 0)}")
    print(f"Deleted (already merged): {stats.get('deleted_only', 0)}")
    print(f"Skipped: {stats.get('skipped', 0)}")
    if stats["errors"]:
        print("\nIssues:")
        for e in stats["errors"]:
            print(f"  - {e}")


if __name__ == "__main__":
    main()
