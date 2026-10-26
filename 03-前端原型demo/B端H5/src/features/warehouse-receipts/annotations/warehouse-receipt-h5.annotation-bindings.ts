import type { H5PrototypeAnnotationBinding } from "@prototype/shared/annotations/prototype-annotation.shared-types"

export const warehouseReceiptH5ListAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "receipt-list-page": {
    targetId: "receipt-h5-list-page",
    contentSuffix:
      "【H5 端差异】入口为「工作台 → 仓储 → 仓单管理」，列表以三段式卡片流展示，不提供 PC 式横向表格。",
  },
  "receipt-list-filter": {
    targetId: "receipt-h5-list-filter",
    contentSuffix:
      "【H5 端差异】首屏仅保留搜索框与仓库/货物/三方登记/状态胶囊，开立时间、制单时间与状态多选收进「更多筛选」抽屉。",
  },
  "receipt-list-table": {
    targetId: "receipt-h5-list-cards",
    contentSuffix:
      "【H5 端差异】卡片头部展示仓单编号与状态，货物名称仅展示摘要，点击后可底部抽屉查看全部货品。",
  },
  "receipt-list-row-actions": {
    targetId: "receipt-h5-list-actions",
    contentSuffix:
      "【H5 端差异】卡片仅保留「详情」与「··· 更多」，8 项操作统一在底部操作面板展开，避免卡片高度跳动。",
  },
  "receipt-list-issue-guide": {
    targetId: "receipt-h5-list-issue",
    contentSuffix:
      "【H5 端差异】移动端直接提供「开立」入口，进入四步开立流程，不再展示扫码引导弹窗。",
  },
}

export const warehouseReceiptH5DetailAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "receipt-detail-page": {
    targetId: "receipt-h5-detail-page",
    contentSuffix:
      "【H5 端差异】详情采用扁平板块 + 顶部摘要卡，返回由 NavBar 承担，不重复 PC 的页头按钮区。",
  },
  "receipt-detail-basic": {
    targetId: "receipt-h5-detail-basic",
    contentSuffix:
      "【H5 端差异】基础信息以「字段名在上、值在下」的扁平板块呈现，无有效值的注销时间不渲染。",
  },
  "receipt-detail-seal": {
    targetId: "receipt-h5-detail-seal",
    contentSuffix:
      "【H5 端差异】PC 的实体圆章收敛为顶部状态胶囊，颜色语义保持一致。",
  },
  "receipt-detail-goods": {
    targetId: "receipt-h5-detail-goods",
    contentSuffix:
      "【H5 端差异】一级货品卡片内直接平铺批次行，最多两层，不再嵌套折叠表格。",
  },
  "receipt-detail-changes": {
    targetId: "receipt-h5-detail-changes",
    contentSuffix:
      "【H5 端差异】变更记录改为纵向流水卡片，单节点聚合时间、类型、摘要与操作人。",
  },
  "receipt-detail-barcode": {
    targetId: "receipt-h5-detail-barcode",
    contentSuffix:
      "【H5 端差异】存货条码由底部抽屉承载，支持一键复制条码编号。",
  },
}

export const warehouseReceiptH5InitiateAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "receipt-initiate-page": {
    targetId: "receipt-h5-initiate-page",
    contentSuffix:
      "【H5 端差异】开立收敛为「基础信息 → 货品明细」两步，协议与电子签章在点击「提交」后的签章面板完成。",
  },
  "receipt-initiate-owner": {
    targetId: "receipt-h5-initiate-owner",
    contentSuffix:
      "【H5 端差异】基础信息页仅维护货主与企业经办人，仓库在下一步「添加货物」时选择。",
  },
  "receipt-initiate-goods": {
    targetId: "receipt-h5-initiate-goods",
    contentSuffix:
      "【H5 端差异】货品明细页默认展示空态，点击「添加货物」后在面板内选择仓库，并按先入先出或自定义圈选。",
  },
  "receipt-initiate-confirm": {
    targetId: "receipt-h5-initiate-confirm",
    contentSuffix:
      "【H5 端差异】协议与提交确认合并到提交后的签章面板，不再单独占用一个步骤。",
  },
  "receipt-initiate-sign": {
    targetId: "receipt-h5-initiate-sign",
    contentSuffix:
      "【H5 端差异】人脸识别与短信验证码在提交面板内依次完成，两项通过后才点亮「提交申请」。",
  },
}

export const warehouseReceiptH5OpsAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "receipt-ops-outbound": {
    targetId: "receipt-h5-ops-outbound",
    contentSuffix:
      "【H5 端差异】出库分「选货 → 提货信息」两步，全选货物时立即弹窗阻断并清空选择。",
  },
  "receipt-ops-relocate": {
    targetId: "receipt-h5-ops-relocate",
    contentSuffix:
      "【H5 端差异】目标库房、分区与垛位通过三级底部选择面板逐级下钻，目标仓库只读。",
  },
  "receipt-ops-replenish": {
    targetId: "receipt-h5-ops-replenish",
    contentSuffix:
      "【H5 端差异】同仓同货主可用库存以卡片列出，每张卡片直接录入本次补货数量。",
  },
  "receipt-ops-remove": {
    targetId: "receipt-h5-ops-remove",
    contentSuffix:
      "【H5 端差异】逐批次选择整批或部分移除，解绑后状态固定展示为【存货中】。",
  },
  "receipt-ops-cancel": {
    targetId: "receipt-h5-ops-cancel",
    contentSuffix:
      "【H5 端差异】重要提醒页需 10 秒倒计时读完才可点「下一步」，二次确认后进入电子签章。",
  },
  "receipt-ops-inbound": {
    targetId: "receipt-h5-ops-inbound",
    contentSuffix:
      "【H5 端差异】仓单入库在移动端复用入库发起表单，入库类型与关联单号置灰锁定。",
  },
}
