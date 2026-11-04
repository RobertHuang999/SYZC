import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

/** 跨菜单导出打点正文（三页共用 id/title/details；number 由各列表页按本页序号接续） */
export function buildInventoryCrossExportAnnotations(startNumber: number): PrototypeAnnotation[] {
  return [
    {
      id: "inv-cross-export-actions",
      number: startNumber,
      kind: "交互",
      version: "6.3",
      title: "跨菜单批量导出与统一导出记录",
      content:
        "存货管理（三 Tab）、库存明细、库存流水列表右上角共用【批量导出】→「选择导出内容」弹窗（本菜单/其他菜单两区；默认仅勾选本菜单）；【导出记录】三入口共用同一任务队列，列表列与基准一致（六列）。",
      documentRefs: {
        prd: { section: "二、需求摘要", match: "弹窗" },
        rules: { section: "七、业务规则", match: "IE-R01" },
      },
      details: [
        {
          title: "弹窗与全量口径",
          items: [
            {
              label: "默认勾选",
              content:
                "仅「本菜单」分区：存货管理入口默认三视图；库存明细入口默认明细；库存流水入口默认流水列表。",
            },
            {
              label: "分区展示",
              content: "「本菜单 · {菜单名}」与「其他菜单」两卡片分隔；其他区选项带完整菜单前缀。",
            },
            {
              label: "筛选无关",
              content:
                "「组合导出全量不受列表筛选规则」(IE-R04)：不受本页已选筛选影响，仅受账号仓库数据权限约束。",
            },
            {
              label: "明细 Sheet",
              content:
                "「库存明细导出默认仅有库存余量规则」(IE-R02)：仅仍有库存余量的明细，同列表「仅查看有库存的」。",
            },
          ],
        },
        {
          title: "文件形态",
          items: [
            {
              label: "跨菜单 Zip",
              content:
                "「跨菜单导出 Zip 打包规则」(IE-R06)：三类菜单中勾选 ≥2 类时，导出记录文件名为 .zip；仅单菜单为 .xlsx。",
            },
          ],
        },
        {
          title: "与流水行操作区分",
          items: [
            {
              label: "行级【下载记录】",
              content: "单笔单据垛位 Excel，基准能力，非本弹窗。",
            },
            {
              label: "列表批量导出",
              content:
                "「组合导出与行级下载记录命名隔离规则」(IE-R03)：弹窗内「库存流水（列表）」为权限内流水全量 Sheet。",
            },
          ],
        },
      ],
    },
    {
      id: "inv-cross-export-dialog",
      number: startNumber + 1,
      kind: "交互",
      version: "6.3",
      title: "选择导出内容弹窗",
      content:
        "居中模态窗：引导语「请选择要导出的内容」；本菜单/其他菜单两区 Checkbox；ProductFieldHint + PrototypeSpecCallout。至少勾选一项方可【开始导出】。",
      documentRefs: {
        prd: { section: "十一、ASCII 交互线框", match: "11.2" },
        fields: { section: "三、弹窗导出项", match: "STAT_REPO" },
      },
      details: [],
    },
  ]
}
