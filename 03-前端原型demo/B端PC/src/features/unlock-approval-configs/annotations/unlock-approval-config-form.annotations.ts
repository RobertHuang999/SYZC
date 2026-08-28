import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApprovalConfigFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-approval-config-form-header",
    targetId: "unlock-approval-config-form-header",
    number: 1,
    kind: "页面",
    title: "开锁审批配置新增/编辑表单",
    content:
      "配置开锁审批适用范围、审批链与超时规则。新增保存后直接已启用；编辑保存生成新版本，在途申请沿用旧版本快照（C05、C06）。",
    details: [
      {
        title: "新增 vs 编辑差异",
        items: [
          {
            label: "不可变字段（R06）",
            content:
              "编辑态：配置名称、适用范围类型、适用仓库/库房/分区/设备 Readonly；需调整范围时停用旧配置并新增。",
          },
          {
            label: "可编辑字段",
            content: "审批方式、审批节点、审批超时时间、未绑定位置全局审批开关（编辑时也可改，保存生成新版本）。",
          },
          {
            label: "Version（R07）",
            content: "页面不展示；编辑提交时随表单隐藏携带，乐观锁冲突提示「数据已被他人修改，请刷新重试」。",
          },
          {
            label: "已停用拦截",
            content: "已停用配置不可进入编辑页（动作矩阵 ❌）。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-form-scope",
    targetId: "unlock-approval-config-form-scope",
    number: 2,
    kind: "字段",
    title: "基础识别与 ScopeCascadeSelector",
    content:
      "配置名称 + 适用范围类型（2 列栅格）+ 范围选择面板（级联 Tag 多选）或全局开关区。",
    details: [
      {
        title: "基础字段",
        items: [
          {
            label: "配置名称",
            content: "Input 必填，≤50 字，租户内唯一（R04a）；编辑 Readonly；placeholder「请输入配置名称」。",
          },
          {
            label: "适用范围类型",
            content:
              "Select 必填：仓库 / 库房 / 分区 / 指定设备 / 未绑定位置全局；编辑 Readonly；变更联动下方范围面板或全局开关。",
          },
        ],
      },
      {
        title: "动态表单五类场景",
        items: [
          {
            label: "A 仓库",
            content: "范围面板：*适用仓库（单选）。",
          },
          {
            label: "B 库房",
            content: "范围面板：*适用仓库 + *适用库房（Tag 多选，至少 1 个）。",
          },
          {
            label: "C 分区",
            content: "范围面板：*适用仓库 + *适用库房 + *适用分区（Tag 多选）。",
          },
          {
            label: "D 指定设备",
            content: "范围面板选仓库上下文 + 设备弹窗（批注 3）；适用设备必填。",
          },
          {
            label: "E 未绑定位置全局",
            content: "隐藏范围面板；展示全局审批开关 Radio + ? + 灰字说明（批注 4）。",
          },
        ],
      },
      {
        title: "ScopeCascadeSelector 交互（V1.1）",
        items: [
          {
            label: "路径摘要 Badge",
            content: "「范围选择 / {仓库} / {库房…} / {分区…}」",
          },
          {
            label: "级联清空",
            content: "切换适用仓库时清空库房、分区、已选设备。",
          },
          {
            label: "未选仓库",
            content: "库房/分区区展示「请先选择适用仓库」。",
          },
          {
            label: "主数据校验（R01）",
            content: "保存/启用时校验引用仓库/库房/分区/设备须存在且有效。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-form-device",
    targetId: "unlock-approval-config-form-device",
    number: 3,
    kind: "交互",
    title: "UnlockDeviceSelectDialog 设备弹窗",
    content:
      "指定设备类型：表单页仅展示摘要 +「勾选/调整设备 >」按钮；不在页内嵌长列表勾选。",
    details: [
      {
        title: "弹窗能力",
        items: [
          {
            label: "仓库筛选",
            content: "顶栏 Select：全部仓库 / 各在管仓库；默认带入范围面板已选仓库。",
          },
          {
            label: "关键字搜索",
            content: "匹配设备名称、编码、绑定位置。",
          },
          {
            label: "列表展示",
            content: "复选框 + 设备名称 + 编码 Badge + 仓库·位置；仅挂锁门禁、人脸门禁。",
          },
          {
            label: "批量 / 确认",
            content: "全选当前结果 / 取消全选；「确认选择（N 台）」；取消不保存。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-form-global",
    targetId: "unlock-approval-config-form-global",
    number: 4,
    kind: "规则",
    title: "未绑定位置全局审批开关（C04 / R29）",
    content:
      "仅「未绑定位置全局」类型展示 Radio：开启 / 关闭；配合 FieldHelpTooltip 与字段下灰字说明。",
    details: [
      {
        title: "开关语义",
        items: [
          {
            label: "关闭",
            content: "未绑定具体位置设备走原有免审直发密码。",
          },
          {
            label: "开启",
            content: "进入本配置的全局审批；不得将「未命中具体配置」静默当成免审（C04）。",
          },
          {
            label: "R29 唯一性",
            content: "租户内该类型仅允许 1 条已启用配置；第二条保存/启用阻断。",
          },
        ],
      },
      {
        title: "匹配优先级（供理解下游 C01）",
        items: [
          {
            label: "优先级链",
            content: `flowchart LR
    A["指定设备"] --> B["分区"]
    B --> C["库房"]
    C --> D["仓库"]
    D --> E["未绑定位置全局兜底 C04"]`,
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-form-strategy",
    targetId: "unlock-approval-config-form-strategy",
    number: 5,
    kind: "字段",
    title: "审批策略：方式、节点、超时",
    content: "审批方式 Radio + 审批节点可编辑表格（拖拽排序）+ TimeoutHoursInput（单位内嵌）。",
    details: [
      {
        title: "审批方式",
        items: [
          {
            label: "任一人通过",
            content: "各节点解析出的 eligible 人员并行待办，任一人通过即完成。",
          },
          {
            label: "按顺序审批",
            content: "按节点顺序逐个激活；下方节点拖拽顺序即审批链激活顺序。",
          },
        ],
      },
      {
        title: "审批节点子表（R27）",
        items: [
          {
            label: "节点序号",
            content: "拖拽 ≡ 调整；从 1 递增，拖拽后重算。",
          },
          {
            label: "审批对象类型",
            content: "指定人员 / 指定角色 二选一；切换类型时清空已选对象。",
          },
          {
            label: "审批对象",
            content: "人员：启用账号单选；角色：启用角色单选，保存时校验至少 1 个启用成员（R02）。",
          },
          {
            label: "约束",
            content: "至少 1 个节点；同一节点不可混选人员与角色；不同节点可分别配置。",
          },
        ],
      },
      {
        title: "审批超时时间（TimeoutHoursInput V1.1）",
        items: [
          {
            label: "控件规格",
            content: "正整数；「小时」内嵌于输入框右侧，带左边框分隔，非独立外挂文案。",
          },
          {
            label: "运行时语义",
            content: "申请进入待审批后超过该时长未处理将自动失效。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-form-actions",
    targetId: "unlock-approval-config-form-actions",
    number: 6,
    kind: "规则",
    title: "保存二次确认与校验规则清单",
    content: "保存前二次确认；不提供状态下拉；启停仅在列表/详情独立动作。",
    details: [
      {
        title: "确认文案",
        items: [
          {
            label: "新增",
            content: "保存后新申请将按本配置匹配，确认保存？→ Toast「保存成功」→ 返回列表。",
          },
          {
            label: "编辑",
            content: "修改将生成新版本，在途申请继续使用旧版本快照，确认保存？→ 旧版本已停用，新版本已启用。",
          },
        ],
      },
      {
        title: "校验规则（点击侧边栏「业务规则规格」查看全文）",
        items: [
          {
            label: "R04a 配置名称",
            content: "必填，租户内唯一，≤50 字。",
          },
          {
            label: "R01 主数据",
            content: "仓库/库房/分区/设备须存在且有效。",
          },
          {
            label: "R02 审批节点",
            content: "指定人员须启用；指定角色须至少 1 个启用成员。",
          },
          {
            label: "R27 节点结构",
            content: "至少 1 节点；每节点类型二选一，不可混选。",
          },
          {
            label: "R03 范围冲突",
            content: "同一范围不得存在多条内容不一致的已启用配置。",
          },
          {
            label: "R29 全局唯一",
            content: "未绑定位置全局类型租户内仅 1 条已启用。",
          },
          {
            label: "R06 / R07",
            content: "编辑不可改变范围字段；Version 乐观锁冲突阻断。",
          },
        ],
      },
    ],
  },
]
