/** PC / H5 入库表单校验与成功提示（文案一致） */
export const INBOUND_FORM_MESSAGES = {
  needGoods: "请至少添加一条货品明细",
  needMeasure: "请填写每条货品的计量数量",
  unstacked: "货物尚未完全堆放分配，未堆放数量必须为 0 才能提交审核",
  needPhoto: "每条货品至少上传 1 张现场照片",
  needStoreroomFirst: "请先选择入库库房",
  submitSuccess: "提交审核成功（演示）",
  verifySuccess: "新货主核验通过，提交审核成功（演示）",
  leaveConfirm: "当前表单有未保存内容，确定离开吗？",
  warehouseReceiptHint: "仓单入库请前往仓单作业入口",
} as const
