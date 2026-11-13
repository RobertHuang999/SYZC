import type { H5PrototypeAnnotationBinding } from "@prototype/shared/annotations/prototype-annotation.shared-types"

export const rejectPoolH5ListAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "reject-pool-page": {
    targetId: "reject-pool-h5-list-page",
    contentSuffix:
      "【H5 端差异】入口为「工作台 → 融资/监管 → 被拒退回记录池」，采用顶部 NavBar 与三大异常胶囊标签页（线索被拒 / 尽调失败 / 授信失败）。",
  },
  "reject-pool-tabs": {
    targetId: "reject-pool-h5-tabs",
    contentSuffix:
      "【H5 端差异】移动端在顶部呈现紧凑统计横条（待处理、超期大于 72 小时、熔断数）及三分类切换栏，支持横向划动切换。",
  },
  "reject-pool-filter": {
    targetId: "reject-pool-h5-filter",
    contentSuffix:
      "【H5 端差异】采用 H5_FILTER_BAR：首屏露出单号/关键字搜索框与「需要尽调」「停滞状态」下拉胶囊，其余状态与时间筛选收进「更多筛选」底部抽屉。",
  },
  "reject-pool-table": {
    targetId: "reject-pool-h5-cards",
    contentSuffix:
      "【H5 端差异】PC 横向表格改为五段式移动端卡片流：头部单号与业务状态、主体名称与产品、指标行（含末次被拒原因高亮条与超期/熔断标识）、经办人时间、底部操作胶囊。",
  },
  "reject-pool-actions": {
    targetId: "reject-pool-h5-cards",
    contentSuffix:
      "【H5 端差异】每张卡片底部胶囊数量控制在 4 个以内，点击重调度动作在手机视口内唤起底部半屏操作抽屉与二次确认弹层。",
  },
}

export const rejectPoolH5DetailAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "reject-pool-detail-header": {
    targetId: "reject-pool-h5-detail-header",
    contentSuffix:
      "【H5 端差异】顶部由 NavBar 承担返回与标题，状态摘要卡高亮显示单号、超期与 5 次熔断提示；操作按钮固定于页面底部栏。",
  },
  "reject-pool-detail-overview": {
    targetId: "reject-pool-h5-detail-overview",
    contentSuffix:
      "【H5 端差异】使用 SectionCard + 左标签右值键值对卡片展示，末次被拒原因单独以浅红提示条高亮呈现。",
  },
  "reject-pool-detail-applicant": {
    targetId: "reject-pool-h5-detail-applicant",
    contentSuffix:
      "【H5 端差异】按企业货主与个人货主动态显隐对应字段，营业执照支持点击轻预览弹窗。",
  },
  "reject-pool-detail-collateral": {
    targetId: "reject-pool-h5-detail-collateral",
    contentSuffix:
      "【H5 端差异】现货存货改为单列堆叠明细卡，数字仓单编号可直接跳转 H5 仓单详情页。",
  },
  "reject-pool-detail-timeline": {
    targetId: "reject-pool-h5-detail-timeline",
    contentSuffix:
      "【H5 端差异】多轮重调度与历次被拒履历采用纵向节点时间轴，单卡片清晰展示批次号、经办人与驳回批语。",
  },
}

