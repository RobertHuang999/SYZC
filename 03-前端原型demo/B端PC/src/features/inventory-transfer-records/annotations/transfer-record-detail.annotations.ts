import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const transferRecordDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-detail-basic-card",
    targetId: "transfer-detail-basic-card",
    number: 1,
    kind: "字段",
    title: "纯净 6 项基础信息与无影像规范 (R06)",
    content:
      "转让单详情页纯净展示 6 项基础信息：制单人、制单时间、接收人、转让人、转让时间、转让原因（0/500字完整交易背景，R04），右上角盖绿色大印章【已通过】。因货物物理不移动，严格不设现场照片与设备抓拍图（R06）。",
    documentRefs: {
      prd: {
        section: "4. 业务规则索引速查",
        match: "【详情页纯净无影像展示】(R06)",
        element: "text",
      },
      fields: {
        section: "六、展示、筛选与引用规则汇总",
        match: "敏感信息脱敏与占位符规范",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "R06",
        element: "text",
      },
    },
  },
  {
    id: "transfer-detail-goods-table",
    targetId: "transfer-detail-goods-table",
    number: 2,
    kind: "字段",
    title: "转让货品明细树形折叠 (R01)",
    content:
      "一级主行展示货品规格与转让总数量，二级展开展示具体存放储位、具体位置、入库时间、扩展信息、二维码条码、状态与转让数量。明细为纯只读，条码支持点击大图预览，物权流转后条码指针指向新货主。",
    documentRefs: {
      prd: {
        section: "2. 功能范围",
        match: "树形货品明细",
        element: "text",
      },
      fields: {
        section: "二、转让货品明细字段",
        match: "转让货品明细采用树形结构",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "R01",
        element: "text",
      },
    },
  },
  {
    id: "transfer-detail-audit-timeline",
    targetId: "transfer-detail-audit-timeline",
    number: 3,
    kind: "交互",
    title: "审核流转记录与跨模块入库闭环 (R05)",
    content:
      "展示全生命周期审批流转履历（提交审核、主管审核、终审通过）。终审通过后原子触发原货主转让出库单生成，并在受让新货主名下自动生成转让入库单（R05）。",
    documentRefs: {
      prd: {
        section: "4. 业务规则索引速查",
        match: "【跨模块转让入库联动与货权对冲】(R05)",
        element: "text",
      },
      fields: {
        section: "五、统计汇总、系统与审批审计字段",
        match: "审核记录",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "R05",
        element: "text",
      },
    },
  },
]
