import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApprovalConfigFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-approval-config-form-header",
    targetId: "unlock-approval-config-form-header",
    number: 1,
    kind: "页面",
    title: "开锁审批配置新增 / 编辑表单",
    content:
      "录入或编辑门禁开锁审批策略，配置适用设备列表、审批节点（支持跨合作机构指定人员与角色）及审批超时时间。新增保存直接生效，编辑保存生成新版本。",
    details: [
      {
        title: "新增态 vs 编辑态核心差异",
        items: [
          {
            label: "新增态 (Create)",
            content:
              "配置名称可填，设备可通过弹窗自由勾选；表单不展示状态与审批方式字段；保存成功后系统自动生成配置编号、配置版本=1、状态=已启用、审批方式=任一人通过。",
          },
          {
            label: "编辑态 (Edit)",
            content:
              "不可变字段锁定（R06：配置名称、适用设备置灰 Readonly）；修改审批节点或超时时间保存后生成新版本（版本号+1、状态=已启用），原旧版本自动流转为【已停用】；在途申请继续使用原快照（C04）。",
          },
        ],
      },
      {
        title: "并发控制与版本化 (R07 / C05)",
        items: [
          {
            label: "乐观锁校验 (R07)",
            content:
              "编辑保存时通过隐藏字段提交 Version 版本号进行并发控制；若数据已被他人修改，服务端阻断并提示「数据已被他人修改，请刷新重试」。",
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
    title: "基础信息与配置名称",
    content:
      "配置名称必填，单行输入，最多 50 字符，租户内唯一（R04a）；编辑态置灰不可改（R06）。",
    details: [
      {
        title: "配置名称规范与校验",
        items: [
          {
            label: "命名规范",
            content: "建议包含仓区/设备类型及审批业务属性（如「A库指定挂锁审批」）。",
          },
          {
            label: "唯一性校验 (R04a)",
            content: "租户内配置名称不可重复；为空或重复时输入框标红并阻止提交，Toast 提示「配置名称已存在」。",
          },
          {
            label: "不可变约束 (R06)",
            content: "编辑态配置名称置灰只读；若业务需更名或重新划分策略，需停用旧配置并新建。",
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
    title: "适用设备选择（UnlockDeviceSelectDialog）",
    content:
      "表单展示已选设备台数与编码摘要，点击【勾选/调整设备 >】唤起设备穿梭选择弹窗；至少选择 1 台设备（R01、R03）。",
    details: [
      {
        title: "设备选择弹窗规格",
        items: [
          {
            label: "仓库筛选与搜索",
            content:
              "弹窗顶部支持按仓库筛选（全部仓库/指定仓库）及输入框模糊搜索设备编码、设备名称与安装位置；仓库筛选仅用于快速定位设备，不作为配置范围实体。",
          },
          {
            label: "勾选列表与批量操作",
            content:
              "复选框列表展示设备编码 Badge、系统内名称、所属仓库及库房位置；提供【全选当前结果】与【取消全选当前结果】批量操作。",
          },
          {
            label: "确认选择",
            content:
              "底部显示「确认选择（N 台）」，点击确认将所选设备 ID 集合回填至主表单；至少选择 1 台设备。",
          },
        ],
      },
      {
        title: "主数据与设备冲突校验",
        items: [
          {
            label: "主数据有效性 (R01)",
            content: "仅支持挂锁门禁与人脸门禁；所选设备主数据须有效且未处于停用状态。",
          },
          {
            label: "设备冲突拦截 (R03)",
            content:
              "同一设备不得同时出现在多条内容不一致的【已启用】配置中；若检测到冲突，保存阻断并提示「保存/启用失败：与配置{编号}存在设备冲突」。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-form-strategy",
    targetId: "unlock-approval-config-form-strategy",
    number: 4,
    kind: "规则",
    title: "审批策略：多节点链与超时配置（限定合作机构）",
    content:
      "系统默认审批方式为「任一人通过」；支持增删审批节点与拖拽排序；审批对象候选数据严格限定为当前租户下合作机构（P01b、R02）；审批超时单位内嵌。",
    details: [
      {
        title: "审批节点候选范围与展示 (P01b)",
        items: [
          {
            label: "合作机构范围约束 (P01b)",
            content:
              "审批对象下拉候选项严格限制在**当前租户下合作机构**（含当前登录机构及所有已生效的合作机构）中启用的人员账号与角色；跨租户或非合作机构数据严禁出现。",
          },
          {
            label: "指定人员展示",
            content:
              "下拉单选展示格式为 **`姓名（所属机构）`**（如「李四（仓储监管部）」、「王五（浙商监管部）」）。",
          },
          {
            label: "指定角色展示",
            content:
              "下拉单选展示格式为 **`角色名称（所属机构）`**（如「监管主管（华东监管分公司）」、「风控经理（物产中大保理）」）。",
          },
        ],
      },
      {
        title: "节点交互与结构约束 (R27)",
        items: [
          {
            label: "对象类型二选一",
            content: "每节点审批对象类型为「指定人员」或「指定角色」；切换类型时自动清空已选对象，同一节点不可混选人员与角色。",
          },
          {
            label: "排序与增删",
            content: "支持通过左侧手柄拖拽调整节点序号；点击【+ 添加审批节点】增加行；至少保留 1 个节点（不可删至 0 行）。",
          },
        ],
      },
      {
        title: "节点校验与下游展开 (R02 / R28 / R30)",
        items: [
          {
            label: "保存强校验 (R02)",
            content:
              "指定人员须为合作机构中启用状态的账号；指定角色须为启用角色且在对应合作机构下至少有 1 个启用成员；否则阻断保存并提示「保存/启用失败：审批节点{序号}无效或不属于当前租户合作机构」。",
          },
          {
            label: "申请时角色展开 (R28/R30)",
            content:
              "开锁申请提交时，系统将指定角色自动展开为当时该角色下所有启用成员账号并固化快照；若展开后 eligible 人员为空（含排除申请人后或合作关系解除），由申请侧 R30 阻断提交。",
          },
        ],
      },
      {
        title: "审批超时时间",
        items: [
          {
            label: "TimeoutHoursInput 控件",
            content: "正整数输入框，右侧内嵌「小时」单位徽标；超时后待审批任务自动失效作废。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-form-actions",
    targetId: "unlock-approval-config-form-actions",
    number: 5,
    kind: "交互",
    title: "保存提交二次确认与离开拦截",
    content:
      "点击【保存】先执行全字段前端校验，通过后弹出二次确认弹窗；表单存在脏数据未保存离开时提示确认。",
    details: [
      {
        title: "二次确认文案规格",
        items: [
          {
            label: "新增保存",
            content: "弹出确认弹窗：「保存后新申请将按本配置匹配，确认保存？」，确认后提交服务端处理并记审计。",
          },
          {
            label: "编辑保存",
            content:
              "弹出确认弹窗：「修改将生成新版本，在途申请继续使用旧版本快照，确认保存？」，确认后提交乐观锁 Version 及新策略。",
          },
          {
            label: "保存成功反馈",
            content: "服务端处理成功后轻提示「保存成功」，延迟 800ms 自动导航返回列表页。",
          },
        ],
      },
    ],
  },
]
