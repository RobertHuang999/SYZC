/**
 * 合作方档案表单 · 不可编辑字段样式
 * 与 index.css `[data-partner-form-locked="true"]` 色值保持一致
 */

/** PC · Input / SelectTrigger */
export const PARTNER_FORM_LOCKED_FIELD_PC =
  "pointer-events-none cursor-not-allowed !border-[#EFEFEF] !bg-[#EFEFEF] !text-[#666666] !opacity-100 shadow-none focus-visible:!border-[#EFEFEF] focus-visible:!ring-0 data-disabled:!opacity-100 disabled:!border-[#EFEFEF] disabled:!bg-[#EFEFEF] disabled:!text-[#666666] disabled:!opacity-100 dark:!border-[#EFEFEF] dark:!bg-[#EFEFEF] dark:!text-[#666666]"

/** H5 · 行内 input（右对齐，锁定态占满右侧区域） */
export const PARTNER_FORM_LOCKED_FIELD_H5 =
  "box-border w-full min-w-0 pointer-events-none cursor-not-allowed rounded-md !border !border-solid !border-[#EFEFEF] !bg-[#EFEFEF] px-2.5 py-1.5 !text-[#666666] !opacity-100 disabled:!opacity-100"

/** H5 · 主体类型等纯展示按钮 */
export const PARTNER_FORM_LOCKED_BUTTON_H5 =
  "box-border w-full min-w-0 pointer-events-none cursor-not-allowed rounded-md !border !border-solid !border-[#EFEFEF] !bg-[#EFEFEF] px-2.5 py-1.5 text-right !text-[#666666] !opacity-100 disabled:!opacity-100"
