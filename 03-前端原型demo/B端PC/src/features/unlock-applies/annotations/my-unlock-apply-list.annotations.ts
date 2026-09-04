import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const myUnlockApplyListAnnotations: PrototypeAnnotation[] = [
  {
    id: "my-unlock-apply-page",
    targetId: "my-unlock-apply-page",
    number: 1,
    kind: "页面",
    title: "我的申请管理 · 开锁 Tab 定位",
    content:
      "工作中心 → 审批中心 → 我的申请管理 → Tab「我的开锁申请」。仅展示当前登录人（zhang3）发起的 UNLOCK_APPLY，不提供列表页新增入口。",
    details: [
      {
        title: "Tab 壳层与分流",
        items: [
          {
            label: "三 Tab 结构",
            content:
              "我的流程申请（默认）/ 我的政策资讯申请（占位）/ 我的开锁申请（6.2 交付）。Tab 切换写入 URL `?tab=unlock-applies`。",
          },
          {
            label: "与审批中心关系",
            content:
              "开锁审批不进平台「待处理/已处理」；审批人走「其他审批 → 开锁审核」。申请人仅在本 Tab 与 H5「我的申请记录」查看。",
          },
          {
            label: "Deep link",
            content:
              "门禁设备提交成功后 `ROUTE-IOT-APPR-01`：`?tab=unlock-applies&applyNo=xxx` 自动跳转详情页。",
          },
        ],
      },
      {
        title: "申请状态流转",
        items: [
          {
            label: "状态流转图",
            content: `stateDiagram-v2
    [*] --> 待审批 : 提交申请
    待审批 --> 已通过 : 审批通过
    待审批 --> 已驳回 : 审批驳回
    待审批 --> 已撤回 : 申请人撤回
    待审批 --> 已失效 : 审批超时（自动 R14）
    已通过 --> [*] : 凭证独立流转（R15/密码服务失败→生成失败，主状态保持已通过）
    已驳回 --> [*]
    已撤回 --> [*]
    已失效 --> [*]`,
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-filter",
    targetId: "my-unlock-apply-filter",
    number: 2,
    kind: "交互",
    title: "筛选区 · 草稿态与默认四列",
    content:
      "筛选为草稿态，点击「查询」或 Enter 后生效；查询/重置页码归 1。切换 Tab 离开再返回保留 sessionStorage 缓存。",
    details: [
      {
        title: "默认行（4 列）",
        items: [
          {
            label: "是否需要审核",
            content:
              "Select：全部（默认）/ 是 / 否。对应 V3.2 规范 R-MYAPP-08：「是」=需审批；「否」=免审直发（approval_required=false，如 UA20260828003）。",
          },
          {
            label: "提交时间",
            content: "DateRange；映射主表创建时间；最大跨度 90 天（PRD 约束，原型未校验跨度）。",
          },
          {
            label: "申请状态",
            content:
              "Select 多选下拉：待审批 / 已通过 / 已驳回 / 已撤回 / 已失效；空选=全部；同字段 OR。",
          },
          {
            label: "凭证状态",
            content:
              "Select 多选：未生成 / 已下发 / 生成失败 / 已过期 / 已失效（被覆盖）；空选=全部。生成失败=密码服务失败（挂锁/人脸统一）。规则见业务规则规格 §4.1。",
          },
        ],
      },
      {
        title: "展开行",
        items: [
          {
            label: "设备名称 / 编码",
            content: "名称模糊；编码精确。",
          },
          {
            label: "设备类型 / 绑定仓库 / 事由 / 配置编号",
            content:
              "设备类型：全部/挂锁门禁/人脸门禁；事由：出库/入库/移库/参观/其他；配置编号精确匹配运维排查。不含申请人筛选项——本 Tab 仅展示当前登录人本人记录。",
          },
          {
            label: "不含申请单号",
            content: "字段清单 §2.1 明确申请单号为隐藏字段，列表不展示；仅详情页展示。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-table",
    targetId: "my-unlock-apply-table",
    number: 3,
    kind: "字段",
    title: "表格列与展示格式",
    content:
      "申请状态列左固定、操作列右固定；不支持行勾选。仅展示 applicantAccount=当前用户 的记录。",
    details: [
      {
        title: "列定义",
        items: [
          {
            label: "申请单号",
            content: "链接色，点击进详情；如 UA20260828001。",
          },
          {
            label: "设备名称 / 类型 / 仓库",
            content: "展示提交时快照；挂锁/人脸图标区分设备类型。",
          },
          {
            label: "事由 / 提交时间",
            content: "事由枚举；时间 YYYY-MM-DD HH:mm:ss。",
          },
          {
            label: "申请状态 / 凭证状态",
            content: "Tag 着色；凭证状态 **5 态**（待审批时为「未生成」）。「生成失败」=密码服务调用失败，挂锁/人脸统一。",
          },
        ],
      },
      {
        title: "Mock 验收单号",
        items: [
          {
            label: "UA20260828001",
            content: "待审批 · 可撤回。",
          },
          {
            label: "UA20260827015",
            content: "人脸已通过 · 页面密码 · 不调短信（R31）。",
          },
          {
            label: "UA20260827020",
            content: "挂锁已通过 · 凭证=已下发 · 详情展示密码（短信成败不进凭证状态）。",
          },
          {
            label: "UA20260826008",
            content: "挂锁已通过 · 凭证=生成失败（密码服务超时）· 可重新获取密码。",
          },
          {
            label: "UA20260826011",
            content: "人脸已通过 · 凭证=生成失败（设备暂不可用）· 可重新获取密码。",
          },
          {
            label: "UA20260826010",
            content: "人脸已通过 · 三方下发失败但凭证=已下发 · 详情有密码（下发失败仅人脸）。",
          },
          {
            label: "UA20260826012",
            content: "挂锁已通过 · 凭证=已过期 · 详情不展示密码。",
          },
          {
            label: "UA20260826013",
            content: "人脸已通过 · 凭证=被覆盖 · 展示失效提示。",
          },
          {
            label: "UA20260827021",
            content: "人脸已通过 · 凭证=已过期 · 不展示密码。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-row-actions",
    targetId: "my-unlock-apply-table",
    number: 4,
    kind: "规则",
    title: "行操作 · 查看与撤回",
    content: "详情：所有状态可用。撤回：仅「待审批」展示；二次确认后状态→已撤回。",
    details: [
      {
        title: "撤回规则",
        items: [
          {
            label: "前置条件",
            content: "status=PENDING；服务端需乐观锁 + 幂等。",
          },
          {
            label: "失败反馈",
            content: "Toast「撤回失败：申请状态已变更」。",
          },
          {
            label: "成功反馈",
            content: "Toast「撤回成功」；列表状态 Tag 更新为已撤回。",
          },
        ],
      },
      {
        title: "不提供",
        items: [
          {
            label: "列表新增",
            content: "开锁申请由门禁设备「获取密码」入口发起，列表无「+ 新增」。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-pagination",
    targetId: "my-unlock-apply-pagination",
    number: 5,
    kind: "交互",
    title: "分页与空态",
    content: "默认 10 条/页，可选 10/20/50；筛选为空时表格「暂无数据」。",
    details: [
      {
        title: "分页行为",
        items: [
          {
            label: "页码重置",
            content: "查询、重置、切换 pageSize 时回到第 1 页。",
          },
        ],
      },
    ],
  },
]
