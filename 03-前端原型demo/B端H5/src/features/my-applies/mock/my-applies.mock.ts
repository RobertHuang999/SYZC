import type { ProcessApplyRecord, UnlockApply } from "../domain/types"
import { unlockAppliesMockSeed } from "./unlock-applies-seed"

export { unlockAppliesMockSeed }

export const processAppliesMock: ProcessApplyRecord[] = [
  {
    id: "PROC-20260828001",
    type: "流程申请",
    submitTime: "2026-08-28 08:30:00",
    ownerName: "宁波优创供应链",
    summary: "客户入库预约 · 华东一号仓",
    status: "审批中",
  },
  {
    id: "PROC-20260827002",
    type: "流程申请",
    submitTime: "2026-08-27 14:10:00",
    ownerName: "江苏恒信贸易",
    summary: "政策资讯发布申请",
    status: "已通过",
  },
]

export const myAppliesMock: (ProcessApplyRecord | UnlockApply)[] = [
  ...processAppliesMock,
  ...unlockAppliesMockSeed,
]
