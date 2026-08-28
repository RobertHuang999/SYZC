import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApprovalConfigListAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-approval-config-page",
    targetId: "unlock-approval-config-page",
    number: 1,
    kind: "页面",
    title: "开锁审批配置定位与生命周期",
    content:
      "配置管理 → 业务流程管理 → 开锁审批。维护按仓库/库房/分区/设备差异化的开锁审批策略；保存后直接已启用，无草稿态、无物理删除。",
    details: [
      {
        title: "配置生命周期流转图",
        items: [
          {
            label: "状态流转图",
            content: `stateDiagram-v2
    [*] --> 已启用 : 新增保存（校验通过）
    已启用 --> 已停用 : 停用
    已启用 --> 已启用 : 修改保存（生成新版本，旧版本→已停用）
    已停用 --> 已启用 : 启用
    已停用 --> [*] : 历史保留（只读）`,
          },
          {
            label: "三态语义",
            content:
              "已启用=对新申请生效；已停用=不再匹配新申请但保留快照追溯；修改已启用配置时旧版本自动→已停用、新版本→已启用且配置版本+1（C06）。",
          },
        ],
      },
      {
        title: "上下游与职责边界",
        items: [
          {
            label: "上游依赖",
            content:
              "仓库档案（适用仓库/库房/分区）、门禁设备主数据（适用设备，仅挂锁/人脸门禁）、人员账号与 RBAC 角色（审批节点）。",
          },
          {
            label: "下游影响",
            content:
              "门禁设备模块获取密码时按 C01–C04 匹配已启用配置；命中后开锁申请固化配置编号+配置版本+审批节点快照，在途申请不受后续变更影响（C05）。",
          },
          {
            label: "权限",
            content: "列表 P01；新增/编辑/启停 P02 子权限。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-filter",
    targetId: "unlock-approval-config-filter",
    number: 2,
    kind: "交互",
    title: "组合筛选与全局审批开关联动",
    content:
      "筛选为草稿态，点击「查询」或 Enter 后生效；查询/重置均将页码归 1。默认 4 列 + 展开 3 列。",
    details: [
      {
        title: "默认行字段",
        items: [
          {
            label: "配置名称",
            content: "Input 模糊匹配；placeholder「请输入配置名称」；对应字段清单「配置名称」可筛选=是。",
          },
          {
            label: "适用范围类型",
            content:
              "Select 单选：全部 / 仓库 / 库房 / 分区 / 指定设备 / 未绑定位置全局。? 提示：选「未绑定位置全局」后展开筛选将出现全局审批开关。",
          },
          {
            label: "审批方式",
            content: "Select：全部 / 任一人通过 / 按顺序审批。",
          },
          {
            label: "状态",
            content: "Select：全部 / 已启用 / 已停用。注意：这是配置生命周期状态，与开锁申请状态语义不同。",
          },
        ],
      },
      {
        title: "展开行字段（V1.1 联动）",
        items: [
          {
            label: "配置编号",
            content: "Input 精确匹配；展开筛选展示。",
          },
          {
            label: "适用仓库",
            content: "Select 全部在管仓库；P02 数据权限过滤可见仓库范围。",
          },
          {
            label: "全局审批开关",
            content:
              "【联动显隐】仅当「适用范围类型 = 未绑定位置全局」时展示 Select（全部/开启/关闭）；否则展示灰色占位「将适用范围类型选为未绑定位置全局后，可筛选全局审批开关」。切换类型时自动重置为「全部」。",
          },
        ],
      },
      {
        title: "全局开关 Tooltip 语义",
        items: [
          {
            label: "业务含义",
            content:
              "控制未绑定仓库/库房/分区/指定设备的门禁，开锁时是否走审批。关闭=免审直发密码；开启=进入全局审批（C04）。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-table",
    targetId: "unlock-approval-config-table",
    number: 3,
    kind: "字段",
    title: "表格字段、摘要渲染与展示格式",
    content:
      "列顺序对齐字段清单第四章：序号→配置编号→配置名称→适用范围类型→适用仓库/设备摘要→审批方式→审批超时→配置版本→状态→创建人/时间→操作。",
    details: [
      {
        title: "列定义",
        items: [
          {
            label: "序号",
            content: "当前页从 1 起；翻页按 (page-1)×pageSize+index+1 重算。",
          },
          {
            label: "配置编号",
            content: "链接色，点击跳转详情；租户内唯一，修改版本沿用原编号。",
          },
          {
            label: "配置名称",
            content: "左固定列；链接跳转详情；租户内唯一（R04a）。",
          },
          {
            label: "适用范围类型",
            content: "5 类枚举：仓库 / 库房 / 分区 / 指定设备 / 未绑定位置全局。",
          },
          {
            label: "适用仓库/设备摘要",
            content:
              "仓库→「华南二号仓」；库房→「华东一号仓 / A库」；分区→「华北三号仓 / 1号库 / 1区」；指定设备→「华东一号仓 / 已选 3 台」；未绑定位置全局→「全局开关=开启/关闭」。",
          },
          {
            label: "审批方式 / 审批超时 / 配置版本",
            content: "审批方式枚举文本；超时如「24 小时」；版本如「v1」「v3」。",
          },
          {
            label: "状态 Tag",
            content: "已启用（绿色）/ 已停用（灰色）。",
          },
          {
            label: "创建人/时间",
            content: "合并一列；创建人格式「姓名（所属机构）」/ MM-DD HH:mm。",
          },
        ],
      },
      {
        title: "不展示列",
        items: [
          {
            label: "隐藏字段",
            content: "适用库房/分区明细、审批节点、Version、停用原因、操作审计日志（后台可查）。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-row-actions",
    targetId: "unlock-approval-config-table",
    number: 4,
    kind: "规则",
    title: "状态 × 行操作能力矩阵",
    content: "严格遵循业务规则规格第五章动作能力矩阵；不渲染 disabled 操作，无权限时整按钮隐藏。",
    details: [
      {
        title: "展示矩阵",
        items: [
          {
            label: "已启用",
            content: "编辑（跳转编辑页，保存生成新版本）/ 详情 / 停用。",
          },
          {
            label: "已停用",
            content: "详情 / 启用（无编辑入口，R06：调范围须停用后新增）。",
          },
          {
            label: "不提供",
            content: "删除（C08）、导出。",
          },
        ],
      },
      {
        title: "停用 / 启用规则",
        items: [
          {
            label: "停用（C07）",
            content:
              "二次确认 + 必填停用原因（≤200 字）；只影响新申请匹配，在途申请继续使用停用前配置快照。",
          },
          {
            label: "启用",
            content: "二次确认「启用后新申请将按本配置匹配」；重跑 R01–R04、R27、R29 校验。",
          },
          {
            label: "失败处理",
            content: "Toast「停用/启用失败：{具体原因}」或「配置状态已变更」。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-disable-dialog",
    targetId: "unlock-approval-config-table",
    number: 5,
    kind: "规则",
    title: "停用确认弹窗与停用原因",
    content: "停用动作为独立二次确认，须填写停用原因后提交；启用时不展示停用原因。",
    details: [
      {
        title: "弹窗规格",
        items: [
          {
            label: "标题 / 内容",
            content: "确认停用；「停用后新申请不再命中本配置，在途申请不受影响，确认停用？」",
          },
          {
            label: "停用原因",
            content: "Textarea 必填，≤200 字；写入配置记录，详情页已停用时展示。",
          },
          {
            label: "成功反馈",
            content: "Toast「停用成功」；列表状态 Tag 变为已停用。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-pagination",
    targetId: "unlock-approval-config-pagination",
    number: 6,
    kind: "交互",
    title: "分页、页容量与空态",
    content: "默认 10 条/页，可选 10/20/50；空态「暂无开锁审批配置，点击「+ 新增配置」创建」。",
    details: [
      {
        title: "分页行为",
        items: [
          {
            label: "页码重置",
            content: "检索条件变更、切换分页尺寸、查询或重置时自动回到第 1 页。",
          },
          {
            label: "排序",
            content: "默认按更新时间 DESC；序号仅按当前页重算。",
          },
        ],
      },
    ],
  },
]
