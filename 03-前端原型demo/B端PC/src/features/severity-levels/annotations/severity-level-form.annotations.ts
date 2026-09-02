import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const severityLevelFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "severity-level-form-header",
    targetId: "severity-level-form-header",
    number: 1,
    kind: "页面",
    title: "新增/编辑预警等级表单 · 生命周期与生效机制",
    content: "录入或修改等级编码、显示名称、标签颜色、同步至订单预警开关、启用状态与等级说明，实时校验 2~20 档租户约束。",
    details: [
      {
        title: "预警等级生命周期与生效流转",
        items: [
          {
            label: "表单提交流转图",
            content: `flowchart TD
    A["录入等级参数 (编码/名称/颜色/穿透开关)"] --> B{"前端实时校验 & 档位限制 (2~20档)"}
    B -->|校验未通过| C["红框高亮定位 & 错误提示"]
    B -->|校验通过| D["提交服务端查重校验 (租户内编码/名称唯一)"]
    D -->|重复冲突| E["Toast 提示重复并定位字段"]
    D -->|查重通过| F["写入字典库 (即时生效)"]
    F --> G["发布 SeverityLevelChanged 事件"]
    G --> H["供 03/02 设备预警 & 03/03 订单预警下拉选择"]`,
          },
          {
            label: "即时生效与快照隔离",
            content: "字典项保存成功后立即对后续新建或修改的规则生效；历史已产生的预警事件中固化的等级快照（ID/编码/名称/颜色）不受任何影响，保持司法存证不可变性。",
          },
        ],
      },
    ],
  },
  {
    id: "severity-level-form-fields",
    targetId: "severity-level-form-fields",
    number: 2,
    kind: "字段",
    title: "表单字段清单与格式校验规范",
    content: "各输入控件的格式限制、必填校验、防重校验与实时错误提示。",
    details: [
      {
        title: "字段字典清单与校验规则",
        items: [
          {
            label: "等级编码 (severity_code) · 必填",
            content: "支持 2~16 位半角字符（如 01、L5、CRITICAL）；租户内唯一不可重复，重复提示【等级编码已存在】。",
          },
          {
            label: "显示名称 (severity_name) · 必填",
            content: "支持 2~20 位中文/英文字符（如【紧急危险】、【严重风险】）；租户内唯一不可重复。",
          },
          {
            label: "标签颜色 (tag_color) · 必填",
            content: "标准 16 进制颜色格式（如 #E60000），支持预设推荐色块快捷点选与取色器微调，用于列表 Badge 与大屏告警展示。",
          },
          {
            label: "严重度排序 (sort_order) · 必填",
            content: "1~20 整数，数值越大代表严重度越高；平仓线等高危规则需校验其严重度大于等于补仓线。",
          },
          {
            label: "等级说明 (description)",
            content: "非必填，最长 100 字符，用于描述该等级的业务适用范围与建议响应要求（如【适用于明火烟雾、暴力破门等最高危告警】）。",
          },
        ],
      },
    ],
  },
  {
    id: "severity-level-form-sync",
    targetId: "severity-level-form-sync",
    number: 3,
    kind: "规则",
    title: "同步至订单预警穿透开关机制 (R11/R12)",
    content: "控制该严重度档位在设备侧告警时是否具备向订单侧押品穿透告警的资格。",
    details: [
      {
        title: "穿透策略机制",
        items: [
          {
            label: "开关定义 (sync_to_order_warn)",
            content: "默认高危档位（如 L4/L5）建议开启；开启后当设备告警发生且在押订单空间重合时，自动生成押品预警穿透流水。",
          },
          {
            label: "只读生成与联动闭环",
            content: "穿透生成的押品预警不可在押品端人工解除，必须在设备物理台账处置闭环后联动核销，确保物联与货权强一致。",
          },
        ],
      },
    ],
  },
  {
    id: "severity-level-form-actions",
    targetId: "severity-level-form-actions",
    number: 4,
    kind: "交互",
    title: "保存提交与离开拦截控制",
    content: "支持保存提交、取消返回，并在表单存在未保存脏数据时弹出离开确认拦截。",
    details: [
      {
        title: "提交与拦截",
        items: [
          {
            label: "表单提交",
            content: "前端校验通过后提交服务端，成功后提示【保存成功】并返回列表页。",
          },
          {
            label: "防未保存离开拦截",
            content: "表单修改（Dirty）状态下点击返回或切换路由弹出确认框，避免误触丢失已输入内容。",
          },
        ],
      },
    ],
  },
]
