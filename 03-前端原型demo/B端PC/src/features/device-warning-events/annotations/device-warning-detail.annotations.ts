import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-detail-header",
    targetId: "device-warning-detail-header",
    number: 1,
    kind: "页面",
    title: "详情页定位与处置闭环",
    content: "展示单条设备预警事件的完整事实快照与处置留痕，支持权限角色进入人工解除；一事件一条记录，无频次聚合。",
    details: [
      {
        title: "生命周期流转图",
        items: [
          {
            label: "状态流转图",
            content: `flowchart TD
    V["厂商预过滤回调"] --> B["待处置·有效 (逐条落账 R01)"]
    B -->|"人工解除/自动恢复"| C["已结案 · 有效"]
    B -->|"规则删除/设备解绑"| D["已作废 (终态只读)"]`,
          },
          {
            label: "业务定位",
            content: "页面承载单条独立流水的全部只读事实与快照；待处置 · 有效且支持人工处置的类型可由此发起解除，其余状态仅供穿透溯源。",
          },
        ],
      },
      {
        title: "上下游协同",
        items: [
          {
            label: "上游数据",
            content: "触发时固化规则快照（阈值、处置策略、规则 Version、升级策略）、预警等级字典快照与抓拍图片签名 URL。",
          },
          {
            label: "下游联动",
            content: "解除成功后触发 DeviceEventReleased 事件，取消该条流水挂起的未执行升级通知，并同步刷新列表与大屏状态。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-detail-base",
    targetId: "device-warning-detail-base",
    number: 2,
    kind: "字段",
    title: "基本信息与状态快照",
    content: "展示事件系统标识、规则名称、类型分类、等级色块、预警时间与当前生命周期状态。",
    details: [
      {
        title: "核心字段定义",
        items: [
          {
            label: "事件 ID (event_uuid)",
            content: "系统全局唯一业务流水号（如 evt-b2c3d4e5），只读不可篡改，跨模块关联传参基准。",
          },
          {
            label: "规则名称",
            content: "触发时捕获的规则名称快照；若上游规则后续更名或删除，本详情仍保持触发时历史快照一致。",
          },
          {
            label: "预警类型 / 子类型",
            content: "6 大预警类型（图像识别/物联传感/门禁安防/GPS车载/常规通行/操作事务）及具体子类（如行人入侵、超温、越界等）。",
          },
          {
            label: "预警等级",
            content: "等级编码（01-04）及颜色快照（高危红/中危橙/低危黄/提示蓝），由 severity_level 字典在触发时固化。",
          },
          {
            label: "预警时间 (warningTime)",
            content: "本条独立流水的触发时间，格式 YYYY-MM-DD HH:mm:ss；作为升级通知策略的计时基准起点。",
          },
          {
            label: "预警状态",
            content: "待处置 · 有效/ 已作废/ 已结案 · 有效；若为无效态需展示失效原因（如规则已被删除）。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-detail-facts",
    targetId: "device-warning-detail-facts",
    number: 3,
    kind: "字段",
    title: "触发事实、位置与抓拍凭证",
    content: "物理仓库、库区、关联设备识别码、结构化预警文本及防篡改抓拍图片入口。",
    details: [
      {
        title: "字段与安全控制",
        items: [
          {
            label: "所属仓库 / 库区",
            content: "格式如【一号钢材仓 · B库区】；按用户管辖仓库进行 P02 数据权限严格过滤，越权访问返回 403。",
          },
          {
            label: "关联设备",
            content: "设备名称与系统编号（如 CAM-01 / DEV-2026-0881），支持点击跳转设备档案详情。",
          },
          {
            label: "预警内容",
            content: "规则引擎根据厂商回调 payload 自动拼装的标准事实描述：【位置】+【设备】+【触发事实与数值】。",
          },
          {
            label: "预警抓拍图",
            content: "图片存储于私有对象存储，前端通过服务端换取 15 分钟时效签名 URL 查看；受 P05 图片查看权限控制。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-detail-release-info",
    targetId: "device-warning-detail-release-info",
    number: 4,
    kind: "规则",
    title: "处置信息与现场复核凭据",
    content: "归档状态下的真实处置人、处理时间、情况说明、现场核验照片及二次联动抓拍快照。",
    details: [
      {
        title: "处置留痕与合规审计",
        items: [
          {
            label: "处理时间与处理人",
            content: "记录真实操作人员姓名、账号、操作时间与 IP，写入全链路安全审计日志不可篡改。",
          },
          {
            label: "情况说明",
            content: "人工解除时填写的现场核实与处置说明（必填，≥10 字），如【现场核实为巡检人员误入，已完成登记并纠正】。",
          },
          {
            label: "现场照片",
            content: "操作人员现场采集并上传的复核照片凭据（支持多图缩略预览与大图旋转查看）。",
          },
          {
            label: "解除抓拍",
            content: "解除提交时系统自动向摄像头发送联动抓拍指令留存的实时画面，用以佐证解除时现场已恢复正常。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-detail-rule-snapshot",
    targetId: "device-warning-detail-rule-snapshot",
    number: 5,
    kind: "规则",
    title: "触发时规则配置快照（C03-N04）",
    content: "展示事件产生时生效的监控阈值、处置策略、规则 Version 与升级通知策略，保障历史事件可溯源可复盘。",
    details: [
      {
        title: "快照字段与不可变性",
        items: [
          {
            label: "处置策略快照 (disposition_mode)",
            content: "固化触发时刻规则处置策略：触发即结案 / 人工解除结案 / 恢复自动结案；决定详情是否展示「解除预警」入口（R14'：仅人工解除档=有）。",
          },
          {
            label: "监控阈值快照",
            content: "如【图像识别置信度≥85% 且 目标类型=人体】、【库内温度 < -5℃ 或 > 35℃】或【二氧化碳 < 400 ppm 或 > 1500 ppm】。",
          },
          {
            label: "规则 Version 快照 (ruleVersion)",
            content: "固化触发时刻匹配的规则版本号；规则后续编辑 Version+1 不回写本条流水（C08）。",
          },
          {
            label: "升级策略快照",
            content: "如【触发后 30 分钟未处理短信提醒仓管员，2 小时未处理系统消息升级推送至风控总监】。",
          },
          {
            label: "审计意义",
            content: "规则修改只影响未来事件，存量事件详情严格按快照呈现，确保监管与合规审计依据真实可靠。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-detail-actions",
    targetId: "device-warning-detail-header",
    number: 6,
    kind: "交互",
    title: "页头动作权限与解除流程",
    content: "根据事件类型与当前状态动态渲染【返回】、【解除预警】操作按钮。",
    details: [
      {
        title: "状态 × 动作矩阵",
        items: [
          {
            label: "待处置 · 有效",
            content: "快照 disposition_mode=ACTION_REQUIRED（R14'）时展示【解除预警】；恢复自动结案/触发即结案隐藏解除按钮。",
          },
          {
            label: "已作废 / 已结案 · 有效",
            content: "仅展示【返回】，不提供再次解除入口；再次超标将产生新的独立流水。",
          },
          {
            label: "权限要求",
            content: "操作【解除预警】需具备 R-IOT-OPS / R-SYS-ADMIN 角色；无权限人员按钮置灰并提示权限不足。",
          },
          {
            label: "待确认事项",
            content: "【待确认】解除弹窗内提交是否需要支持现场视频录制上传，还是仅支持图片上传。",
          },
        ],
      },
    ],
  },
]
