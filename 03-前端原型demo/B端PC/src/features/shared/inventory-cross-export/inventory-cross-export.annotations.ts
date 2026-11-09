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
              label: "全量说明位置",
              content:
                "「组合导出全量不受列表筛选规则」(IE-R04)：与引导语同一行，右侧右对齐 ProductFieldHint；三入口一致。",
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
                "「跨菜单导出 Zip 打包规则」(IE-R06)：三类菜单中勾选 ≥2 类时，导出记录文件名为 .zip；仅单菜单为 .xlsx。弹窗内常驻 Zip 说明 ProductFieldHint（「若勾选多个菜单…」）。",
            },
            {
              label: "明细勾选项说明",
              content:
                "「库存明细导出默认仅有库存余量规则」(IE-R02)：「库存明细（仅仍有库存余量的明细）」项下常驻小字（全文见 ui-labels）；本菜单/其他菜单同一主文案。",
            },
            {
              label: "流水勾选项说明",
              content:
                "「库存流水（列表）」项下常驻：仅含已生效流水，不含审批中单据；与 IE-R03 列表全量区分行级【下载记录】。",
            },
            {
              label: "异步说明",
              content: "分区与 Zip 说明下方单行：报表生成需一定时间，请在「导出记录」中下载。",
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
                "「组合导出与行级下载记录命名隔离规则」(IE-R03)：弹窗「库存流水（列表）」为权限内列表全量 Sheet。",
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
        "居中模态窗（三入口同一组件）：首行左引导语、右全量说明；本菜单/其他菜单两区 Checkbox；明细/流水项下常驻口径小字；Zip 与异步 ProductFieldHint；PrototypeSpecCallout。至少勾选一项方可【开始导出】。",
      documentRefs: {
        prd: { section: "3.1 节", match: "弹窗界面布局" },
        fields: { section: "三、弹窗导出项", match: "STAT_REPO" },
        rules: { section: "七、业务规则", match: "IE-R06" },
      },
      details: [
        {
          title: "文案真源",
          items: [
            {
              label: "上线 USER 句",
              content: "`inventory-cross-export-ui-labels.ts`；与 15-仓储-库存查询-跨菜单批量导出规格 第 3.1 节表一致。",
            },
          ],
        },
      ],
    },
  ]
}
