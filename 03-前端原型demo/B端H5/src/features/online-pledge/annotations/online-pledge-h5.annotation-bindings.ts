import type { H5PrototypeAnnotationBinding } from "@prototype/shared/annotations/prototype-annotation.shared-types"

export const onlinePledgeH5ListAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "online-pledge-page": {
    targetId: "online-pledge-h5-list-page",
    contentSuffix:
      "【H5 端差异】入口为「工作台 → 融资/监管 → 线上监管业务办理」，采用顶部 NavBar 与状态胶囊筛选。",
  },
  "online-pledge-filter": {
    targetId: "online-pledge-h5-filter",
    contentSuffix:
      "【H5 端差异】移动端采用搜索框 + 状态胶囊 + 底部筛选抽屉。",
  },
  "online-pledge-table": {
    targetId: "online-pledge-h5-cards",
    contentSuffix:
      "【H5 端差异】移动端采用五段式业务卡片，操作胶囊一行最多 4 个。",
  },
}

export const onlinePledgeH5DetailAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "online-pledge-detail-header": {
    targetId: "online-pledge-h5-detail-header",
    contentSuffix: "【H5 端差异】顶部摘要卡展示单号、状态徽章与 4 步生命周期进度。",
  },
  "online-pledge-detail-credit": {
    targetId: "online-pledge-h5-detail-credit",
    contentSuffix: "【H5 端差异】基本授信与申请人信息采用左名右值 KV 行布局。",
  },
  "online-pledge-detail-collateral": {
    targetId: "online-pledge-h5-detail-collateral",
    contentSuffix: "【H5 端差异】质押标的与电子存证支持点击仓单编号跳转仓单详情。",
  },
  "online-pledge-detail-disbursement": {
    targetId: "online-pledge-h5-detail-disbursement",
    contentSuffix: "【H5 端差异】放款明细与流转日志采用折叠/卡片分块展示。",
  },
}
