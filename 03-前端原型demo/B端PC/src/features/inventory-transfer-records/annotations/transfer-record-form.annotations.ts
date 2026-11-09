import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const transferRecordFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-form-basic",
    targetId: "transfer-form-basic",
    number: 1,
    kind: "字段",
    title: "基础信息与 500 字必填转让原因 (R04)",
    content:
      "录入转让日期、转让方类型、转让方名称、转让方标识。必填 0/500 字转让原因说明，详细记录转让背景合同依据与结算事实，固化司法存证（R04）。仅限无权利负担的普通自有存货发起（R01）。",
    documentRefs: {
      prd: {
        section: "4. 业务规则索引速查",
        match: "【转让原因合规必填】(R04)",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段",
        match: "转让原因说明",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "R04",
        element: "text",
      },
    },
  },
  {
    id: "transfer-form-goods",
    targetId: "transfer-form-goods",
    number: 2,
    kind: "交互",
    title: "选货弹窗单仓强监管阻断 (R02)",
    content:
      "点击【添加货品】呼出选货弹窗。严格遵循【单仓转让强监管物理阻断】(R02)，单张转让单必须位于同一实体监管仓库。多仓商品主行置灰禁用，提示“仅允许单个仓库转让”，明细行标红强阻断。货物物理储位不移动，不设“移入储位”。",
    documentRefs: {
      prd: {
        section: "4. 业务规则索引速查",
        match: "【单仓转让强监管物理阻断】(R02)",
        element: "text",
      },
      fields: {
        section: "四、【选择货物】选货弹窗字段",
        match: "单仓阻断提示",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "R02",
        element: "text",
      },
    },
  },
  {
    id: "transfer-form-receiver",
    targetId: "transfer-form-receiver",
    number: 3,
    kind: "交互",
    title: "新接收方二元短信核验与自动建档 (R03)",
    content:
      "录入接收方主体类型、姓名、标识与身份证号。系统自动校验接收方是否为已有客户；若为未建档新主体，点击【提交审核】时强制弹出【货主信息确认】弹窗，向预留手机号下发 6 位动态短信验证码，核验真实意愿后自动建档至货主档案并进入审批流（R03）。",
    documentRefs: {
      prd: {
        section: "4. 业务规则索引速查",
        match: "【新接收方身份核验与自动建档】(R03)",
        element: "text",
      },
      fields: {
        section: "三、接收方（受让新货主）与新货主二元核验字段",
        match: "短信验证码 (二元核验)",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "R03",
        element: "text",
      },
    },
  },
]
