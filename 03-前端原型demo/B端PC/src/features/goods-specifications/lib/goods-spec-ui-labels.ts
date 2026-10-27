/**
 * 货品规格管理 · 上线说明与规格对照文案真源
 *
 * 约定：
 * - `*_USER_*` 只给 ProductFieldHint / DialogDescription 使用，说人话、不写规则编号；
 * - `*_SPEC_*` 只给 PrototypeSpecCallout 使用，可写【规则名称】(编号)。
 */

export const MAJOR_CATEGORY_USER_FILTER_HINT =
  "按大类名称模糊查询；状态可筛选启用或停用的大类。"

export const MAJOR_CATEGORY_USER_NAME_HINT =
  "名称用于品类与货品的分类归集，同一租户内不能重名，最多 20 个字。"

export const MAJOR_CATEGORY_USER_CASCADE_HINT =
  "停用大类会同时停用下属品类和货品；重新启用时只恢复停用前处于启用状态的下级。"

export const MAJOR_CATEGORY_SPEC_CASCADE_NOTE =
  "【父级停用全树级联下发规则】(CAT-F02)：停用前保存下级状态快照，同一事务内级联停用全部下级；【父级启用快照恢复规则】(CAT-F03)：重新启用时按快照恢复，原本主动停用的下级保持停用。"

export const MAJOR_CATEGORY_SPEC_DELETE_NOTE =
  "【两阶段删除强校验与级联逻辑删除规则】(CAT-F05)：先校验大类已停用，再扫描整棵子树是否存在入库单；无入库数据时二次确认后连同下属品类、货品一起逻辑删除。"

export const SUBCATEGORY_USER_NAME_HINT =
  "品类名称在同一个大类下不能重名，最多 20 个字。"

export const SUBCATEGORY_USER_SPEC_HINT =
  "规格参数决定货品建档时要填哪些规格值，最少 1 组、最多 5 组，达到 5 组后不能再添加。"

export const SUBCATEGORY_USER_CATEGORY_HINT =
  "只能选择启用中的大类；所属大类停用后，品类不能单独启用。"

export const SUBCATEGORY_SPEC_SPEC_DIMENSION_NOTE =
  "【动态规格参数维度上限控制规则】(SUB-F02)：规格参数维度数量严格限制为 1~5 个，达到 5 个时前端置灰禁用添加按钮，服务端同步强校验。"

export const SUBCATEGORY_SPEC_CASCADE_NOTE =
  "【上级大类启用状态强依赖规则】(SUB-F03)：所属大类停用时禁止启用品类；【级联停用与两阶段删除控制规则】(SUB-F05)：停用品类时保存下属货品状态快照并级联停用。"

export const GOODS_USER_TREE_HINT =
  "先在左侧选择品类，右侧只展示该品类下的货品；需要查看已停用货品时勾选底部开关。"

export const GOODS_USER_BASE_HINT =
  "先选货品大类和品类，系统会按品类定义的规格参数自动生成规格输入项。"

export const GOODS_USER_SPEC_HINT =
  "规格取值、计量参数和单位共同决定货品是否重复，同一品类下不能重复建档。"

export const GOODS_USER_INBOUND_HINT =
  "货品入库时需要采集哪些信息，就在这里勾选；勾选后可以逐项设置为必填。未勾选的收集项，入库单不会出现该字段。"

export const GOODS_USER_PRICE_HINT =
  "按元录入参考单价，最多保留 2 位小数；列表可按元或万元查看，方便不同量级货品对比。"

export const GOODS_SPEC_UNIQUE_NOTE =
  "【货品SKU唯一性校验规则】(SKU-F01)：同一品类下，动态规格组合 + 计量参数 + 单位必须严格唯一。"

export const GOODS_SPEC_INBOUND_NOTE =
  "【入库收集信息预置项配置规则】(SKU-F03)：从系统预置收集项中勾选并逐项设置是否必填；未配置的收集项，入库单不展示额外采集字段。"

export const GOODS_SPEC_EDIT_BLOCK_NOTE =
  "【编辑操作入库单强拦截规则】(SKU-F08)：货品已产生入库单后，编辑保存会被拦截并提示；需要先处理完相关入库业务。"

export const GOODS_SPEC_DELETE_NOTE =
  "【两阶段安全删除控制规则】(SKU-F09)：第一步拦截启用中的货品，第二步扫描入库单；没有入库数据时二次确认后才允许逻辑删除。"

export const GOODS_SPEC_EFFECTIVE_NOTE =
  "【有效启用状态多级综合计算规则】(SKU-F11)：自身、品类、大类三者全部启用，才算有效启用；只有有效启用的货品，下游新建单据时才能选到。"

export const GOODS_SPEC_PRICE_NOTE =
  "【参考单价维护与双精度展示规则】(SKU-F05)：按元录入并保存 2 位小数；列表支持元（6 位小数、千分位）与万元（10 位小数）两种展示，设价自动写入修改记录。"
