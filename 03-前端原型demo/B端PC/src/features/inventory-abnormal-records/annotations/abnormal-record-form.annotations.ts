import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const abnormalRecordFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "abnormal-form-picker",
    targetId: "abnormal-form-picker",
    number: 1,
    kind: "规则",
    title: "普通存货准入边界与在押资产阻断",
    content:
      "新增异动时，系统仅允许对【普通入库】且【存货中】且【可用数量大于0】的自由存货发起申报（R01）。处于抵押、质押或监管状态的在押金融资产严禁在仓储端发起异动，前置强制拦截阻断并引导至融资监管专属通道（R02），坚决守牢金融安全底线。",
    documentRefs: {
      prd: {
        section: "2. 功能范围",
        match: "金融在押资产风控红线硬隔离",
        element: "text",
      },
      fields: {
        section: "三、新增异动存货明细选择弹窗字段",
        match: "状态",
        element: "row",
      },
      rules: {
        section: "1. 存货与货权范围控制规则",
        match: "金融在押存货异动禁入阻断",
        element: "text",
      },
    },
    details: [
      {
        title: "风控隔离",
        items: [
          {
            label: "在押隔离",
            content: "严禁仓储端直接对抵质押资产发起调账。",
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-form-diff",
    targetId: "abnormal-form-diff",
    number: 2,
    kind: "规则",
    title: "异动后可用数量校验与差额动态试算",
    content:
      "异动后可用数量必须严格大于0（R04）。输入时系统动态试算差额 ΔQ = 异动后数量 - 异动前数量（R05）：若大于0显示红色增量（⬆），若小于0显示绿色减量（⬇），若等于0则阻断提交并提示无变动；异动类型单选必填，异动原因限制最多 500 字，支持上传最多 3 张现场照片凭证。",
    documentRefs: {
      prd: {
        section: "6.2 异动申请发起页（P-CKG-013-APPLY）",
        match: "异动申请录入",
        element: "text",
      },
      fields: {
        section: "四、异动申请发起页字段",
        match: "异动后可用数量",
        element: "row",
      },
      rules: {
        section: "2. 差额试算与输入防护规则",
        match: "异动后可用数量严格校验",
        element: "text",
      },
    },
    details: [
      {
        title: "差额试算",
        items: [
          {
            label: "红升绿降",
            content: "增量红字高亮，减量绿字高亮，零差额阻断提交。",
          },
        ],
      },
    ],
  },
]
