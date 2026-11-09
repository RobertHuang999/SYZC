import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deliveryOrderListAnnotations: PrototypeAnnotation[] = [
  {
    id: "delivery-order-page",
    targetId: "delivery-order-page",
    number: 1,
    kind: "页面",
    title: "提货单业务定位与台账边界",
    content:
      "本页面为存货出库终审通过后大宗商品实物离开监管仓库的交接核销台账（P-CKG-015）。上游出库审批通过一瞬间由系统底层原子自动生成提货单，初始为【未提货】。严禁手工新建提货单。支持4位动态提货码核销与免码直接确认双通道履约，取消提货逆向跨模块联动【退货入库】。",
    documentRefs: {
      prd: {
        section: "1. 业务背景与业务痛点",
        match: "提货",
        element: "text",
      },
      fields: {
        section: "0. 对象与字段层级说明",
        match: "单据级基础字段",
        element: "row",
      },
      rules: {
        section: "一、模块业务定位与单据状态机",
        match: "出库单终审原子生成提货单",
        element: "text",
      },
    },
    details: [
      {
        title: "业务规则与边界",
        items: [
          {
            label: "生成真源",
            content: "【出库单终审原子生成提货单】(R01)：仅限普通出库、仓单出库、质押出库、抵押出库终审通过后生成；移库/加工在各自模块闭环。",
          },
          {
            label: "手工新建禁令",
            content: "提货单严禁手工新增，列表顶部不设“新增”按钮。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-order-filter",
    targetId: "delivery-order-filter",
    number: 2,
    kind: "字段",
    title: "列表顶部筛选区（单行水平排列·无重置按钮）",
    content:
      "顶部提供 3 项筛选条件：货主名称/标识（单行文本模糊检索）、提货人姓名/手机号（单行文本检索）、提货状态（全部/未提货/已提货/已取消 下拉单选），右侧放置金色实心【查询】按钮。遵循系统规范，不设【重置】按钮。",
    documentRefs: {
      prd: {
        section: "5.1 提货单列表查询页（P-CKG-015）",
        match: "筛选区",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段（列表与筛选）",
        match: "提货状态",
        element: "row",
      },
      rules: {
        section: "一、提货单状态机",
        match: "状态编码",
        element: "row",
      },
    },
    details: [
      {
        title: "筛选控件与口径",
        items: [
          {
            label: "货主匹配",
            content: "支持货主全称、统一社会信用代码或脱敏手机号模糊检索。",
          },
          {
            label: "无重置按钮",
            content: "遵循系统统一规范，筛选区仅保留金色实心【查询】按钮。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-order-table-r02",
    targetId: "delivery-order-table-r02",
    number: 3,
    kind: "规则",
    title: "【列表操作人与时间字段固化】(R02)",
    content:
      "列表【操作人】始终展示上游出库申请的发起人（制单人），格式为“制单人姓名(所属公司全称)”；无论后续由谁执行核销或提货，该列绝不被覆盖改写。列表【时间】为提货单生成时间戳，精确到秒，列表默认以此时间倒序排列。",
    documentRefs: {
      prd: {
        section: "6. 核心业务规则索引",
        match: "列表操作人与时间字段固化",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【列表操作人与时间字段固化】(R02)",
        element: "text",
      },
    },
    details: [
      {
        title: "字段真源规范",
        items: [
          {
            label: "操作人固化",
            content: "固化上游出库制单人；现场实际核销人记录在【详情-提货记录】与【操作记录】中。",
          },
          {
            label: "时间固化",
            content: "提货单系统生成落库时刻，列表默认以此时间倒序排列。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-order-pickup-r03",
    targetId: "delivery-order-pickup-r03",
    number: 4,
    kind: "交互",
    title: "【提货人展示与企业悬停浮层】(R03)",
    content:
      "个人提货人展示为“姓名(手机号脱敏)”；企业提货人展示经办人信息“经办人姓名(手机号脱敏)经办人”，并在下方展示橙色文字【更多】。鼠标悬停在【更多】时平滑弹出气泡浮层（Popover），展示两行内容：第一行企业名称，第二行统一社会信用代码。",
    documentRefs: {
      prd: {
        section: "场景 6【企业提货人多层级身份穿透审计】(S06)",
        match: "悬浮在下方的橙色【更多】",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【提货人展示与企业悬停浮层】(R03)",
        element: "text",
      },
    },
    details: [
      {
        title: "展示与悬停规范",
        items: [
          {
            label: "个人提货人",
            content: "展示真实姓名(手机号脱敏)，无更多按钮。",
          },
          {
            label: "企业提货人",
            content: "经办人姓名(手机号脱敏)经办人；悬停【更多】浮层显示企业全称与信用代码。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-order-actions-matrix",
    targetId: "delivery-order-actions-matrix",
    number: 5,
    kind: "规则",
    title: "行操作按钮状态受控矩阵（置灰防穿透）",
    content:
      "【未提货】：查看详情、操作记录、核销提货码、取消提货、确认提货全部高亮可用；【已提货】与【已取消】：查看详情、操作记录高亮可用，核销提货码、取消提货、确认提货置灰禁用（浅灰色字体 + cursor: not-allowed，不可点击）。右侧操作列采用实色防穿透背景与立体投影。",
    documentRefs: {
      prd: {
        section: "5.1 提货单列表查询页（P-CKG-015）",
        match: "列表行操作状态受控逻辑",
        element: "text",
      },
      rules: {
        section: "二、行操作与按钮状态矩阵",
        match: "行操作按钮",
        element: "row",
      },
    },
    details: [
      {
        title: "状态机受控逻辑",
        items: [
          {
            label: "未提货态",
            content: "5个按钮全量可用，支持双通道核销与逆向取消。",
          },
          {
            label: "终态禁用",
            content: "已提货与已取消单据为不可逆终态，核销/取消/确认提货置灰禁用。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-order-write-off-r04",
    targetId: "delivery-order-write-off-r04",
    number: 6,
    kind: "规则",
    title: "【正向履约通道A-4位提货码动态核销】(R04)",
    content:
      "首次点击未获取提示发送动态码，短信下发提货人手机号，7天有效；单据变为已获取状态后，点击直接进入两步弹窗：第一步确认本人提货、必传交接照片（≤5M）、选填说明、支持重置提货码二次确认；第二步呈现4个独立PIN码方框输入，校验一致后完成提货并变迁为【已提货】。",
    documentRefs: {
      prd: {
        section: "5.3 4 位动态码核销两步弹窗",
        match: "4 位 PIN 码输入格",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【正向履约通道A-4位提货码动态核销】(R04)",
        element: "text",
      },
    },
    details: [
      {
        title: "通道 A 核销规则",
        items: [
          {
            label: "首次前置提示",
            content: "未获取时弹出提示确定后发送短信，7天有效。",
          },
          {
            label: "两步流转",
            content: "第一步录入本人确认与现场交接照片；第二步输入4位PIN格核销。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-order-confirm-r05",
    targetId: "delivery-order-confirm-r05",
    number: 7,
    kind: "规则",
    title: "【正向履约通道B-免码现场直接确认提货】(R05)",
    content:
      "适用于现场弱网或直接当面交接场景。提货时间系统只读带出；是否本人提货默认“是”，无论选“是”或“否”，下方提货人类型、姓名、身份证号、电话均保持灰底只读带出，严禁现场篡改；原出库现场照片只读比对外观；提货照片必传（最多10张）；车牌号选填；确认后变迁为【已提货】。",
    documentRefs: {
      prd: {
        section: "5.4 免码确认提货弹窗",
        match: "免码确认提货",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【正向履约通道B-免码现场直接确认提货】(R05)",
        element: "text",
      },
    },
    details: [
      {
        title: "通道 B 免码规则",
        items: [
          {
            label: "防篡改强约束",
            content: "提货人信息无论选否均灰底只读，严禁现场修改篡改。",
          },
          {
            label: "实物外观比对",
            content: "回显原出库拍摄外观实物原图，防止调包冒领。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-order-cancel-r06",
    targetId: "delivery-order-cancel-r06",
    number: 8,
    kind: "规则",
    title: "【逆向作废与跨模块退货入库联动】(R06)",
    content:
      "现场提货异常或客户拒提时，点击【取消提货】弹出二次确认提示，强制录入最多50字说明；确认后单据立即变迁为不可逆终态【已取消】；点击【前往退货入库】后页面直达跳转至入库管理模块，自动锁定入库类型为退货入库，带出原出库单号与货品数量上限，现场分配库位清零未堆放数量后提交审批。",
    documentRefs: {
      prd: {
        section: "5.5 取消提货提示与退货入库跳转",
        match: "前往退货入库",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【逆向作废与跨模块退货入库联动】(R06)",
        element: "text",
      },
    },
    details: [
      {
        title: "逆向闭环机制",
        items: [
          {
            label: "必填说明",
            content: "强制录入50字以内取消说明，记录于操作记录中。",
          },
          {
            label: "退货入库承接",
            content: "页面直达跳转至退货入库新增页，入库类型锁定退货入库，清零未堆放数量后审批回补库存。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-order-log-r08",
    targetId: "delivery-order-log-r08",
    number: 9,
    kind: "规则",
    title: "【操作记录全生命周期审计】(R08)",
    content:
      "时间轴弹窗按时间从上到下倒序排列（最新在上）。覆盖6大标准事件节点：提货单生成（系统自动）、获取提货码、重置提货码、确认提货、核销提货码、取消提货（含50字说明）。记录操作时间、操作人及所属机构，形成司法级不可篡改存证。",
    documentRefs: {
      prd: {
        section: "5.6 操作记录时间轴弹窗",
        match: "涵盖 6 大事件节点",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【操作记录全生命周期审计】(R08)",
        element: "text",
      },
    },
    details: [
      {
        title: "审计留痕字典",
        items: [
          {
            label: "倒序排布",
            content: "最新事件位于时间轴顶部，清晰可溯。",
          },
          {
            label: "6大事件",
            content: "提货单生成、获取提货码、重置提货码、确认提货、核销提货码、取消提货。",
          },
        ],
      },
    ],
  },
]
