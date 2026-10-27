import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const goodsFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "goods-form-page",
    targetId: "goods-form-page",
    number: 1,
    kind: "页面",
    title: "新增与编辑货品整页表单",
    content:
      "货品新增和编辑使用独立整页表单，避免长表单塞进弹窗；保存后进入货品详情页。",
    details: [
      {
        title: "页面结构",
        items: [
          {
            label: "分区",
            content:
              "顶部为页面标题与取消、保存操作；下方依次是基础信息、入库收集信息配置两个卡片。",
          },
          {
            label: "离开保护",
            content:
              "表单有未保存修改时，点击取消或关闭浏览器会二次确认，避免误丢填写内容。",
          },
        ],
      },
      {
        title: "编辑准入",
        items: [
          {
            label: "入库单拦截",
            content:
              "【编辑操作入库单强拦截规则】(SKU-F08)：货品已产生入库单时，保存被阻断并提示该货品已有业务数据产生，不可编辑。",
          },
          {
            label: "并发控制",
            content:
              "【并发控制乐观锁与幂等规则】(SKU-F10)：多人同时编辑时，后保存者提示数据已被他人修改，请刷新后重试。",
          },
        ],
      },
    ],
  },
  {
    id: "goods-form-base",
    targetId: "goods-form-base",
    number: 2,
    kind: "字段",
    title: "基础信息与动态规格输入",
    content:
      "先选大类再选品类；品类确定后，系统按品类定义的规格维度动态生成规格输入项。",
    details: [
      {
        title: "基础字段",
        items: [
          {
            label: "货品大类",
            content:
              "下拉单选框，用于缩小品类范围；新增时只展示启用中的大类。",
          },
          {
            label: "所属品类",
            content:
              "下拉单选框，只展示所选大类下启用中的品类；品类决定后续规格输入项。",
          },
          {
            label: "计量参数",
            content:
              "下拉单选框：重量、数量、体积、面积；与单位分开维护。",
          },
          {
            label: "计量单位",
            content:
              "单行文本输入框，可输入吨、公斤、件、包、箱、卷、立方米等；列表按计量参数(单位)展示。",
          },
          {
            label: "动态规格参数",
            content:
              "按品类定义的 1~5 个维度逐项录入，全部必填，例如牌号、规格型号、纯度等级。",
          },
        ],
      },
      {
        title: "唯一性校验",
        items: [
          {
            label: "SKU 组合",
            content:
              "【货品SKU唯一性校验规则】(SKU-F01)：同一品类下，规格取值组合 + 计量参数 + 单位不能重复；重复时提示该货品规格配置已存在，请重新输入。",
          },
          {
            label: "计量参数与单位",
            content:
              "【计量参数与单位分离维护规则】(SKU-F02)：两者独立维护，列表按计量参数(单位)组合展示。",
          },
        ],
      },
    ],
  },
  {
    id: "goods-form-specs",
    targetId: "goods-form-specs",
    number: 3,
    kind: "交互",
    title: "切换品类时的规格项联动",
    content:
      "切换品类后，规格输入项按新品类重新生成；同名规格保留已填值，旧品类的独有规格自动移除。",
    details: [
      {
        title: "联动规则",
        items: [
          {
            label: "维度来源",
            content:
              "规格维度继承自品类管理，不在货品表单里新增或修改维度。",
          },
          {
            label: "取值要求",
            content:
              "每个规格维度都必须填写；保存时与计量参数、单位一起参与唯一性校验。",
          },
        ],
      },
    ],
  },
  {
    id: "goods-form-inbound",
    targetId: "goods-form-inbound",
    number: 4,
    kind: "规则",
    title: "入库收集信息配置",
    content:
      "从系统 17 项预置收集项中勾选，逐项设置是否必填；未勾选的收集项，入库单不会出现该字段。",
    details: [
      {
        title: "配置规则",
        items: [
          {
            label: "预置项来源",
            content:
              "【入库收集信息预置项配置规则】(SKU-F03)：按货品基础类、生产质检类、仓储要求类分组展示 17 项预置收集项。",
          },
          {
            label: "必填设置",
            content:
              "勾选收集项后可以单独设置必填；必填项在入库单提交时强校验，未填写会阻断提交。",
          },
          {
            label: "下游联动",
            content:
              "【入库单动态联动与强校验规则】(SKU-F04)：入库单选择该货品后，按此配置动态渲染采集字段，并对数值区间、日期关系做强校验。",
          },
        ],
      },
      {
        title: "展示口径",
        items: [
          {
            label: "列表摘要",
            content:
              "货品列表只展示收集项数量和必填数量，完整清单在详情页查看。",
          },
        ],
      },
    ],
  },
  {
    id: "goods-form-actions",
    targetId: "goods-form-actions",
    number: 5,
    kind: "交互",
    title: "保存、取消与重复提交防护",
    content:
      "保存前统一校验必填、规格完整性与唯一性；保存成功写入审计字段并进入详情页。",
    details: [
      {
        title: "操作反馈",
        items: [
          {
            label: "保存成功",
            content:
              "新增提示添加成功，编辑提示保存成功，并跳转到该货品详情页。",
          },
          {
            label: "校验失败",
            content:
              "页面底部轻提示说明具体缺失项或重复项，不关闭表单，方便继续修改。",
          },
          {
            label: "防重复提交",
            content:
              "保存过程中按钮置为加载态，避免连续点击产生重复货品。",
          },
        ],
      },
    ],
  },
]
