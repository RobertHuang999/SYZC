import type { LucideIcon } from "lucide-react"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Coins,
  FileText,
  Inbox,
  Lock,
  Mail,
  MessageSquare,
  Search,
  Shield,
  ShoppingCart,
  UserCheck,
} from "lucide-react"
import { LIST_BASE_PATH, MY_APPLY_LIST_PATH } from "../domain/constants"

export type ApprovalPreviewType = "business" | "unlock" | "policy" | "empty"

export type ApprovalCenterCard = {
  id: string
  label: string
  path: string
  icon: LucideIcon
  badge?: number
  previewType: ApprovalPreviewType
  groupId: string
  groupLabel: string
}

export type ApprovalCenterCardGroup = {
  id: string
  label: string
  cards: ApprovalCenterCard[]
}

const businessGroup = {
  groupId: "business",
  groupLabel: "业务管理审批",
} as const

const customerGroup = {
  groupId: "customer",
  groupLabel: "客户需求审批",
} as const

const otherGroup = {
  groupId: "other",
  groupLabel: "其他审批",
} as const

export const approvalCenterCardGroups: ApprovalCenterCardGroup[] = [
  {
    id: "business",
    label: "业务管理审批",
    cards: [
      {
        id: "pending",
        label: "待处理",
        path: "/工作中心/审批中心/业务管理审批/待处理",
        icon: Inbox,
        badge: 3,
        previewType: "business",
        ...businessGroup,
      },
      {
        id: "processed",
        label: "已处理",
        path: "/工作中心/审批中心/业务管理审批/已处理",
        icon: CheckCircle2,
        previewType: "business",
        ...businessGroup,
      },
      {
        id: "cc",
        label: "抄送我的",
        path: "/工作中心/审批中心/业务管理审批/抄送我的",
        icon: Mail,
        previewType: "business",
        ...businessGroup,
      },
      {
        id: "my-applications",
        label: "我的申请管理",
        path: MY_APPLY_LIST_PATH,
        icon: FileText,
        previewType: "business",
        ...businessGroup,
      },
      {
        id: "business-applications",
        label: "业务申请管理",
        path: "/工作中心/审批中心/业务管理审批/业务申请管理",
        icon: ClipboardList,
        previewType: "business",
        ...businessGroup,
      },
      {
        id: "supervision-entrust",
        label: "监管委托受理",
        path: "/工作中心/审批中心/业务管理审批/监管委托受理",
        icon: UserCheck,
        badge: 39,
        previewType: "business",
        ...businessGroup,
      },
    ],
  },
  {
    id: "customer",
    label: "客户需求审批",
    cards: [
      {
        id: "inbound-reservation",
        label: "客户入库预约",
        path: "/工作中心/审批中心/客户需求审批/客户入库预约",
        icon: ArrowDownToLine,
        previewType: "business",
        ...customerGroup,
      },
      {
        id: "outbound-reservation",
        label: "客户出库预约",
        path: "/工作中心/审批中心/客户需求审批/客户出库预约",
        icon: ArrowUpFromLine,
        previewType: "business",
        ...customerGroup,
      },
      {
        id: "financing-demand",
        label: "客户融资需求",
        path: "/工作中心/审批中心/客户需求审批/客户融资需求",
        icon: Coins,
        previewType: "business",
        ...customerGroup,
      },
      {
        id: "due-diligence",
        label: "融资尽调",
        path: "/工作中心/审批中心/客户需求审批/融资尽调",
        icon: Search,
        previewType: "business",
        ...customerGroup,
      },
      {
        id: "sales-demand",
        label: "客户销售需求",
        path: "/工作中心/审批中心/客户需求审批/客户销售需求",
        icon: MessageSquare,
        badge: 1,
        previewType: "business",
        ...customerGroup,
      },
      {
        id: "procurement-demand",
        label: "客户采购需求",
        path: "/工作中心/审批中心/客户需求审批/客户采购需求",
        icon: ShoppingCart,
        previewType: "business",
        ...customerGroup,
      },
    ],
  },
  {
    id: "other",
    label: "其他审批",
    cards: [
      {
        id: "policy",
        label: "政策资讯审核",
        path: "/工作中心/审批中心/其他审批/政策资讯审核",
        icon: BookOpen,
        badge: 1,
        previewType: "policy",
        ...otherGroup,
      },
      {
        id: "unlock",
        label: "开锁审核",
        path: LIST_BASE_PATH,
        icon: Lock,
        previewType: "unlock",
        ...otherGroup,
      },
      {
        id: "mid-loan-risk",
        label: "贷中风控处理",
        path: "/工作中心/审批中心/其他审批/贷中风控处理",
        icon: Shield,
        previewType: "empty",
        ...otherGroup,
      },
    ],
  },
]

export const approvalCenterCards = approvalCenterCardGroups.flatMap((group) => group.cards)

export type BusinessPendingPreviewRow = {
  id: number
  processType: string
  ownerName: string
  ownerCode: string
  processStatus: string
  goodsInfo: string
  safetyLine: string
  initiator: string
  arrivedAt: string
}

export type PolicyPreviewRow = {
  id: number
  title: string
  publisher: string
  status: string
  submittedAt: string
}

export const businessPendingPreviewMock: BusinessPendingPreviewRow[] = [
  {
    id: 1,
    processType: "监管 / 监管报告",
    ownerName: "动物公司1(监管)",
    ownerCode: "11433422CNHTJGEQP9",
    processStatus: "待分配",
    goodsInfo: "水果-香蕉-海南-72斤",
    safetyLine: "--",
    initiator: "lxy (四川享宇科技有限公司)",
    arrivedAt: "2026-05-25 15:26:28",
  },
  {
    id: 2,
    processType: "监管 / 监管报告",
    ownerName: "华东铜业(监管)",
    ownerCode: "22334455CNHTJGEQP8",
    processStatus: "待分配",
    goodsInfo: "电解铜-99.99%-32吨",
    safetyLine: "--",
    initiator: "wang5 (上海森云监管)",
    arrivedAt: "2026-05-24 11:08:16",
  },
  {
    id: 3,
    processType: "融资 / 尽调申请",
    ownerName: "华南橡胶贸易",
    ownerCode: "99887766CNHTJGEQP7",
    processStatus: "审批中",
    goodsInfo: "天然橡胶-标准胶-120吨",
    safetyLine: "85%",
    initiator: "li4 (广州保理)",
    arrivedAt: "2026-05-23 09:42:03",
  },
  {
    id: 4,
    processType: "仓储 / 入库预约",
    ownerName: "西南铝业",
    ownerCode: "55667788CNHTJGEQP6",
    processStatus: "待确认",
    goodsInfo: "铝锭-ADC12-48吨",
    safetyLine: "--",
    initiator: "zhang3 (森云科技)",
    arrivedAt: "2026-05-22 16:15:44",
  },
  {
    id: 5,
    processType: "监管 / 委托受理",
    ownerName: "北方热轧物流",
    ownerCode: "11223344CNHTJGEQP5",
    processStatus: "待分配",
    goodsInfo: "热轧卷板-Q235B-56吨",
    safetyLine: "--",
    initiator: "chen7 (天津监管)",
    arrivedAt: "2026-05-21 14:30:12",
  },
]

export const policyPreviewMock: PolicyPreviewRow[] = [
  {
    id: 1,
    title: "2026年大宗商品仓储监管指引（征求意见稿）",
    publisher: "监管政策中心",
    status: "待审核",
    submittedAt: "2026-05-25 10:20:00",
  },
  {
    id: 2,
    title: "供应链金融存货质押风险披露模板更新",
    publisher: "合规部",
    status: "待审核",
    submittedAt: "2026-05-24 15:08:33",
  },
  {
    id: 3,
    title: "物联网设备接入与数据留存规范",
    publisher: "技术委员会",
    status: "待审核",
    submittedAt: "2026-05-23 09:12:18",
  },
  {
    id: 4,
    title: "押品预警等级调整操作说明",
    publisher: "风控运营",
    status: "待审核",
    submittedAt: "2026-05-22 11:45:06",
  },
  {
    id: 5,
    title: "客户融资需求受理流程优化通知",
    publisher: "产品运营",
    status: "待审核",
    submittedAt: "2026-05-21 08:30:55",
  },
]

export const PREVIEW_ROW_LIMIT = 5
