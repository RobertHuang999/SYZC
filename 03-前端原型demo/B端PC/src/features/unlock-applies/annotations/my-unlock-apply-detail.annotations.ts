import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const myUnlockApplyDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "my-unlock-apply-detail-page",
    targetId: "my-unlock-apply-detail-page",
    number: 1,
    kind: "页面",
    title: "开锁申请详情 · 申请人视角",
    content:
      "从 Tab「我的开锁申请」或 Deep link 进入；只读展示申请快照、审批记录与凭证；待审批时可撤回。6.2 不展示关联事务（W00）。",
    details: [
      {
        title: "页面结构",
        items: [
          {
            label: "页头",
            content: "申请单号 + 申请状态 Tag + 凭证状态 Tag；待审批展示「撤回」按钮。",
          },
          {
            label: "分区",
            content:
              "基础信息 / 设备与位置快照 / 申请内容 / 审批配置快照 / 审批记录 / 凭证信息。规则见 [02查看与下发凭证字段清单] §三。",
          },
          {
            label: "返回",
            content: "返回列表保留 `?tab=unlock-applies`；支持 return_route 回跳门禁设备。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-credential",
    targetId: "my-unlock-apply-detail-credential",
    number: 2,
    kind: "规则",
    title: "凭证信息 · 挂锁/人脸统一规则",
    content:
      "规则来源：业务规则规格 §4.1 / §4.4、02查看与下发凭证 §三。挂锁/人脸统一：密码服务成功→已下发；密码服务失败→生成失败（可重新获取）。短信失败、三方下发结果均不影响凭证状态。",
    details: [
      {
        title: "详情区",
        items: [
          {
            label: "挂锁 · 已下发",
            content: "展示密码 + 复制；短信成败不进凭证状态。",
          },
          {
            label: "挂锁/人脸 · 生成失败",
            content: "GEN_FAILED=密码服务失败；展示失败原因 +「重新获取密码」。样例 26008（挂锁）、26011（人脸）。",
          },
          {
            label: "挂锁 · 短信失败",
            content: "26009：凭证仍=已下发，详情有密码；remark 标注短信网关失败。",
          },
          {
            label: "人脸 · 三方失败",
            content: "26010：凭证仍=已下发，详情有密码；remark 标注三方终端失败。",
          },
          {
            label: "人脸 · 已下发",
            content: "展示密码 + 复制；三方下发成败不进凭证状态。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-approval",
    targetId: "my-unlock-apply-detail-approval",
    number: 3,
    kind: "字段",
    title: "审批配置快照与审批记录",
    content: "展示提交瞬间固化的配置编号、版本、审批方式、超时与节点；在途申请不受配置后续变更影响（C05）。",
    details: [
      {
        title: "快照字段",
        items: [
          {
            label: "配置编号 / 版本",
            content: "如 UNLOCK-CFG-001 · v2；与 06 审批配置模块关联。",
          },
          {
            label: "审批超时",
            content: "如 12 小时；超时未审自动关闭规则见业务规则规格。",
          },
          {
            label: "审批记录表",
            content: "节点 / 处理人 / 结果 / 意见或驳回原因 / 处理时间；待审批时「暂无记录，等待审批」。",
          },
          {
            label: "驳回原因",
            content: "已驳回时在审批记录区或独立字段展示 rejectReason。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-withdraw",
    targetId: "my-unlock-apply-detail-page",
    number: 4,
    kind: "规则",
    title: "撤回确认",
    content: "撤回二次确认；仅待审批且 needsApproval 时可操作。",
    details: [
      {
        title: "撤回弹窗",
        items: [
          {
            label: "文案",
            content: "确认撤回该开锁申请？撤回后审批人将无法继续处理。",
          },
          {
            label: "并发",
            content: "提交时若状态已非待审批，提示「撤回失败：申请状态已变更」。",
          },
        ],
      },
    ],
  },
]
