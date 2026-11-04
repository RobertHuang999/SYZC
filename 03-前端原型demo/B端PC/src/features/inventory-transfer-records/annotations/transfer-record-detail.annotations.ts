import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const transferRecordDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-detail-header",
    targetId: "transfer-detail-header",
    number: 1,
    kind: "页面",
    title: "移库单详情与归档终态印章 (R07)",
    content:
      "移库详情页展示全局唯一 19 位移库单号，提供一键复制按钮。右上角呈现绿色【已通过】印章，严格遵循【台账终态归档与禁止反冲正】(R07) 规范，不提供线上撤销或反冲正操作。",
    documentRefs: {
      prd: {
        section: "6.1 列表页功能规格（P-CKG-011）",
        match: "移库详情",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【台账终态归档与禁止反冲正】(R07)",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "transfer-detail-photos",
    targetId: "transfer-detail-photos",
    number: 2,
    kind: "字段",
    title: "现场作业照片与 IoT 设备智能抓拍 (R08)",
    content:
      "现场照片为提交时必传作业图片（最多 10 张）；设备抓拍图为系统提交落库瞬间自动调度移出/移入库区绑定的球机或枪机抓拍凭据，支持点击预览放大。",
    documentRefs: {
      prd: {
        section: "3.1 货权档案、货权公示与证据管理跨模块数据互通",
        match: "证据管理",
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
  {
    id: "transfer-detail-goods-tab",
    targetId: "transfer-detail-goods-tab",
    number: 3,
    kind: "字段",
    title: "移库明细分流呈现 (R03/R04)",
    content:
      "移库明细标签页根据移库类型分流呈现：普通移库采用折叠树形结构（展示原位置 vs 移入位置，支持展开二级储位）；抵押/质押移库采用平铺表格呈现受押货品的位置与数量明细。",
    documentRefs: {
      prd: {
        section: "6.2 普通移库新增表单规格",
        match: "货品明细",
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
    id: "transfer-detail-audit-tab",
    targetId: "transfer-detail-audit-tab",
    number: 4,
    kind: "字段",
    title: "全链路审批与对冲履历 (R05)",
    content:
      "展示移库单从发起申请到主管初审、资方终审的不可变流转履历，终审通过时原子触发库存对冲（移库出库 + 移库入库）。",
    documentRefs: {
      prd: {
        section: "3. 模块定位与系统链路",
        match: "原子对冲",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【审批终审原子账实对冲】(R05)",
        element: "text",
      },
    },
    details: [],
  },
]
