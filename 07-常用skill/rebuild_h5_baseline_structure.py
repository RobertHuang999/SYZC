#!/usr/bin/env python3
"""Rebuild B端H5 baseline docs from mobileMenuData.ts (prototype 唯一定义来源)."""
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
H5_BASE = ROOT / "02-PRD文档/🌟🌟🌟-最新基准版/B端H5"
MENU_TS = ROOT / "03-前端原型demo/B端H5/src/data/mobileMenuData.ts"
PC_BASE = ROOT / "02-PRD文档/🌟🌟🌟-最新基准版/B端PC"

# 重建前整树清除（避免无序号旧目录残留）
H5_WIPE = ["01-首页", "02-工作台", "03-业务办理"]

PRIMARY_FOLDER = {
    "首页": "01-首页",
    "工作台": "02-工作台",
    "业务办理": "03-业务办理",
}

SECONDARY_ORDER = {
    "首页": ["基础概览", "待办事项", "数字仓库"],
    "工作台": ["仓储", "融资/监管", "交易", "风控", "结算", "配置管理"],
    "业务办理": ["内部审批", "业务发起", "客户需求审批", "其他审批"],
}

SECONDARY_FOLDER = {
    "融资/监管": "02-融资监管",
}

# moduleId → B端PC relative path (business rule 唯一定义来源, cross-reference only)
PC_RULE_SOURCE: dict[str, str | None] = {
    "home-digital-warehouse-monitor": "B端PC/02-仓储/16-设备管理-监控设备",
    "home-digital-warehouse-temp": "B端PC/02-仓储/18-设备管理-物联设备",
    "ws-inventory-mgr": "B端PC/02-仓储/01-库存查询-存货管理",
    "ws-receipt-mgr": "B端PC/02-仓储/05-仓单管理",
    "ws-cargo-rights": "B端PC/02-仓储/06-货权管理-货权档案",
    "ws-evidence-mgr": "B端PC/02-仓储/08-货权管理-证据管理",
    "ws-inbound-mgr": "B端PC/02-仓储/09-入库管理-入库记录",
    "ws-outbound-mgr": "B端PC/02-仓储/10-出库管理-出库记录",
    "ws-transfer-loc-mgr": "B端PC/02-仓储/11-移库管理-移库记录",
    "ws-transfer-owner-mgr": "B端PC/02-仓储/12-货物转让-转让记录",
    "ws-delivery-order": "B端PC/02-仓储/14-提货单",
    "ws-stock-taking": "B端PC/02-仓储/15-货物盘点",
    "ws-device-monitoring": "B端PC/02-仓储/16-设备管理-监控设备",
    "ws-device-iot": "B端PC/02-仓储/18-设备管理-物联设备",
    "ws-device-access": "B端PC/02-仓储/17-设备管理-门禁设备",
    "ws-device-gps": "B端PC/02-仓储/19-设备管理-GPS设备",
    "ws-device-access-logs": "B端PC/02-仓储/20-设备管理-门禁事务记录",
    "ws-cargo-movement": "B端PC/02-仓储/13-货物异动-异动记录",
    "ws-tally-stacking": "B端PC/02-仓储/02-库存查询-理货堆放",
    "ws-stock-detail": "B端PC/02-仓储/03-库存查询-库存明细",
    "ws-pledge-order-mgr": "B端PC/03-融资监管/06-抵质押业务-抵质押业务管理",
    "ws-supervision-order-mgr": "B端PC/03-融资监管/11-监管业务-供应链监管业务",
    "ws-credit-process": "B端PC/03-融资监管/03-融资管理-客户融资授信办理",
    "ws-online-pledge-process": "B端PC/03-融资监管/04-融资管理-融资结果-线上抵质押办理",
    "ws-due-diligence-process": "B端PC/03-融资监管/02-融资管理-客户融资尽调办理",
    "ws-reject-pool": "B端PC/03-融资监管/05-融资管理-被拒退回池",
    "ws-supervision-archive": "B端PC/03-融资监管/11-监管业务-供应链监管业务",
    "ws-trade-procure": "B端PC/04-交易/01-采购需求管理",
    "ws-trade-sales": "B端PC/04-交易/02-销售需求管理",
    "ws-policy-news": "B端PC/08-配置管理/02-门户管理-政策资讯",
    "ws-risk-device-warning": "B端PC/05-风控/05-风险信息-设备预警信息",
    "ws-risk-order-warning": "B端PC/05-风控/06-风险信息-押品预警信息",
    "ws-risk-device-events": "B端PC/05-风控/07-风险信息-设备事务通知信息",
    "ws-risk-in-loan": "B端PC/05-风控/08-风险信息-贷中风控管理",
    "ws-settle-mgr": "B端PC/07-结算/01-监管结算-项目结算管理",
    "ws-conf-warehouse": "B端PC/08-配置管理/10-仓库管理-仓库管理",
    "ws-conf-industrial-site-mgr": "B端PC/08-配置管理/11-仓库管理-产地区域管理",
    "biz-approve-customer-finance-leads": "B端PC/03-融资监管/01-融资管理-客户融资需求线索",
    "biz-approve-policy-news": "B端PC/08-配置管理/02-门户管理-政策资讯",
}

ITER_RULE_SOURCE: dict[str, str] = {
    "ws-risk-device-warning": "B-迭代需求/6.2版本（2026.08）/02-预警信息/01设备预警信息",
    "ws-risk-order-warning": "B-迭代需求/6.2版本（2026.08）/02-预警信息/02押品预警信息",
    "biz-approve-unlock-apply": "B-迭代需求/6.2版本（2026.08）/07-审批中心/04开锁申请",
}


def parse_menu_items() -> list[dict]:
    text = MENU_TS.read_text(encoding="utf-8")
    items = []
    block_re = re.compile(
        r"\{\s*id:\s*\"([^\"]+)\".*?primaryModule:\s*\"([^\"]+)\".*?secondaryCategory:\s*\"([^\"]+)\".*?name:\s*\"([^\"]+)\"",
        re.DOTALL,
    )
    for m in block_re.finditer(text):
        start = m.start()
        chunk = text[start : text.find("},", start) + 2]
        item = {
            "id": m.group(1),
            "primaryModule": m.group(2),
            "secondaryCategory": m.group(3),
            "name": m.group(4),
        }
        sub = re.search(r'subTab:\s*"([^"]+)"', chunk)
        if sub:
            item["subTab"] = sub.group(1)
        route = re.search(r'customRoute:\s*"([^"]+)"', chunk)
        if route:
            item["customRoute"] = route.group(1)
        elif route := re.search(r"customRoute:\s*'([^']+)'", chunk):
            item["customRoute"] = route.group(1)
        badge = re.search(r'badge:\s*"([^"]+)"', chunk)
        if badge:
            item["badge"] = badge.group(1)
        origin = re.search(r'originPath:\s*"([^"]+)"', chunk)
        if origin:
            item["originPath"] = origin.group(1)
        desc = re.search(r'description:\s*"([^"]+)"', chunk)
        if desc:
            item["description"] = desc.group(1)
        items.append(item)
    return items


def secondary_dir_name(primary: str, secondary: str) -> str:
    if secondary in SECONDARY_FOLDER:
        return SECONDARY_FOLDER[secondary]
    order = SECONDARY_ORDER[primary]
    idx = order.index(secondary) + 1
    safe = secondary.replace("/", "")
    return f"{idx:02d}-{safe}"


def feature_label(item: dict) -> str:
    """目录名主体（不含序号），对齐 B端PC 的「模块名-子项」风格。"""
    name = item["name"]
    sub = item.get("subTab")
    if sub:
        if name in ("设备管理", "待办事项"):
            return f"{name}-{sub}"
        return sub
    return name


def feature_dir_name(item: dict, idx: int) -> str:
    return f"{idx:02d}-{feature_label(item)}"


def rel_link(from_path: Path, target: str) -> str:
    """Link from markdown file to target under 02-PRD文档."""
    base_doc = ROOT / "02-PRD文档"
    target_path = base_doc / target if not target.startswith("B端PC") else ROOT / "02-PRD文档/🌟🌟🌟-最新基准版" / target
    rel = Path(os_path_relpath(from_path.parent, target_path))
    if target_path.is_dir():
        return str(rel) + "/"
    return str(rel)


def os_path_relpath(from_dir: Path, to_path: Path) -> str:
    import os

    return os.path.relpath(to_path, from_dir)


def depth_to_h5_root(md_path: Path) -> int:
    rel = md_path.relative_to(H5_BASE)
    return len(rel.parts) - 1  # exclude README.md filename


def link_to_h5_root(md_path: Path, filename: str) -> str:
    n = depth_to_h5_root(md_path)
    return ("../" * n) + filename


def module_readme(item: dict, md_path: Path) -> str:
    mid = item["id"]
    lines = [
        f"# {item['name']}" + (f" · {item['subTab']}" if item.get("subTab") and item["name"] != item.get("subTab") else ""),
        "",
        "> **文档状态**：占位 — 待迭代回写 H5 端 PRD / Demo / ASCII",
        f"> **moduleId**：`{mid}`",
        f"> **菜单路径**：{item['primaryModule']} → {item['secondaryCategory']}" + (f" → {item['name']}" if not item.get("subTab") else f" → {item['name']}（{item['subTab']}）"),
        f"> **原型路由**：`{item.get('customRoute', f'/m/module/{mid}')}`",
    ]
    if item.get("originPath"):
        lines.append(f"> **PC 原路径**：{item['originPath']}")
    if item.get("badge"):
        lines.append(f"> **原型标签**：{item['badge']}")
    lines.extend([
        "> **功能清单唯一定义来源**：`03-前端原型demo/B端H5/src/data/mobileMenuData.ts`",
        f"> **基准路径**：`B端H5/{item.get('_doc_path', '')}`",
        f"> **导航索引**：[00-菜单地图.md]({link_to_h5_root(md_path, '00-菜单地图.md')}) · [01-功能清单与原型路由.md]({link_to_h5_root(md_path, '01-功能清单与原型路由.md')})",
        "",
    ])

    pc = PC_RULE_SOURCE.get(mid)
    if pc:
        pc_path = ROOT / "02-PRD文档/🌟🌟🌟-最新基准版" / pc
        if pc_path.exists():
            link = os_path_relpath(md_path.parent, pc_path)
            lines.append(f"> **业务规则（PC 基准）**：[{pc.split('/')[-1]}]({link}/)")
    iter_p = ITER_RULE_SOURCE.get(mid)
    if iter_p:
        iter_path = ROOT / "02-PRD文档" / iter_p
        if iter_path.exists():
            link = os_path_relpath(md_path.parent, iter_path)
            lines.append(f"> **6.2 迭代唯一定义来源**：[{iter_p.split('/')[-1]}]({link}/)")

    lines.extend([
        "",
        "---",
        "",
        "## 功能说明",
        "",
        item.get("description", "（见 mobileMenuData.ts）"),
        "",
        "---",
        "",
        "<!-- 占位：目录按 H5 原型板块分类；定稿后在此维护 H5 主 PRD、字段清单、Demo。业务规则可引用 PC 基准或 6.2 迭代唯一定义来源。 -->",
        "",
    ])
    return "\n".join(lines)


def section_readme(primary: str, secondary: str, children: list[dict]) -> str:
    pf = PRIMARY_FOLDER[primary]
    sd = secondary_dir_name(primary, secondary)
    title = f"{primary} · {secondary}"
    lines = [
        f"# {title}",
        "",
        f"> **上级**：[{primary}](../README.md)",
        f"> **板块路径**：`B端H5/{pf}/{sd}/`",
        "",
        "## 功能列表",
        "",
        "| 序号 | 菜单 | moduleId | 原型路由 | 文档 |",
        "| :---: | :--- | :--- | :--- | :--- |",
    ]
    for i, item in enumerate(children, start=1):
        fn = feature_dir_name(item, i)
        route = item.get("customRoute", f"/m/module/{item['id']}")
        display = item["name"] + (f"（{item['subTab']}）" if item.get("subTab") else "")
        lines.append(f"| {i:02d} | {display} | `{item['id']}` | `{route}` | [{fn}/](./{fn}/README.md) |")
    lines.append("")
    return "\n".join(lines)


def primary_readme(primary: str, sections: dict[str, list[dict]]) -> str:
    pf = PRIMARY_FOLDER[primary]
    route_map = {"首页": "/m/home", "工作台": "/m/workspace", "业务办理": "/m/tasks"}
    lines = [
        f"# {primary}",
        "",
        f"> **底栏 Tab**：{primary}（`{route_map.get(primary, '')}`）",
        f"> **原型唯一定义来源**：`mobileMenuData.ts` · `primaryModule = \"{primary}\"`",
        "",
        "## 二级板块",
        "",
    ]
    order = SECONDARY_ORDER[primary]
    for sec in order:
        if sec not in sections:
            continue
        sd = secondary_dir_name(primary, sec)
        lines.append(f"- [{sec}](./{sd}/README.md)（{len(sections[sec])} 项）")
    lines.append("")
    return "\n".join(lines)


def main():
    items = parse_menu_items()
    print(f"Parsed {len(items)} menu items")

    unlock_folder = None

    # Remove H5 module trees + legacy PC-mirror dirs
    for name in H5_WIPE + [
        "02-仓储",
        "03-融资监管",
        "04-交易",
        "05-风控",
        "06-统计",
        "07-结算",
        "08-配置管理",
        "样式规范- PC端",
    ]:
        p = H5_BASE / name
        if p.exists():
            shutil.rmtree(p)
            print(f"Removed {name}/")

    # Also remove old flat 02-业务办理 if present
    old_biz = H5_BASE / "02-业务办理"
    if old_biz.exists():
        shutil.rmtree(old_biz)

    # Group items (preserve mobileMenuData declaration order within each section)
    grouped: dict[str, dict[str, list[dict]]] = {}
    for item in items:
        pm = item["primaryModule"]
        sc = item["secondaryCategory"]
        grouped.setdefault(pm, {}).setdefault(sc, []).append(item)

    created = 0
    for primary, sections in grouped.items():
        pf = PRIMARY_FOLDER[primary]
        primary_dir = H5_BASE / pf
        primary_dir.mkdir(parents=True, exist_ok=True)
        (primary_dir / "README.md").write_text(primary_readme(primary, sections), encoding="utf-8")
        created += 1

        for secondary, sec_items in sections.items():
            sd = secondary_dir_name(primary, secondary)
            sec_dir = primary_dir / sd
            sec_dir.mkdir(parents=True, exist_ok=True)
            (sec_dir / "README.md").write_text(section_readme(primary, secondary, sec_items), encoding="utf-8")
            created += 1

            for i, raw in enumerate(sec_items, start=1):
                fn = feature_dir_name(raw, i)
                doc_path = f"{pf}/{sd}/{fn}"
                item = {**raw, "_doc_path": doc_path}
                if raw["id"] == "biz-approve-unlock-apply":
                    unlock_folder = doc_path
                feat_dir = sec_dir / fn
                feat_dir.mkdir(parents=True, exist_ok=True)
                md = feat_dir / "README.md"
                md.write_text(module_readme(item, md), encoding="utf-8")
                created += 1

    # 04-机构权限
    profile_dir = H5_BASE / "04-机构权限"
    profile_dir.mkdir(exist_ok=True)
    (profile_dir / "README.md").write_text(
        """# 机构权限

> **底栏 Tab**：机构权限（`/m/profile`）
> **原型页面**：`ProfilePage.tsx`
> **说明**：登录人信息、管辖仓库、权限矩阵说明；无独立业务 moduleId。

---

<!-- 占位：若后续拆分字段清单/权限说明，在此维护。 -->
""",
        encoding="utf-8",
    )

    # Unlock apply Demo stub
    if unlock_folder:
        unlock_dir = H5_BASE / unlock_folder
        unlock_dir.mkdir(parents=True, exist_ok=True)
        demo_path = unlock_dir / "开锁审批_Demo_移动端.md"
    iter_demo = ROOT / "02-PRD文档/B-迭代需求/6.2版本（2026.08）/07-审批中心/04开锁申请/Demo_详情与凭证_移动端.md"
    if iter_demo.exists() and not demo_path.exists():
        rel = os_path_relpath(demo_path.parent, iter_demo)
        demo_path.write_text(
            f"""# 开锁审批 · H5 Demo

> **6.2 迭代唯一定义（当前主文档）**：[Demo_详情与凭证_移动端.md]({rel})
>
> 定稿后可将内容回写至本目录，作为基准版 H5 Demo。

""",
            encoding="utf-8",
        )

    print(f"Created/updated {created} readme nodes under H5 baseline")


if __name__ == "__main__":
    main()
