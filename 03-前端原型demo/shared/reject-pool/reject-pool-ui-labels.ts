/**
 * 被拒退回池 · 双端通用文案真源
 *
 * 分层规范：
 * - *_USER_* 仅用于 ProductFieldHint / 弹窗面向用户的通俗提示（严禁带规则编号）
 * - *_SPEC_* 仅用于 PrototypeSpecCallout 原型规格对照（含【规则名称】(编号)，非生产界面文案）
 */

export const REJECT_POOL_PAGE_USER_DESC =
  "集中管理融资线索驳回、尽调风控未通过及资方授信拒绝单据，支持修正资料救活、更换尽调专员或重新分配资金方。"

export const REJECT_POOL_PAGE_SPEC_NOTE =
  "【三大页签精准收口归集规则】(R01)：按退回来源自动归入「线索被拒 / 尽调失败 / 授信失败」，默认按停滞时长降序置顶超期单据；停滞超过 72 小时触发【被拒停滞超期警示计算口径】(C01)，累计被拒达 5 次触发【五次被拒熔断保护机制】(W02)。"

export const REJECT_POOL_REVIVE_USER_HINT =
  "核对并修正申请人信息、融资金额与担保物资料后提交，系统将重新把该申请送回线索待受理队列。"

export const REJECT_POOL_REVIVE_SPEC_NOTE =
  "场景 S01 ·【三大页签精准收口归集规则】(R01)：救活成功后移出被拒退回池，恢复线索状态为「待受理」并计入【异常挽回率与拒单统计指标】(C02)。"

export const REJECT_POOL_ROUTE_ASSIGN_USER_HINT =
  "系统已按该产品申请时的风控流程自动识别去向：需要尽调则分派给尽调专员，免尽调则直接分派合作资金方。"

export const REJECT_POOL_ROUTE_ASSIGN_SPEC_NOTE =
  "场景 S02 · 依据线索快照「需要尽调」分流至尽调办理（待尽调）或授信办理（授信已受理），受【单据级分布式操作锁防护】(W01) 与【防并发重复重调度互斥锁规则】(R06) 保护。"

export const REJECT_POOL_REINIT_DILIGENCE_USER_HINT =
  "请选择一位在职尽调专员接手复核（不可指派上一轮退回本单的专员），系统将生成新一轮尽调任务。"

export const REJECT_POOL_REINIT_DILIGENCE_SPEC_NOTE =
  "场景 S03 ·【多轮重调度批次审计与不可篡改规则】(R04)：自动递增重调度批次号（如 apply_no-B02），原轮次被拒底稿与批语只读留痕。"

export const REJECT_POOL_SKIP_DILIGENCE_USER_HINT =
  "跳过现场尽调并直接推送给合作资金方，请详细填写不少于 20 字的风控特批免尽调依据。"

export const REJECT_POOL_SKIP_DILIGENCE_SPEC_NOTE =
  "场景 S04 ·【历史已拒资方可选与警示规则】(R03)：确认后将「需要尽调」快照更新为否，直接生成授信任务推送至「授信已受理」。"

export const REJECT_POOL_REASSIGN_FUNDER_USER_HINT =
  "该申请原尽调结论继续有效，请选择新的合作资金方重新发起授信；标注「*历史曾拒」的机构仍可再次发起。"

export const REJECT_POOL_REASSIGN_FUNDER_SPEC_NOTE =
  "场景 S05 ·【授信失败重调度专属规则】(R02) +【历史已拒资方可选与警示规则】(R03) +【跨资方商业机密与拒绝原因脱敏规则】(P02)：向新资方隐藏前序资方内部审批备注。"

export const REJECT_POOL_CIRCUIT_BREAKER_USER_HINT =
  "该融资申请累计被拒已达到 5 次上限，线上重调度入口已锁定，请联系风控部门走线下特批流程解除。"

export const REJECT_POOL_CIRCUIT_BREAKER_SPEC_NOTE =
  "【五次被拒熔断保护机制】(W02)：单笔申请累计入池达 5 次后自动熔断锁定，禁止再次通过线上救活或改派重调度。"

