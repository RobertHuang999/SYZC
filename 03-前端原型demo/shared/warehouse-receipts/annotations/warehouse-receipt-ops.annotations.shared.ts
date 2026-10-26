import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

/** 仓单动碰流程 · 移动端标注正文（双端共享真源，仅 H5 挂载） */
export const warehouseReceiptOpsAnnotationsShared: SharedPrototypeAnnotation[] = [
  {
    id: "receipt-ops-outbound",
    targetId: "receipt-ops-outbound",
    number: 1,
    kind: "规则",
    title: "仓单出库提货保底拦截（R-DWR-07）",
    content:
      "出库只允许部分提取，必须至少保留一组货物；勾选全部货物时强阻断并提示「仓单提货仅支持部分提取，若您需要提取仓单内所有货物，请发起仓单注销流程！」。",
    documentRefs: {
      fields: { section: "五、操作字段子清单索引", match: "02 仓单出库字段清单" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-07" },
      prd: { section: "场景 2【部分提货与全部提货强拦截】(S02)", match: "全选" },
    },
    details: [
      {
        title: "两步录入",
        items: [
          {
            label: "第一步 选货",
            content:
              "平铺展示仓单内全量货物，逐批选择全部出库或部分出库并录入数量。",
          },
          {
            label: "第二步 提货信息",
            content:
              "提货人类型、姓名、身份证号、电话、车牌号，出库日期、备注（最多 140 字）、现场照片（必填，最多 10 张）。",
          },
          {
            label: "提交后",
            content: "生成出库审批流，审批通过后联动生成提货单并核减仓单批次数量。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-ops-relocate",
    targetId: "receipt-ops-relocate",
    number: 2,
    kind: "规则",
    title: "仓单移库同仓物理转移（R-DWR-08）",
    content:
      "移库仅在当前仓单所属实体仓库内调整库位，严禁跨仓库；目标位置按「库房 → 分区 → 具体垛位」级联选择。",
    documentRefs: {
      fields: { section: "五、操作字段子清单索引", match: "03 仓单移库字段清单" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-08" },
    },
    details: [
      {
        title: "级联规则",
        items: [
          {
            label: "目标仓库",
            content: "固定为当前仓单所在仓库，控件只读且不可切换。",
          },
          {
            label: "目标库房",
            content: "仅列出该仓库下已启用库房，并展示「审核 / 不审核」标签。",
          },
          {
            label: "目标具体位置",
            content: "分区未划分垛位时记录「--」。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-ops-replenish",
    targetId: "receipt-ops-replenish",
    number: 3,
    kind: "规则",
    title: "仓单补货：追加同仓同货主可用库存（R-DWR-09）",
    content:
      "只能选择「货主 = 当前存货人、仓库 = 当前仓单仓库、状态 = 存货中、可用数量 > 0」的普通库存，录入本次补货数量后并入仓单。",
    documentRefs: {
      fields: { section: "五、操作字段子清单索引", match: "04 仓单补货字段清单" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-09" },
    },
    details: [
      {
        title: "数量校验",
        items: [
          {
            label: "取值范围",
            content: "必须大于 0 且不超过该批次普通可用数量。",
          },
          {
            label: "后置影响",
            content:
              "审批通过后，被选中的普通库存由【存货中】原子转为【仓单中】，仓单总数量增加。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-ops-remove",
    targetId: "receipt-ops-remove",
    number: 4,
    kind: "规则",
    title: "仓单移除：解绑还原为普通库存（R-DWR-09）",
    content:
      "将仓单内选定的货物批次解绑剔除，支持整批移除或部分数量移除；解绑后货物恢复为【存货中】可用库存，不发生实体出库。",
    documentRefs: {
      fields: { section: "五、操作字段子清单索引", match: "05 仓单移除字段清单" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-09" },
    },
    details: [
      {
        title: "与出库的区别",
        items: [
          {
            label: "仓单移除",
            content: "只解绑仓单关系，货物仍在库，物理位置不变。",
          },
          {
            label: "仓单出库",
            content: "真实提货出库，会核减库存并生成提货单。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-ops-cancel",
    targetId: "receipt-ops-cancel",
    number: 5,
    kind: "规则",
    title: "仓单注销多重确认与效力终止（R-DWR-11）",
    content:
      "注销按「重要提醒（倒计时阅读）→ 二次确认弹窗 → 电子签章人脸 → 审批流」执行；审批通过后仓单彻底作废，所有业务均不可再选中。",
    documentRefs: {
      fields: { section: "五、操作字段子清单索引", match: "07 仓单注销字段清单" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-11" },
      prd: { section: "场景 5【仓单注销签署与不可逆作废】(S05)", match: "重要提醒" },
    },
    details: [
      {
        title: "二次确认文案",
        items: [
          {
            label: "弹窗原文",
            content:
              "您是否仔细阅读重要提醒，且已知晓仓单注销后果！若您已确认并仍需注销仓单，请点击继续！",
          },
          {
            label: "取消",
            content: "点击取消即中止操作，直接返回仓单管理列表，不产生任何单据。",
          },
          {
            label: "终态",
            content:
              "审批通过后状态置为【注销】，列表与详情操作仅保留【详情】【下载】。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-ops-inbound",
    targetId: "receipt-ops-inbound",
    number: 6,
    kind: "规则",
    title: "仓单入库关联单号自动锁定（R-DWR-10）",
    content:
      "从仓单条目发起入库时，入库类型自动锁定为「仓单入库」、关联单号锁定为当前 CD 编号，两项均置灰不可修改；入库审批通过后新批次自动并入该仓单。",
    documentRefs: {
      fields: { section: "五、操作字段子清单索引", match: "06 仓单入库字段清单" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-10" },
    },
    details: [
      {
        title: "锁定字段",
        items: [
          {
            label: "入库类型",
            content: "固定「仓单入库」，置灰只读。",
          },
          {
            label: "关联单号",
            content: "固定当前仓单编号（CD...），置灰只读。",
          },
          {
            label: "仓库与货主",
            content: "按仓单带出，不可跨仓入库。",
          },
        ],
      },
    ],
  },
]
