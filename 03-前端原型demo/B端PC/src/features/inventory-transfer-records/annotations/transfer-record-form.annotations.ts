import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const transferRecordFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-form-type-select",
    targetId: "transfer-form-type-select",
    number: 1,
    kind: "规则",
    title: "移库类型分流与仓单置灰约束 (R02)",
    content:
      "移库类型下拉支持普通移库、质押移库、抵押移库。其中【仓单移库 (请到仓单管理操作移库)】选项前端置灰禁用，必须前往仓单管理发起，遵循【移库类型来源与仓单移库置灰】(R02)。",
    documentRefs: {
      prd: {
        section: "6.2 普通移库新增表单规格",
        match: "移库类型",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【移库类型来源与仓单移库置灰】(R02)",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "transfer-form-picker-boundary",
    targetId: "transfer-form-picker-boundary",
    number: 2,
    kind: "规则",
    title: "同仓移库物理边界强阻断 (R01)",
    content:
      "移库严格限定在同一实体监管仓库内。选货弹窗中，若某货品规格在多个仓库均有可用库存，主行移库数量直接置灰禁用并常驻红色警告：【仅允许单个仓库移库】，强制操作员展开二级明细按具体单仓库位调拨。",
    documentRefs: {
      prd: {
        section: "5. 典型业务场景故事（User Stories）",
        match: "场景 3【选货跨仓误操作前端强阻断】(S03)",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【同仓移库物理边界强约束】(R01)",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "transfer-form-batch-modal",
    targetId: "transfer-form-batch-modal",
    number: 3,
    kind: "交互",
    title: "普通移库主行批量移库一键覆盖 (R03)",
    content:
      "普通移库一级货品主行提供【批量移库】按钮。在弹窗中统一选择目标移入库房/分区及选填具体位置，点击确定即可一键覆盖当前主行下所有二级明细行的目标储位。",
    documentRefs: {
      prd: {
        section: "6.4 弹窗功能规格",
        match: "【批量移库】弹窗",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【普通移库选货折叠与批量设置】(R03)",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "transfer-form-pledge-sync",
    targetId: "transfer-form-pledge-sync",
    number: 4,
    kind: "规则",
    title: "抵质押移库关联单号与货权继承 (R04)",
    content:
      "切换为质押移库或抵押移库时，必填关联单号，页面不提供添加货品按钮，自动带出在押货品平铺表格，勾选行录入移库数量与目标库位，货权监管属性无缝继承。",
    documentRefs: {
      prd: {
        section: "6.3 抵押 / 质押移库新增表单规格",
        match: "货品明细（平铺表格）",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【抵押质押移库关联单号与货权继承】(R04)",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "transfer-form-scene-photo",
    targetId: "transfer-form-scene-photo",
    number: 5,
    kind: "字段",
    title: "现场移库作业照片强制上传 (R08)",
    content:
      "新增移库申请时必须上传现场移库作业照片（最多 10 张，支持 jpg/png/jpeg，单张不超过 5MB）。未上传照片时阻断提交审核，确保作业真实可追溯。",
    documentRefs: {
      prd: {
        section: "6.2 普通移库新增表单规格",
        match: "附件信息",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【现场照片必传与设备抓拍】(R08)",
        element: "text",
      },
    },
    details: [],
  },
]
