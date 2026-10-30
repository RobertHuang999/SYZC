import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const goodsDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "goods-detail-header",
    targetId: "goods-detail-header",
    number: 1,
    kind: "页面",
    title: "货品详情与自身/有效双层状态",
    content:
      "详情页全量只读展示货品主数据、规格、入库收集配置、系统参考单价与操作留痕。",
    documentRefs: {
      prd: { section: "5. 状态机与动作能力矩阵", match: "有效启用" },
      rules: { section: "二、状态定义与有效启用计算模型", match: "SKU-F11" },
    },
    details: [
      {
        title: "状态口径",
        items: [
          {
            label: "自身状态",
            content:
              "货品自己的启停开关；停用后不能在下游新建单据中选择。",
          },
          {
            label: "有效状态",
            content:
              "【有效启用状态多级综合计算规则】(SKU-F11)：自身、品类、大类三者全部启用才是有效启用；上级停用时，详情页会明确提示无效原因。",
          },
        ],
      },
      {
        title: "操作入口",
        items: [
          {
            label: "返回与编辑",
            content:
              "返回货品列表（保留所属品类选中态）；编辑进入整页表单，已产生入库单时点击编辑直接弹窗拦截提示「该货品已有业务数据产生，不可编辑！」。",
          },
        ],
      },
    ],
  },
  {
    id: "goods-detail-base",
    targetId: "goods-detail-base",
    number: 2,
    kind: "字段",
    title: "基础规格档案与双精度单价",
    content:
      "展示所属大类与品类、计量参数与单位、动态规格取值、系统参考单价（元保留 2~6 位小数，万元保留 10 位小数）及价格趋势入口。",
    documentRefs: {
      fields: { section: "一、业务字段", match: "系统参考单价" },
      rules: { section: "三、核心业务规则", match: "SKU-F05" },
    },
    details: [
      {
        title: "字段说明",
        items: [
          {
            label: "所属大类 / 品类",
            content:
              "继承大类管理与品类管理，详情页只读展示，不在本页修改归属关系。",
          },
          {
            label: "规格参数",
            content:
              "按品类定义的规格维度逐项展示取值；历史单据保留当时的规格快照。",
          },
          {
            label: "系统参考单价",
            content:
              "【系统参考单价维护与双精度展示规则】(SKU-F05)：支持元与万元（10 位小数）同屏对照，点击「价格趋势」可查看近期价格曲线。",
          },
        ],
      },
    ],
  },
  {
    id: "goods-detail-inbound",
    version: "6.3",
    targetId: "goods-detail-inbound",
    number: 3,
    kind: "字段",
    title: "6.3 变更 · 入库收集信息配置 (SKU-F03 / SKU-F04 / SKU-F12)",
    content:
      "按配置顺序展示已勾选的 07 收集项、控件类型、是否必填、保质期固定单位与建议默认值，以及下拉单选框勾选的适用候选项。",
    documentRefs: {
      prd: { section: "4. 业务场景", match: "SKU-S02" },
      fields: { section: "1.1 入库收集信息配置", match: "保质期固定单位" },
      rules: { section: "三、核心业务规则", match: "SKU-F12" },
    },
    details: [
      {
        title: "6.3 版本迭代调整对照（调整前 → 调整后）",
        items: [
          {
            label: "详情页展示升级",
            content: `| 展示维度 | 调整前（V2.0 基准版） | 调整后（6.3 V2.5 标准联动版） |
| :--- | :--- | :--- |
| **保质期说明列** | 仅显示“周期组合项” | 明确展示 **固定单位（天/个月/年）+ 建议默认数值 + 入库单单位只读锁定说明** |
| **下拉单选框说明列** | 仅显示“下拉单选框” | 明确展示当前货品从 07 枚举池中勾选的 **可选候选项** |
| **底座停用标识** | 无 | 当 07 收集项被停用时，详情行显示 **「底座已停用」** 徽章及降级提示（SKU-F12） |`,
          },
        ],
      },
      {
        title: "配置来源与下游渲染",
        items: [
          {
            label: "收集项来源",
            content:
              "来自 07 字段池引用：名称、控件类型、单位与枚举选项池实时跟随底座；本页只读，编辑入口在货品编辑页。",
          },
          {
            label: "底座停用",
            content:
              "【收集项引用联动规则】(SKU-F12)：07 停用后该行显示「底座已停用」，存量货品与历史入库单不受影响。",
          },
          {
            label: "下游渲染",
            content:
              "【入库单动态联动与单位只读锁定规则】(SKU-F04)：入库单按此清单动态生成字段，保质期单位只读锁定，下拉单选框按适用候选项渲染，并强校验温度/湿度区间、水分/杂质百分比与生产/过期日期逻辑。",
          },
        ],
      },
    ],
  },
  {
    id: "goods-detail-price",
    targetId: "goods-detail-price",
    number: 4,
    kind: "交互",
    title: "参考单价修改记录（元 / 万元 10 位精度）",
    content:
      "按时间倒序展示历次设置价格的审计记录，同时呈现元与万元（保留 10 位小数）双口径。",
    documentRefs: {
      rules: { section: "三、核心业务规则", match: "SKU-F05" },
    },
    details: [
      {
        title: "展示与留痕",
        items: [
          {
            label: "双精度展示",
            content:
              "【系统参考单价维护与双精度展示规则】(SKU-F05)：元展示保留 2~6 位小数并带千分位；万元展示严格保留 10 位小数。",
          },
          {
            label: "设置价格",
            content:
              "录入非负金额，最多 2 位小数；保存后自动写入修改记录，并刷新趋势图最后一个点。",
          },
        ],
      },
    ],
  },
  {
    id: "goods-detail-audit",
    targetId: "goods-detail-audit",
    number: 5,
    kind: "规则",
    title: "系统与审计信息（含数据版本号与快照边界）",
    content:
      "详情页底部展示数据版本号（第 N 版）、创建人、创建时间、最近更新人与更新时间，明确主档变更与历史单据不可变快照边界。",
    documentRefs: {
      fields: { section: "二、状态与系统字段", match: "数据版本号" },
      rules: { section: "三、核心业务规则", match: "SKU-F10" },
    },
    details: [
      {
        title: "留痕规则",
        items: [
          {
            label: "并发与版本控制",
            content:
              "【多人同时编辑防冲突与防重复提交规则】(SKU-F10)：新建、编辑、启停、设价均记录操作人、时间并递增数据版本号。",
          },
          {
            label: "价格变更与历史快照",
            content:
              "【价格变更与存量业务计算规则】(SKU-F07)：历次单价调整记录在修改记录中永久保留；历史入库单保留生成时刻的货品名称、规格、单位快照，不随主档修改而回写。",
          },
        ],
      },
    ],
  },
]
