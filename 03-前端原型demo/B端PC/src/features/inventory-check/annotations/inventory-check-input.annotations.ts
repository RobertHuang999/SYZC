import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inventoryCheckInputAnnotations: PrototypeAnnotation[] = [
  {
    id: "check-input-header",
    targetId: "check-input-header",
    number: 1,
    kind: "页面",
    title: "待盘点录入总览与操作控制 (R02/R07)",
    content:
      "单据顶部展示盘点单号、状态大印章及基本元数据；右上角提供【返回】、仅制单人在未开始状态可用的红色【撤销】与金色【提交】。",
    documentRefs: {
      prd: {
        section: "6.3 待盘点页 / PC 端盘点录入",
        match: "单据概览",
        element: "text",
      },
      rules: {
        section: "五、待盘点页 / PC端盘点录入业务规则",
        match: "盘点录入与必填项核验",
        element: "text",
      },
    },
  },
  {
    id: "check-input-table",
    targetId: "check-input-table",
    number: 2,
    kind: "交互",
    title: "实盘核验与无需盘点切换控制 (R07)",
    content:
      "实盘数量支持数值录入，勾选【无需盘点】复选框自动清空并置灰输入框；是否存在、是否完好、位置一致三项下拉强校验必填；支持上传现场物证照片。",
    details: [
      {
        title: "提交完整性校验",
        items: [
          {
            label: "逐行扫描",
            content: "提交时必须所有货品行均完成录入，未完善时系统定位未填行红框报错阻断提交。",
          },
        ],
      },
    ],
  },
]

