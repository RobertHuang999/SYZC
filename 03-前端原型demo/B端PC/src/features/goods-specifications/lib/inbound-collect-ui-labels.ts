/**
 * 入库收集项配置 · 上线说明与规格对照文案真源
 *
 * 约定：
 * - `INBOUND_COLLECT_USER_*` 只给 ProductFieldHint / DialogDescription 使用，说人话、不写规则编号；
 * - `INBOUND_COLLECT_SPEC_*` 只给 PrototypeSpecCallout 使用，可写【规则名称】(编号)。
 */

export const INBOUND_COLLECT_USER_NAME_HINT =
  "用来区分不同的采集项，2～30 个字，同一租户内不能重名。"

export const INBOUND_COLLECT_USER_NAME_LOCKED_HINT =
  "系统核心字段，名称不可修改，只能调整输入提示和备注。"

export const INBOUND_COLLECT_USER_CONTROL_HINT =
  "决定仓库现场录单时这一项怎么填；确认保存后如果已经被货品使用，就不能再改。"

export const INBOUND_COLLECT_USER_CONTROL_LOCKED_BY_REF =
  "该项已被使用，控件类型已锁定"

export const INBOUND_COLLECT_USER_CONTROL_LOCKED_BY_CORE =
  "系统核心字段，控件类型已锁定"

export const INBOUND_COLLECT_USER_UNIT_HINT =
  "显示在数值后面的固定单位，例如 ℃、%RH、kg，最多 10 个字。"

export const INBOUND_COLLECT_USER_UNIT_LOCKED_HINT =
  "该项已被使用，单位标签已锁定，不能修改。"

export const INBOUND_COLLECT_USER_OPTIONS_HINT =
  "至少配 1 个选项，现场录单时从这里单选一个。"

export const INBOUND_COLLECT_USER_PLACEHOLDER_HINT =
  "仓库现场输入框里的灰色提示文字，最多 50 个字。误敲的下划线或全角减号会自动纠正成半角「-」。"

export const INBOUND_COLLECT_USER_REMARK_HINT =
  "记录这一项的业务背景或行业标准要求，最多 200 个字。"

export const INBOUND_COLLECT_USER_SHELF_LIFE_UNITS_HINT =
  "天、月、年至少保留一个；关掉的单位，货品建档时就选不到了。"

export const INBOUND_COLLECT_USER_RECOMMEND_UNIT_HINT =
  "货品建档勾选保质期时默认预选这个单位，只能选已开启的单位。"

export const INBOUND_COLLECT_USER_FILTER_HINT =
  "按收集项名称模糊查；控件类型、状态、创建时间范围可组合筛选。"

export const INBOUND_COLLECT_SPEC_NAME_NOTE =
  "【收集项名称唯一性校验规则】(R01)：名称 2～30 个字符，录入自动去除首尾空格，同一租户内全局唯一，重名时阻断保存并标红提示。"

export const INBOUND_COLLECT_SPEC_CONTROL_NOTE =
  "【系统核心收集项保护机制】(R02)：保质期、生产日期、过期时间等核心字段的控件类型永久锁定；自定义项一旦被下游品类或货品引用，控件类型同样锁定只读，防止改坏存量业务。"

export const INBOUND_COLLECT_SPEC_MINUS_NOTE =
  "【负数温度与减号录入防呆规则】(R07)：内置「- 减号」按钮在光标处插入标准半角减号，手动误输入的下划线「_」与全角减号「－」自动静默纠正，不弹红字阻断。"

export const INBOUND_COLLECT_SPEC_SHELF_LIFE_NOTE =
  "【保质期度量单位白名单与基准推荐规则】(R05)：天、月、年三项开关不可同时关闭，至少保留 1 项开启；此处开启的单位范围即下游【货品管理】建档指定固定保质期单位的可选白名单。"

export const INBOUND_COLLECT_SPEC_DOWNSTREAM_NOTE =
  "【下游货品执行与入库单只读规则】(R06)：货品主档从白名单指定专属固定单位并设置是否必填与建议数值，产生首笔入库单后单位自动锁定；仓储入库单单位只读，生产日期、保质期数值、过期时间三项独立填报，仅校验过期时间必须晚于生产日期。"

export const INBOUND_COLLECT_SPEC_AUDIT_NOTE =
  "【多人同时编辑防冲突与防重复提交规则】(C02)：每次保存数据版本号递增，后保存者提示刷新重试，避免静默覆盖；【历史业务单据不受影响规则】(C01)：配置变更只对后续新建业务生效，不回写历史入库单与批次台账。"

export const INBOUND_COLLECT_SPEC_TENANT_NOTE =
  "【多租户数据隔离机制】(P02)：收集项字典池按租户严格隔离，不同租户之间数据互不可见。"

export const INBOUND_COLLECT_SPEC_DELETE_NOTE =
  "【两阶段安全删除控制规则】(R04)：先校验自身已停用，再探测下游品类/货品引用；有引用一律阻断，完全无引用才允许二次确认后删除。"
