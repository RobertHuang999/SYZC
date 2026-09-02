import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const deviceWarningReleaseH5Annotations: PrototypeAnnotation[] = [
  {
    id: "h5-device-warning-release-header",
    targetId: "h5-device-warning-release-header",
    number: 1,
    kind: "页面",
    title: "移动端 · 设备预警解除与现场拍照",
    content: "录入现场核实说明、拍照上传现场照片并调取设备联动抓拍，完成整轮告警归档解除。",
    details: [
      {
        title: "解除流转与业务意义",
        items: [
          {
            label: "整轮归档",
            content: "人工解除提交将归档本轮累计的全部 N 次触发，取消未完成的通知升级任务并恢复大屏状态。",
          },
          {
            label: "操作权限",
            content: "需具备 R-IOT-OPS（运维操作员）或 R-SYS-ADMIN 权限，普通只读人员拦截提交。",
          },
        ],
      },
    ],
  },
  {
    id: "h5-device-warning-release-form",
    targetId: "h5-device-warning-release-form",
    number: 2,
    kind: "交互",
    title: "处置说明录入与现场拍照",
    content: "录入 10~500 字符情况说明、现场拍照上传（最多 5 张）并调用摄像头联动抓拍。",
    details: [
      {
        title: "表单与校验",
        items: [
          {
            label: "情况说明（必填）",
            content: "多行文本输入，少于 10 字提示「情况说明不能少于 10 个字符」，不可为空。",
          },
          {
            label: "现场拍照上传",
            content: "调起移动端相机拍照或相册上传现场核实凭证照片，支持图片预览与删除。",
          },
          {
            label: "二次联动抓拍",
            content: "进入解除时自动调用设备二次抓拍作为现场对照凭证，记录防篡改时间戳。",
          },
        ],
      },
    ],
  },
]
