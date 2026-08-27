import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningReleaseAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-release-header",
    targetId: "device-warning-release-header",
    number: 1,
    kind: "页面",
    title: "解除处置全流程闭环",
    content: "对未处理（有效）的设备告警录入现场处置凭证与核实说明，完成整轮次告警归档。",
    details: [
      {
        title: "解除处置业务流转图",
        items: [
          {
            label: "处置流程图",
            content: `┌────────────────┐     二次确认     ┌────────────────┐     录入材料+联动抓拍     ┌────────────────┐
│  列表/详情发起  │ ───────────────> │  解除页/弹窗   │ ────────────────────────> │ 提交乐观锁校验 │
└────────────────┘                  └────────────────┘                           └────────────────┘
                                                                                          │
                                                                                          │ 校验成功
                                                                                          v
┌────────────────┐     发布联动事件   ┌────────────────┐     取消升级定时任务     ┌────────────────┐
│ 关联穿透状态更新 │ <─────────────── │  发布Released  │ <─────────────────────── │ 归档整轮N次告警│
└────────────────┘                  └────────────────┘                           └────────────────┘`,
          },
          {
            label: "业务意义",
            content: "人工解除必须具备明确的处置事实与留痕照片，保障监管合规；解除提交将归档本轮累计的全部 N 次触发，而非仅处理单条。",
          },
        ],
      },
      {
        title: "准入前置与角色权限",
        items: [
          {
            label: "前置状态校验",
            content: "仅【未处理（有效）】且预警配置允许人工解除的事件方可进入；已处理或仅自动恢复类型直接拦截并引导返回。",
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
    targetId: "device-warning-release-summary",
    number: 2,
    kind: "字段",
    title: "告警事实核验摘要",
    content: "展示待解除事件的核心事实快照，明确处置对象与累计触发影响范围。",
    details: [
      {
        title: "关键核验字段",
        items: [
          {
            label: "事件标识与规则",
            content: "事件 ID（如 evt-b2c3d4e5）、规则名称、预警类型/子类型及所属仓库库区。",
          },
          {
            label: "累计触发次数 (Count)",
            content: "本轮累计触发 N 次；页面显式提示【提交后将归档整轮 N 次告警】，防止操作员误解为仅消除单次上报。",
          },
          {
            label: "时间跨度",
            content: "展示首次触发时间（升级起点）与最近触发时间，直观反映现场异常持续时长。",
          },
          {
            label: "预警抓拍凭证",
            content: "可点击查看触发时的原始抓拍大图，作为现场核查与比对的依据。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-release-form",
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
            content: "文本域输入，限制 10~500 字符；实时校验字数，少于 10 字提示【情况说明不能少于 10 个字符】。",
          },
          {
            label: "现场照片上传",
            content: "支持上传 JPG/PNG 格式，单个文件≤10MB，最多 5 张；支持图片预览、删除与重新上传。",
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
            content: "解除成功后，服务端立即取消该事件挂起的未执行升级通知（如 2小时未处理短信通知）。",
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
