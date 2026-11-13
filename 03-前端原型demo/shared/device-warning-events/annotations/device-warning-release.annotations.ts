import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

export const deviceWarningReleaseAnnotations: SharedPrototypeAnnotation[] = [
  {
    id: "device-warning-release-header",
    documentRefs: {
      prd: { section: "3.1 模块定位说明" },
    },
    targetId: "device-warning-release-header",
    number: 1,
    kind: "页面",
    title: "解除处置全流程闭环",
    content: "对待处置的单条设备告警录入现场处置凭证与核实说明，完成该条流水归档解除。",
    details: [
      {
        title: "解除处置业务流转图",
        items: [
          {
            label: "处置流程图",
            content: `flowchart TD
    A["列表/详情发起"] --> B["二次确认"]
    B --> C["录入材料 + 联动抓拍"]
    C --> D["提交乐观锁校验"]
    D -->|"校验成功"| E["归档该条流水为已结案"]
    E --> F["发布 DeviceEventReleased"]
    F --> G["取消该条升级定时任务"]`,
          },
          {
            label: "业务意义",
            content: "人工解除必须具备明确的处置事实与留痕照片，保障监管合规；解除提交仅归档本条独立流水，不涉及频次聚合或整轮归档。",
          },
        ],
      },
      {
        title: "准入前置与角色权限",
        items: [
          {
            label: "前置状态校验",
            content: "仅【待处置】且预警配置允许人工解除的事件方可进入；已结案或仅自动恢复类型直接拦截并引导返回。",
          },
          {
            label: "操作权限",
            content: "需具备 R-IOT-OPS（运维操作员）或 R-SYS-ADMIN 权限，普通风控只读人员无权提交解除。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-release-summary",
    documentRefs: {
      fields: { section: "三、详情展示专有与快照字段", match: "处置策略模式快照", element: "row" },
    },
    targetId: "device-warning-release-summary",
    number: 2,
    kind: "字段",
    title: "告警事实核验摘要",
    content: "展示待解除单条事件的核心事实快照，明确处置对象。",
    details: [
      {
        title: "关键核验字段",
        items: [
          {
            label: "事件标识与规则",
            content: "事件 ID（如 evt-b2c3d4e5）、规则名称、预警类型/子类型及所属仓库库区。",
          },
          {
            label: "预警时间",
            content: "本条独立流水的触发时间 warningTime，作为升级计时起点展示。",
          },
          {
            label: "预警抓拍凭证",
            content: "可点击查看触发时的原始抓拍大图，作为现场核查与比对的依据。",
          },
        ],
      },
      {
        title: "摘要字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 | 控件类型 | 必填 | 取值范围与格式 | 展示规则 | 说明 |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **事件 ID** | 只读文本 | 系统生成 | 如 evt-b2c3d4e5 | 单行 | 本条独立流水标识 |
| **规则名称** | 只读文本 | 必填 | 设备预警规则名 | 单行 | 触发时快照 |
| **预警类型 / 子类型** | 只读文本 | 必填 | 5 大类及其子类型 | 单行 | — |
| **所属仓库库区** | 只读文本 | 必填 | 仓库-库房-分区 | 单行 | — |
| **预警时间** | 只读时间 | 系统记录 | YYYY-MM-DD HH:mm:ss | 单行 | 升级计时起点 |
| **预警抓拍** | 缩略图 | 条件展示 | 点击查看大图 | 单行 | 无抓拍显示「抓图失败或无监控设备接入」 |`,
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-release-form",
    documentRefs: {
      prd: { section: "3.1 模块定位说明" },
      rules: { section: "【人工核查解除情况说明与现场抓拍规则】(DEV-R02)" },
    },
    targetId: "device-warning-release-form",
    number: 3,
    kind: "交互",
    title: "处置材料填报与校验规则",
    content: "录入情况说明、上传现场核验照片并调取解除时设备二次联动抓拍画面。",
    details: [
      {
        title: "表单控件与校验约束",
        items: [
          {
            label: "情况说明（必填）",
            content: "多行文本输入框，必填 1～200 字，禁止全空格；为空提示请填写情况说明，超限提示不可超过 200 字。",
          },
          {
            label: "现场照片上传",
            content: "选填。支持 JPG/JPEG/PNG，单张 ≤5MB，最多 10 张；支持图片预览、删除与重新上传。",
          },
          {
            label: "解除抓拍（联动）",
            content: "系统在进入解除或提交前自动调用摄像头拍照作为解除时现场状态对照凭证；抓拍失败不阻断人工提交，但记录抓拍异常状态。",
          },
          {
            label: "防未保存离开拦截",
            content: "当表单内容被修改（Dirty）时，点击返回或切换路由将弹出原生 confirm 提示确认放弃未保存内容。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-release-submit",
    documentRefs: {
      rules: { section: "【提交解除数据版本号并发控制锁规则】(DEV-C03)" },
    },
    targetId: "device-warning-release-submit",
    number: 4,
    kind: "规则",
    title: "提交逻辑、乐观锁与并发控制",
    content: "提交时携带 Version 乐观锁，保证服务端幂等性与数据强一致性，成功后全链路留痕。",
    details: [
      {
        title: "强一致性与下游联动",
        items: [
          {
            label: "Version 乐观锁机制",
            content: "提交请求携带当前事件 version 字段；若其他管理员已抢先处理或系统已自动恢复，服务端校验失败返回 409 冲突，前端提示【数据已被他人处理，请刷新】。",
          },
          {
            label: "升级任务取消",
            content: "解除成功后，服务端立即取消该条流水挂起的未执行升级通知（如 2小时未处理短信通知）。",
          },
          {
            label: "全路径审计留痕",
            content: "入库记录：operator_id、operator_name、timestamp、ip、situation_description、site_photo_urls、release_snapshot_url、before_version、after_version。",
          },
          {
            label: "待确认事项",
            content: "【待确认】现场照片上传是否需强制包含水印（操作人+时间戳+GPS定位）。",
          },
        ],
      },
    ],
  },
]
