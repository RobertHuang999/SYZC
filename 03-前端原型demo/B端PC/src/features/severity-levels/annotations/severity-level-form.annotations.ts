import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const severityLevelFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "severity-level-form-header",
    targetId: "severity-level-form-header",
    number: 1,
    kind: "页面",
    title: "新增/编辑预警等级表单",
    content: "录入或修改等级编码、显示名称、标签颜色、同步至订单预警开关、启用状态与等级说明。",
    details: [
      {
        title: "配置约束与生效规则",
        items: [
          {
            label: "保存即生效",
            content: "字典项保存成功后立即生效，供后续规则下拉选择；历史产生的预警流水快照保持不变。",
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
    title: "表单字段与校验规则",
    content: "各输入控件的格式限制、必填校验、防重校验与实时错误提示。",
    details: [
      {
        title: "校验规则清单",
        items: [
          {
            label: "等级编码（必填）",
            content: "支持 2~16 位字符（如 01、L5、CRITICAL）；租户内唯一不可重复，重复提示【等级编码已存在】。",
          },
          {
            label: "显示名称（必填）",
            content: "支持 2~20 位中文/英文字符（如【紧急危险】、【严重风险】）；租户内唯一不可重复。",
          },
          {
            label: "标签颜色（必填）",
            content: "标准 16 进制颜色格式（如 #E60000），支持预设色块快捷点选与取色器微调。",
          },
          {
            label: "等级说明",
            content: "非必填，最长 100 字符，用于描述该等级的业务适用范围与建议响应要求。",
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
    title: "同步至订单预警穿透开关机制",
    content: "控制该严重度档位在设备侧告警时是否具备向订单侧押品穿透告警的资格。",
    details: [
      {
        title: "穿透策略机制",
        items: [
          {
            label: "开关定义",
            content: "默认高危档位（如 L4/L5）建议开启；开启后当设备告警发生且在押订单空间重合时，自动生成押品预警穿透流水。",
          },
          {
            label: "只读生成约束",
            content: "穿透生成的押品预警不可在押品端人工解除，必须在设备物理台账处置闭环后联动核销。",
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
    content: "支持保存提交、取消返回，并在表单存在未保存脏数据时弹出原生离开确认拦截。",
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
