import type { ConfigCategoryId, CredentialCardDef } from "./types"

export const PLATFORM_BASIC_CONFIG_PATH = "/配置管理/平台管理/基础配置"

export const CONFIG_CATEGORIES: {
  id: ConfigCategoryId
  label: string
  bulkSave: boolean
}[] = [
  { id: "warehouse-ops", label: "仓储作业参数", bulkSave: true },
  { id: "partner-access", label: "货主准入策略", bulkSave: true },
  { id: "agreements", label: "协议配置", bulkSave: true },
  { id: "data-sources", label: "数据源参数", bulkSave: false },
  { id: "iot-hardware", label: "物联网硬件参数", bulkSave: false },
  { id: "mail-smtp", label: "邮件通知配置", bulkSave: false },
]

export const MASKED_SECRET = "*****"

export const DATA_SOURCE_CARD_DEFS: CredentialCardDef[] = [
  {
    id: "corp-four",
    title: "1. 企业四要素认证",
    fields: [
      { key: "apiKey", label: "ApiKey", type: "password" },
      { key: "secretKey", label: "SecretKey", type: "password" },
    ],
  },
  {
    id: "license-ocr",
    title: "2. 营业执照 OCR 识别",
    fields: [
      { key: "apiKey", label: "ApiKey", type: "password" },
      { key: "secretKey", label: "SecretKey", type: "password" },
    ],
  },
  {
    id: "property-reg",
    title: "3. 房产登记",
    fields: [
      { key: "appId", label: "AppId", type: "password" },
      { key: "appSecret", label: "AppSecret", type: "password" },
    ],
  },
  {
    id: "personal-two",
    title: "4. 个人二元",
    fields: [
      { key: "apiKey", label: "ApiKey", type: "password" },
      { key: "secretKey", label: "SecretKey", type: "password" },
    ],
  },
  {
    id: "sms-captcha",
    title: "5. 验证码短信",
    fields: [
      { key: "appId", label: "AppID", type: "password" },
      { key: "appKey", label: "AppKey", type: "password" },
      { key: "sign", label: "签名", type: "password" },
    ],
  },
  {
    id: "sms-notify",
    title: "6. 通知短信",
    fields: [
      { key: "appId", label: "AppID", type: "password" },
      { key: "appKey", label: "AppKey", type: "password" },
      { key: "sign", label: "签名", type: "password" },
    ],
  },
  {
    id: "map",
    title: "7. 地图定位与空间解析",
    fields: [
      { key: "webKey", label: "Web端 Key", type: "password" },
      { key: "serverAk", label: "服务端 AK", type: "password" },
    ],
  },
  {
    id: "face-live",
    title: "8. 实人一体",
    fields: [
      { key: "apiKey", label: "ApiKey", type: "password" },
      { key: "secretKey", label: "secretKey", type: "password" },
    ],
  },
  {
    id: "esign",
    title: "9. 电子签章",
    fields: [
      { key: "certFile", label: "证书文件", type: "file" },
      { key: "certPassword", label: "证书密码", type: "password" },
      { key: "certAlias", label: "证书别名", type: "password" },
      { key: "platformId", label: "平台ID", type: "password" },
    ],
  },
]

export const IOT_HARDWARE_CARD_DEFS: CredentialCardDef[] = [
  {
    id: "sd-monitor",
    title: "1. 赛达监控设备 (掌宇流媒体)",
    fields: [
      { key: "ak", label: "AK", type: "password" },
      { key: "sk", label: "SK", type: "password" },
      {
        key: "storage",
        label: "存储类型",
        type: "select",
        options: [
          { value: "1", label: "1-云存" },
          { value: "2", label: "2-本存" },
        ],
      },
      {
        key: "streamProtocol",
        label: "直播流协议",
        type: "select",
        options: [{ value: "1", label: "1-HTTPSFLV" }, { value: "8", label: "8-SD_URL" }],
      },
      {
        key: "alarmVendor",
        label: "监控报警服务商",
        type: "select",
        options: [
          { value: "monitorSd", label: "monitorSd" },
          { value: "monitorXtyg", label: "monitorXtyg" },
        ],
      },
    ],
  },
  {
    id: "sd-temp",
    title: "2. 赛达温湿度设备",
    fields: [
      { key: "ak", label: "AK", type: "password" },
      { key: "sk", label: "SK", type: "password" },
    ],
  },
  {
    id: "sd-face",
    title: "3. 赛达人脸门禁",
    fields: [
      { key: "ak", label: "AK", type: "password" },
      { key: "sk", label: "SK", type: "password" },
    ],
  },
  {
    id: "sd-alarm",
    title: "4. 赛达监控报警 (掌宇)",
    fields: [
      { key: "ak", label: "AK", type: "password" },
      { key: "sk", label: "SK", type: "password" },
      {
        key: "storage",
        label: "存储类型",
        type: "select",
        options: [
          { value: "1", label: "1-云存" },
          { value: "2", label: "2-本存" },
        ],
      },
      { key: "streamProtocol", label: "直播流协议", type: "select", options: [{ value: "1", label: "1-HTTPSFLV" }] },
      { key: "alarmVendor", label: "监控报警服务商", type: "select", options: [{ value: "monitorSd", label: "monitorSd-赛达监控报警" }] },
    ],
  },
  {
    id: "sd-gps",
    title: "5. 赛达 GPS 设备",
    fields: [
      { key: "ak", label: "AK", type: "password" },
      { key: "sk", label: "SK", type: "password" },
    ],
  },
  {
    id: "xt-temp",
    title: "6. 芯途异构温湿度设备",
    fields: [
      { key: "ak", label: "AK", type: "password" },
      { key: "sk", label: "SK", type: "password" },
    ],
  },
  {
    id: "xt-lock",
    title: "7. 芯途异构锁设备",
    fields: [
      { key: "ak", label: "AK", type: "password" },
      { key: "sk", label: "SK", type: "password" },
    ],
  },
  {
    id: "xt-monitor",
    title: "8. 芯途异构监控设备",
    fields: [
      { key: "token", label: "token", type: "password" },
      {
        key: "streamProtocol",
        label: "直播流协议",
        type: "select",
        options: [
          { value: "rtmp", label: "rtmp" },
          { value: "flv", label: "flv" },
          { value: "hls", label: "hls" },
        ],
      },
      {
        key: "alarmVendor",
        label: "监控报警服务商",
        type: "select",
        options: [
          { value: "monitorSd", label: "monitorSd" },
          { value: "monitorXtyg", label: "monitorXtyg" },
        ],
      },
    ],
  },
  {
    id: "xy-lock",
    title: "9. 享宇智能挂锁",
    fields: [
      { key: "ak", label: "AK", type: "password" },
      { key: "sk", label: "SK", type: "password" },
    ],
  },
]

export const AGREEMENT_PLACEMENT_OPTIONS = ["登录页面", "仓单开立页面"] as const

export const MAX_AGREEMENTS = 20
