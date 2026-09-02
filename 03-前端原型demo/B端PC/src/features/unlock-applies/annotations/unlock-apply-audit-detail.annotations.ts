import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApplyAuditDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-apply-audit-detail-header",
    targetId: "unlock-apply-audit-detail-header",
    number: 1,
    kind: "页面",
    title: "开锁审核详情 · 审批人视角与页头操作",
    content:
      "全景展示开锁申请单快照信息、审批策略与处理历史；当前用户具备审批资格且处于待审批状态时提供【去处理】主操作。",
    details: [
      {
        title: "页头操作与权限控制",
        items: [
          {
            label: "待审批 + 有资格 (Eligible)",
            content: "页头展示【去处理】主按钮，点击唤起审批弹窗执行通过或驳回。",
          },
          {
            label: "非当前审批人 / 本人自审禁止",
            content: "不展示【去处理】按钮，并在底部提示「您不是当前审批人，仅可查看。」（P06/R11）。",
          },
          {
            label: "终态单据",
            content: "已通过、已驳回、已撤回或已失效单据仅提供【返回列表】操作，全页面字段只读。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-apply-audit-detail-device",
    targetId: "unlock-apply-audit-detail-device",
    number: 2,
    kind: "字段",
    title: "设备与位置信息快照",
    content:
      "只读展示开锁目标硬件资产档案与安装位置快照，确保审批人清晰掌握开锁物理边界。",
    details: [
      {
        title: "字段清单与核实要点",
        items: [
          {
            label: "设备编码与名称",
            content: "展示物联网设备唯一编码（如「LK-2024-0082」）与业务别名（如「A库挂锁-01」）。",
          },
          {
            label: "设备类型",
            content: "挂锁门禁 / 人脸门禁，提示该硬件形态对应的密码下发方式。",
          },
          {
            label: "仓房与具体位置",
            content: "展示绑定仓库（如「华东一号仓」）、库房/分区（如「A库 / 1区」）及安装具体位置，辅助判断作业区域合规性。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-apply-audit-detail-content",
    targetId: "unlock-apply-audit-detail-content",
    number: 3,
    kind: "字段",
    title: "申请内容与事由信息",
    content:
      "展示申请人身份、脱敏手机号、开锁事由、详细备注、预计使用时段及提交时间戳。",
    details: [
      {
        title: "字段规范与脱敏说明",
        items: [
          {
            label: "申请人与所属机构",
            content: "展示「姓名（所属机构）」（如「张三（华东监管部）」），支持跨机构溯源。",
          },
          {
            label: "申请人手机号",
            content: "前3后4脱敏展示（如「138****8000」），保障信息安全。",
          },
          {
            label: "开锁事由与预计时段",
            content: "展示出库、入库、移库、盘点、巡检等业务事由；预计使用时段供审批人评估授权合理性。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-apply-audit-detail-snapshot",
    targetId: "unlock-apply-audit-detail-snapshot",
    number: 4,
    kind: "字段",
    title: "审批配置快照（提交时固化）",
    content:
      "展示申请提交时精确命中的开锁审批配置快照（C04），包含配置编号、配置版本、审批方式与审批节点链。",
    details: [
      {
        title: "快照与不可变性 (C04/C05)",
        items: [
          {
            label: "配置编号与版本",
            content: "固化当时生效的配置编号（如「UNLOCK-CFG-20260828-001」）与版本号（如「v1」）。",
          },
          {
            label: "审批方式",
            content: "固化为「任一人通过」，节点内任何一位 eligible 审批人操作即生效。",
          },
          {
            label: "审批节点链",
            content: "记录该单据经过的节点顺序及对应的指定人员/指定角色（含所属合作机构）。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-apply-audit-detail-record",
    targetId: "unlock-apply-audit-detail-record",
    number: 5,
    kind: "字段",
    title: "审批记录与凭证状态",
    content:
      "展示各节点审批人、处理结论、审批意见/驳回原因、处理时间戳及后置凭证生成状态。",
    details: [
      {
        title: "审批留痕与凭证状态",
        items: [
          {
            label: "审批记录表格",
            content: "包含节点序号、处理人姓名（账号）、处理结论（同意/驳回）、意见及处理时间。",
          },
          {
            label: "最终结论与凭证状态",
            content: "展示最终审批结论；审批通过后展示凭证状态（未生成/已下发/生成失败/已过期/已失效）。",
          },
        ],
      },
    ],
  },
]
