import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const processingRecordFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "processing-form-page",
    targetId: "processing-form-page",
    number: 1,
    kind: "页面",
    title: "新增加工申请单",
    content:
      "业务人员或现场监管员录入存货加工申请。涵盖三大折叠卡片（基础信息、两级树形投入明细、预计产出明细）。点击右上角【提交审核】后即时锁定投入库存，并推入通用审批中心（R06/R11）。",
    details: [
      {
        title: "主流程口径",
        items: [
          {
            label: "即时锁库",
            content: "提交成功后锁定对应投入库存并扣减可用量，打上加工锁定标记，防止并发争抢（R06）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-form-basic-card",
    targetId: "processing-form-basic-card",
    number: 2,
    kind: "字段",
    title: "卡片 1：基础信息与仓库锁定",
    content:
      "录入加工日期（禁未来时间 R01）、货主类型（企业/个人）、货主名称（联动带出标识与身份证号 R02）、加工类型（R03）、关联单号（抵质押/监管必填且过滤仓单货 R04）、备注（限制 140 字 R08）。主表无独立仓库选择框，由首条投入货物自动确定并锁定（R05）。",
    details: [
      {
        title: "三同校验与仓库锁定",
        items: [
          {
            label: "三同原则",
            content: "单据内所有投入明细必须同货主、同仓库、同加工类型；首条选定后主表仓库被锁定（R05）。",
          },
          {
            label: "仓单过滤",
            content: "抵质押单货物若已开具数字仓单，强行阻断选择并提示解单（R04）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-form-input-card",
    targetId: "processing-form-input-card",
    number: 3,
    kind: "交互",
    title: "卡片 2：两级树形投入明细",
    content:
      "右上角提供【+ 添加投入货品】弹窗。两级树形表格：一级货品规格汇总行支持移除；二级货位明细行可编辑计划投入量（0 < 计划量 <= 可用量 R06）。底部自动汇总品类数与投入总数量。",
    details: [
      {
        title: "明细交互",
        items: [
          {
            label: "可用量校验",
            content: "针对特定批次货位填写的计划投入量不得超过实时可用库存，否则阻断提交（R06）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-form-output-card",
    targetId: "processing-form-output-card",
    number: 4,
    kind: "交互",
    title: "卡片 3：预计产出明细与试算",
    content:
      "选择产出货品自动带出规格型号与计量单位（R07）；输入预计数量（>0），系统自动依据货品管理参考单价试算行金额与产出总金额（R31/R32）。提交后规格结构冻结（R07）。",
    details: [
      {
        title: "金额试算与缺价提示",
        items: [
          {
            label: "缺价容错",
            content: "若产出货物未设置参考单价，提示缺价信息，不阻断单据提交（R31）。",
          },
        ],
      },
    ],
  },
]
