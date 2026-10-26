import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

/** 仓单开立 · 移动端四步流程标注正文（双端共享真源，仅 H5 挂载） */
export const warehouseReceiptInitiateAnnotationsShared: SharedPrototypeAnnotation[] = [
  {
    id: "receipt-initiate-page",
    targetId: "receipt-initiate-page",
    number: 1,
    kind: "页面",
    title: "移动端仓单开立（业务办理 → 业务发起）",
    content:
      "现场人员在移动端按「基础信息 → 货品明细」两步开立数字仓单；电子协议、人脸活体与短信验证码在点击「提交」后的签章面板完成，签署成功后生成 CD + 19 位全局唯一编号。",
    documentRefs: {
      prd: { section: "6. 页面交互规格索引", match: "移动端" },
      fields: { section: "五、操作字段子清单索引", match: "01 仓单开立字段清单" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-06" },
    },
    details: [
      {
        title: "合规要求",
        items: [
          {
            label: "现场核验",
            content:
              "开立必须在现场完成，确保物理货位与批次真实存在，不允许脱离库存虚构开单。",
          },
          {
            label: "双因子",
            content:
              "必须完成人脸活体识别 + 绑定手机 6 位短信验证码，二者缺一不可提交。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-initiate-owner",
    targetId: "receipt-initiate-owner",
    number: 2,
    kind: "字段",
    title: "货主信息与经办人",
    content:
      "选择企业或个人货主，货主标识与身份证号由档案自动带出并脱敏展示；企业货主需在同一页补录经办人姓名、手机号与身份证号。",
    documentRefs: {
      fields: { section: "五、操作字段子清单索引", match: "货主类型" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-01" },
    },
    details: [
      {
        title: "字段规则",
        items: [
          {
            label: "货主类型",
            content: "企业 / 个人单选；切换时重置下方证件与名称项。",
          },
          {
            label: "货主标识",
            content:
              "个人为脱敏手机号，企业为统一社会信用代码，均由档案带出不可手改。",
          },
          {
            label: "身份证号",
            content: "仅个人货主必填，用于活体核验比对，界面脱敏展示。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-initiate-goods",
    targetId: "receipt-initiate-goods",
    number: 3,
    kind: "交互",
    title: "在库货物圈选与精确到垛位",
    content:
      "点击「添加货物」后在面板内选择仓库，展示该货主在该仓库内【存货中】且可用数量大于 0 的未占用库存；支持先入先出（FIFO）快捷开立与自定义圈选，单次开立最多 50 组货物。",
    documentRefs: {
      fields: { section: "五、操作字段子清单索引", match: "批次开立数量" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-02" },
    },
    details: [
      {
        title: "圈选约束",
        items: [
          {
            label: "准入条件",
            content:
              "货主一致、仓库一致、状态为【存货中】、可用数量大于 0，任一不满足即不可选。",
          },
          {
            label: "批次锚点",
            content:
              "选中即锁定「仓库-库房-分区-具体位置」与存货条码，防止重复开单。",
          },
          {
            label: "扣货方式",
            content:
              "先入先出为默认方式：选定货品后录入总开立数量（或点全部开立），系统按入库时间从早到晚自动圈选批次，最后一批不足时按部分数量开立；自定义方式逐批勾选货物。",
          },
          {
            label: "数量",
            content:
              "先入先出录入总开立数量，须大于 0 且不超过该货品可开立总量；自定义逐批录入，须大于 0 且不超过该批次可用数量。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-initiate-confirm",
    targetId: "receipt-initiate-confirm",
    number: 4,
    kind: "字段",
    title: "提交确认与协议签署",
    content:
      "货品明细页点击「提交」后在签章面板核对本次开立摘要，并显式勾选已阅读并同意《电子仓单法律协议》。",
    documentRefs: {
      fields: { section: "五、操作字段子清单索引", match: "签约方式" },
      prd: { section: "场景 1【现场实名开具电子仓单】(S01)", match: "签署电子仓单" },
    },
    details: [
      {
        title: "确认口径",
        items: [
          {
            label: "企业经办人",
            content:
              "在「基础信息」页录入；姓名、11 位手机号、18 位身份证号均为必填，任一校验失败阻断进入下一步。",
          },
          {
            label: "协议",
            content:
              "在提交后的签章面板勾选，未勾选时提交按钮不可用并提示「请勾选协议后提交」。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-initiate-sign",
    targetId: "receipt-initiate-sign",
    number: 5,
    kind: "规则",
    title: "电子签章：人脸活体 + 短信验证码（R-DWR-06）",
    content:
      "先完成活体人脸识别，通过后才激活短信验证码；验证码 6 位、有效期 5 分钟，发送后 60 秒倒计时防刷，错误超过 5 次锁定本次开单 30 分钟。",
    documentRefs: {
      rules: { section: "2. 规则详细规格", match: "R-DWR-06" },
      prd: { section: "场景 1【现场实名开具电子仓单】(S01)", match: "活体人脸识别" },
    },
    details: [
      {
        title: "提交前置",
        items: [
          {
            label: "三项就绪",
            content: "人脸已通过、验证码校验通过、协议已勾选，底部提交按钮才可用。",
          },
          {
            label: "失败提示",
            content:
              "人脸不符提示「人脸识别未通过，请调整光线或端正坐姿后重新核验」，不允许跳过。",
          },
          {
            label: "成果",
            content:
              "提交后生成仓单并固化防伪哈希，可查看仓单详情或返回仓单管理。",
          },
        ],
      },
    ],
  },
]
