#!/usr/bin/env python3
"""
同步 07-常用skill 中的所有技能到 .cursor/skills
"""
import os

def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    cursor_skills_dir = os.path.join(repo_root, ".cursor", "skills")
    os.makedirs(cursor_skills_dir, exist_ok=True)

    source_dirs = [
        os.path.join(repo_root, "07-常用skill", "工程研发-matt-skills"),
        os.path.join(repo_root, "07-常用skill", "产品经理pm-skills-main"),
        os.path.join(repo_root, "07-常用skill", "产品经理pm-skills-main", "pm-advisory-suite"),
        os.path.join(repo_root, "07-常用skill")
    ]

    linked = 0
    for sdir in source_dirs:
        if not os.path.exists(sdir):
            continue
        for item in os.listdir(sdir):
            item_path = os.path.join(sdir, item)
            # 排除自身脚本和非包含 SKILL.md 的目录
            if os.path.isdir(item_path) and os.path.exists(os.path.join(item_path, "SKILL.md")):
                target_link = os.path.join(cursor_skills_dir, item)
                if os.path.lexists(target_link):
                    os.unlink(target_link)
                rel_source = os.path.relpath(item_path, cursor_skills_dir)
                os.symlink(rel_source, target_link)
                linked += 1

    print(f"✅ 成功同步 {linked} 个技能至 .cursor/skills/")

if __name__ == "__main__":
    main()
