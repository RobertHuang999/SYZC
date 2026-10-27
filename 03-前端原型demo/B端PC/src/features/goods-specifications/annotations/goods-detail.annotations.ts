import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const goodsDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "goods-detail-header",
    targetId: "goods-detail-header",
    number: 1,
    kind: "页面",
    title: "货品详情与双层状态",
    content:
      "详情页全量只读展示货品主数据、规格、入库收集配置、单价与操作留痕，并从列表跳转而来。",
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
              "返回货品列表；编辑进入整页表单，已产生入库单时保存会被拦截。",
          },
          {
            label: "删除",
            content:
              "【两阶段安全删除控制规则】(SKU-F09)：启用中不可删除；已产生入库单也不可删除。",
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
    title: "基础信息与规格清单",
    content:
      "展示货品标识、所属大类与品类、计量参数与单位、动态规格取值、创建与更新信息。",
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
            label: "审计字段",
            content:
              "创建人、创建时间、更新人、更新时间、数据版本号由服务端生成，前端不可篡改。",
          },
        ],
      },
    ],
  },
  {
    id: "goods-detail-inbound",
    targetId: "goods-detail-inbound",
    number: 3,
    kind: "字段",
    title: "入库收集信息清单",
    content:
      "按配置顺序展示已勾选的收集项、控件类型和是否必填；未配置时明确提示入库单不会采集额外信息。",
    details: [
      {
        title: "配置来源",
        items: [
          {
            label: "收集项",
            content:
              "来自货品建档时勾选的 17 项预置收集项；本页只读，编辑入口在货品编辑页。",
          },
          {
            label: "必填标记",
            content:
              "必填项在入库单提交时强校验；选填项允许留空。",
          },
          {
            label: "下游渲染",
            content:
              "【入库单动态联动与强校验规则】(SKU-F04)：入库单按此清单动态生成字段，并校验温度/湿度区间、水分/杂质范围与日期关系。",
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
    title: "参考单价、修改记录与价格趋势",
    content:
      "同时展示元与万元两种口径，提供近 7 / 15 / 30 天价格趋势，并可查看完整修改记录。",
    details: [
      {
        title: "展示与留痕",
        items: [
          {
            label: "双精度展示",
            content:
              "【参考单价维护与双精度展示规则】(SKU-F05)：元展示保留 6 位小数并带千分位；万元展示保留 10 位小数。",
          },
          {
            label: "设置价格",
            content:
              "录入非负金额，最多 2 位小数；保存后自动写入修改记录，并刷新趋势图最后一个点。",
          },
          {
            label: "未设置单价",
            content:
              "【未设置单价下游统一提示规则】(SKU-F06)：未设价时展示 --，下游业务单据统一提示系统未设置的单价。",
          },
        ],
      },
      {
        title: "价格趋势",
        items: [
          {
            label: "趋势来源",
            content:
              "趋势图按日聚合参考单价，支持近 7 / 15 / 30 天切换；仅用于辅助判断，不替代设价记录。",
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
    title: "操作留痕与快照边界",
    content:
      "详情页汇总创建、最近更新与每次设价记录，形成可追溯的操作留痕。",
    details: [
      {
        title: "留痕规则",
        items: [
          {
            label: "全路径审计",
            content:
              "新建、编辑、启停、设价、删除均记录操作人、时间、前后数据镜像；详情页展示业务可见部分。",
          },
          {
            label: "快照不可变",
            content:
              "历史入库单、仓单与质押单据保留生成时刻的货品名称、规格、单位和价格快照，不随主档修改而回写。",
          },
        ],
      },
    ],
  },
]
