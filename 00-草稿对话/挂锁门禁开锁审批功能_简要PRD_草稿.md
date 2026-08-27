# 挂锁门禁开锁审批功能 简要PRD（草稿）

> **文档版本**：V1.0 (Draft)  
> **文档状态**：草稿  
> **归档位置**：`00-草稿对话/`  
> **编写时间**：2026-08-25  
> **适用终端**：Web 管理端 (PC)、移动工作台 (H5/App)

---

## 1. 需求背景与目标

### 1.1 业务背景
在存货监管体系中，挂锁门禁作为库房实物物理屏障，直接关乎质押物安全。原有机制下具备权限的操作员点击【获取门锁密码】即可直接获取，存在无序开锁及监管盲区。

### 1.2 核心目标
1. **库房级精细管控**：支持在库房维度配置是否开启挂锁开锁审批及指定审批人。
2. **事前审批流转**：开启审批的库房，开锁必须提交申请，经审批人审核通过后方可下发密码。
3. **密码安全下发**：审批通过后，系统调用密码服务并经短信网关单向发送至申请人手机，全程留痕且不在页面/日志留存明文。

---

## 2. 业务流程与状态机

### 2.1 端到端业务全景流程图

```mermaid
flowchart TD
    start(["操作员在设备列表点击【获取门锁密码】"]) --> check_bind{"设备是否绑定库房?"}
    
    %% 前置校验分支
    check_bind -->|"否"| alert_bind["提示: 未绑定库房，阻断操作"]
    alert_bind --> finish_stop(["流程结束"])
    
    check_bind -->|"是"| check_phone{"申请人是否绑定手机号?"}
    check_phone -->|"否"| alert_phone["提示: 账号未绑定手机号，阻断操作"]
    alert_phone --> finish_stop
    
    check_phone -->|"是"| check_mode{"所属库房是否开启开锁审批?"}

    %% 分支A：免审批直通模式
    check_mode -->|"否 (无需审批)"| direct_modal["弹出【获取密码】确认弹窗"]
    direct_modal --> direct_input["填写开锁事由/备注并确认"]
    direct_input --> direct_gen["系统生成3天动态密码并触发短信"]
    direct_gen --> direct_sms["短信网关发送密码至申请人手机"]
    direct_sms --> direct_display["前端弹窗直接展示3天动态密码"]
    direct_display --> log_direct["记录开锁审计日志"]
    log_direct --> success_end(["完成开锁准备"])

    %% 分支B：审批管控模式
    check_mode -->|"是 (需要审批)"| check_pending{"当前设备是否有在途待审批单据?"}
    check_pending -->|"是"| alert_dup["提示: 当前设备已有在途申请，阻断重复提交"]
    alert_dup --> finish_stop
    
    check_pending -->|"否"| apply_modal["弹出【门锁开锁密码申请】弹窗"]
    apply_modal --> apply_submit["申请人选择开锁事由、填写备注并提交"]
    apply_submit --> create_order["系统创建审批单: 状态【待审批】<br/>加设备防重锁 + 绑定审批人快照"]
    create_order --> notify_approver["推送待办通知给指定审批人"]
    
    notify_approver --> approver_action{"审批人审核决策"}
    
    %% 审批驳回
    approver_action -->|"驳回"| input_reject_reason["必填驳回原因"]
    input_reject_reason --> order_rejected["单据流转为【已驳回】<br/>释放设备防重锁"]
    order_rejected --> notify_reject["向申请人推送驳回通知"]
    notify_reject --> finish_stop

    %% 审批通过
    approver_action -->|"通过"| pre_pass_check{"设备是否仍处于有效绑定状态?"}
    pre_pass_check -->|"否 (已被解绑/停用)"| order_invalid_abort["提示设备失效，单据自动作废"]
    order_invalid_abort --> finish_stop
    
    pre_pass_check -->|"是"| order_passed["单据流转为【已通过】"]
    order_passed --> gen_pwd["系统调用密码服务生成3天动态密码"]
    gen_pwd --> send_sms["短信网关单向发送密码至申请人手机"]
    send_sms --> sms_check{"短信发送是否成功?"}
    
    sms_check -->|"成功"| order_complete["单据归档，记录完整审计留痕"]
    order_complete --> notify_applicant["向申请人推送审批通过通知"]
    notify_applicant --> success_end
    
    sms_check -->|"失败"| mark_sms_fail["单据标记【已通过(短信失败)】<br/>开放审批人/申请人【重发短信】"]
    mark_sms_fail --> resend_action["触发手动重发短信"]
    resend_action --> send_sms
```

### 2.2 跨系统交互时序图

```mermaid
sequenceDiagram
    autonumber
    actor U as 申请人 (现场库管/操作员)
    participant F as 前端 (PC/H5)
    participant S as 业务服务端
    actor A as 审批人 (库管主管/风控)
    participant SMS as 密码及短信网关

    U->>F: 点击挂锁门禁【获取门锁密码】
    F->>S: 校验设备绑定状态、个人手机号及库房审批配置
    alt 未绑定库房 / 未绑定手机号
        S-->>F: 阻断并给出相应前置配置提示
    else 库房配置：无需审批
        F->>F: 弹出“获取密码”弹窗 (填事由/备注)
        U->>F: 确认提交
        F->>SMS: 触发密码生成并短信下发
        SMS-->>F: 下发成功
        F-->>U: 页面弹窗展示3天动态密码
    else 库房配置：需要审批
        S->>S: 检查是否有在途“待审批”单据
        alt 存在在途单据
            S-->>F: 阻断重复提交
        else 无在途单据
            F->>F: 弹出“门锁开锁密码申请”弹窗
            U->>F: 填写事由/备注并提交
            F->>S: 生成开锁审批单 (状态: 待审批)
            S->>A: 发送待办审批通知
            
            alt 审批驳回
                A->>S: 驳回 (填驳回原因)
                S->>S: 释放设备防重锁，流转为“已驳回”
                S-->>U: 通知申请被驳回 (单据终结)
            else 审批通过
                A->>S: 审核通过
                S->>SMS: 请求生成动态密码并发送短信
                SMS-->>U: 发送短信密码至申请人手机 (审批端不留明文)
                S->>S: 记录全流程审计日志
                S-->>U: 单据状态更新为“已通过”
            end
        end
    end
```

### 2.3 申请单状态机与流转图

```mermaid
stateDiagram-v2
    [*] --> 待审批 : 提交开锁申请 (加设备防重锁)
    
    待审批 --> 已通过 : 审批人审核通过 (下发动态密码)
    待审批 --> 已驳回 : 审批人驳回 (录入原因并释放锁)
    待审批 --> 已失效 : 超过24小时未审批超时失效 (释放锁)
    
    已通过 --> 短信发送失败 : 短信网关投递异常
    短信发送失败 --> 已通过 : 重新发送短信成功
    
    已通过 --> [*] : 现场开锁完成
    已驳回 --> [*]
    已失效 --> [*]
```

### 2.4 异常处置与容错恢复流程图

```mermaid
flowchart TD
    subgraph G1 ["超时熔断机制"]
        timeout_timer["系统定时任务: 每10分钟扫描一次"] --> check_timeout{"单据待审批时长 > 24小时?"}
        check_timeout -->|"是"| auto_expire["单据自动流转为【已失效】"]
        auto_expire --> unlock_device["释放设备在途申请防重锁"]
        unlock_device --> notify_timeout["系统通知申请人单据已超时失效"]
    end

    subgraph G2 ["动态配置变更容错"]
        config_change["管理员修改了库房审批人"] --> snapshot_check{"历史在途单据处理"}
        snapshot_check --> keep_snapshot["沿用单据发起时的审批人快照"]
        snapshot_check --> staff_disabled{"审批人账号被禁用或离职?"}
        staff_disabled -->|"是"| admin_reassign["支持管理员或上级主管进行待办【转派】"]
    end

    subgraph G3 ["短信下发重试机制"]
        sms_err["短信服务响应异常/发送失败"] --> mark_fail["单据更新为【已通过(短信失败)】"]
        mark_fail --> btn_resend["详情页展示【重发短信】操作入口"]
        btn_resend --> check_freq{"重发频次校验 (单次间隔 >= 60s)"}
        check_freq -->|"满足"| retry_send["重新调用短信网关"]
        check_freq -->|"不满足"| tip_wait["提示: 请等待倒计时结束后再重发"]
    end
```

---

## 3. 功能模块与界面规格

### 3.1 仓库管理 - 库房配置模块

**页面位置**：【配置管理】→【仓库管理】→ 仓库详情 →【库房与分区配置】页签 → 库房新增/编辑弹窗

#### 1. 库房审批配置流程图

```mermaid
flowchart TD
    enter_config["管理员打开库房新增/编辑弹窗"] --> input_basic["填写库房基本信息: 库房名称、编码等"]
    input_basic --> toggle_switch{"设置【挂锁开锁审批】开关"}
    
    %% 开关为“否”
    toggle_switch -->|"设为【否】"| hide_approver["隐藏【开锁审批人】配置项"]
    hide_approver --> clear_approver["清空已选审批人数据"]
    clear_approver --> submit_form["点击【保存】"]
    
    %% 开关为“是”
    toggle_switch -->|"设为【是】"| show_approver["动态显化【开锁审批人】下拉选择框"]
    show_approver --> select_user["选择开锁审批人 (所属机构具备审批权限的人员)"]
    select_user --> validate_approver{"是否已选择审批人?"}
    
    validate_approver -->|"否"| alert_empty["表单校验报错: 请选择开锁审批人"]
    alert_empty --> show_approver
    validate_approver -->|"是"| submit_form
    
    submit_form --> backend_save["后端保存配置并即时生效"]
    backend_save --> finish_config(["配置更新完成"])
```

#### 2. 字段规则表

| 字段名称 | 控件类型 | 必填性 | 默认值 | 校验与联动规则 |
| :--- | :--- | :--- | :--- | :--- |
| **库房名称** | 单行文本框 | 必填 | 无 | 同仓库内唯一，不超过50字符 |
| **出入库审核** | 单选框 (`是`/`否`) | 选填 | `否` | 原有出入库流程控制 |
| **挂锁开锁审批** | 单选框 (`是`/`否`) | 必填 | `否` | 切换为“是”时，下方显示【开锁审批人】；切换为“否”时隐藏该配置 |
| **开锁审批人** | 远程下拉选择 (单选/多选) | 条件必填 | 空 | 仅当“挂锁开锁审批”=`是`时必填；候选人范围为所属机构具备审批角色的有效账号 |
| **备注** | 多行文本框 | 选填 | 无 | 不超过500字符 |

---

### 3.2 设备管理 - 挂锁门禁【获取门锁密码】操作

**页面位置**：【仓储】→【设备管理-门禁设备】列表“操作”列

#### 1. 前端交互与分支控制流程图

```mermaid
flowchart TD
    click_btn["操作员点击设备列表【获取门锁密码】"] --> check_auth{"是否有操作权限?"}
    
    check_auth -->|"无权限"| no_perm["提示无权限并阻断"]
    check_auth -->|"有权限"| check_dev_bind{"设备是否已绑定所属库房?"}
    
    %% 未绑定库房
    check_dev_bind -->|"否"| toast_unbind["Toast提示: 该设备尚未绑定具体库房，请先完成仓库库房绑定配置"]
    
    %% 已绑定库房
    check_dev_bind -->|"是"| check_user_phone{"当前操作人是否绑定手机号?"}
    
    %% 未绑定手机号
    check_user_phone -->|"否"| toast_nophone["Dialog提示: 当前账号未绑定手机号，无法接收短信，请前往绑定"]
    
    %% 已绑定手机号
    check_user_phone -->|"是"| fetch_room_cfg{"查询所属库房配置: 是否开启挂锁审批?"}
    
    %% 分支A：无需审批
    fetch_room_cfg -->|"否 (无需审批)"| open_direct_modal["弹出原【获取门锁密码】确认框"]
    open_direct_modal --> input_direct_reason["必填开锁事由, 选填备注"]
    input_direct_reason --> confirm_direct["点击【确认】"]
    confirm_direct --> api_direct["请求后端直发密码接口"]
    api_direct --> show_pwd_modal["页面弹窗展示3天动态密码<br/>+ 同步发送短信至手机"]
    
    %% 分支B：需要审批
    fetch_room_cfg -->|"是 (需要审批)"| check_pending_order{"该设备是否有在途【待审批】单据?"}
    
    check_pending_order -->|"存在在途单"| toast_dup["Toast提示: 当前设备已有审批中的开锁申请，请勿重复提交"]
    check_pending_order -->|"无在途单"| open_apply_modal["弹出【门锁开锁密码申请】弹窗"]
    
    open_apply_modal --> display_info["只读展示: 设备名称、设备编码、所属库房、当前审批人"]
    display_info --> input_apply_form["选择开锁事由 (必填) + 填写申请备注 (选填)"]
    input_apply_form --> submit_apply["点击【提交申请】"]
    submit_apply --> api_apply["调用提交申请接口，生成审批单"]
    api_apply --> toast_success["关闭弹窗并提示: 申请已提交，等待审批人审批，通过后密码将以短信下发"]
```

#### 2. 交互逻辑与分支控制说明

1. **前置校验**：
   - 账号是否具备“获取门锁密码”角色权限；
   - 挂锁设备是否已绑定所属库房（若未绑定库房，阻断并提示：*“该设备尚未绑定具体库房，请先完成仓库库房绑定配置后再操作”*）；
   - 申请人是否绑定手机号（若未绑定，阻断并提示：*“当前账号未绑定手机号，无法接收开锁密码短信，请先前往个人中心绑定手机号”*）；
   - 设备当前是否存在“待审批”单据（若存在，阻断并提示：*“当前设备已有审批中的开锁申请，请勿重复提交”*）。
2. **分支 A：库房配置“无需审批”**
   - 弹出原【获取门锁密码】确认弹窗；
   - 填写事由（必填）、备注（选填）→ 点击确定 → 短信发送并页面展示 3 天动态密码。
3. **分支 B：库房配置“需要审批”**
   - 弹出【门锁开锁密码申请】弹窗；
   - **展示项**：设备名称、设备编码、所属仓库/库房、当前审批人姓名；
   - **输入项**：
     - **开锁事由**（下拉单选，必填）：出库、入库、移库、盘点、巡检、参观、其他；
     - **申请备注**（多行文本，选填，最多100字）；
   - **提交交互**：点击【提交申请】后关闭弹窗，Toast 提示：*“申请已提交，等待审批人[XXX]审批，通过后密码将以短信形式下发”*。

---

### 3.3 审批中心 - 开锁申请审批模块

**页面位置**：工作台【我的待办】/【审批管理】及移动端 H5 待办列表

#### 1. 审批人审核与密码下发处理流程图

```mermaid
flowchart TD
    notify["审批人收到待办消息通知 / 登录系统进入【我的待办】"] --> open_detail["点击进入开锁申请审批详情页"]
    open_detail --> review_info["审阅单据信息: 申请人/手机号、库房/设备、事由与备注"]
    review_info --> decision{"审批决策"}
    
    %% 驳回流程
    decision -->|"驳回"| click_reject["点击【驳回】按钮"]
    click_reject --> open_reject_modal["弹出驳回原因填写弹窗"]
    open_reject_modal --> input_reject_reason["必填驳回原因 (最多200字)"]
    input_reject_reason --> confirm_reject["点击【确认驳回】"]
    confirm_reject --> api_reject["调用服务端驳回接口"]
    api_reject --> update_reject["单据流转为【已驳回】<br/>释放设备防重锁"]
    update_reject --> push_reject_msg["系统向申请人推送驳回通知"]
    push_reject_msg --> finish_reject(["流程结束"])
    
    %% 通过流程
    decision -->|"通过"| click_pass["点击【通过】按钮"]
    click_pass --> open_confirm_modal["弹出二次确认对话框: 确认审批通过并下发门锁密码至申请人手机?"]
    open_confirm_modal --> confirm_pass["点击【确认通过】"]
    confirm_pass --> api_pass["调用服务端通过审批接口"]
    
    api_pass --> backend_validate{"服务端原子校验: 设备是否在用且未过期?"}
    backend_validate -->|"设备异常/已解绑"| abort_invalid["提示: 设备状态异常，单据已自动失效"]
    abort_invalid --> finish_reject
    
    backend_validate -->|"校验正常"| exec_tx["开启原子事务:<br/>1. 单据状态置为【已通过】<br/>2. 计算有效起止期: 当前时刻起3天<br/>3. 调用密码网关生成动态密码"]
    
    exec_tx --> call_sms["调用短信网关发送密码至申请人手机"]
    call_sms --> check_sms_res{"短信网关投递结果"}
    
    check_sms_res -->|"发送成功"| record_log["记录全链路审计日志: 审批人/时间/单号/IP"]
    record_log --> show_pass_toast["审批端提示: 审批已通过，密码已下发申请人"]
    show_pass_toast --> push_applicant_notify["向申请人发送审批通过消息通知"]
    push_applicant_notify --> finish_pass(["审批归档完成"])
    
    check_sms_res -->|"发送失败"| mark_sms_err["单据标记为【已通过(短信失败)】"]
    mark_sms_err --> show_resend_entry["详情页展示【重发短信】按钮"]
```

#### 2. 待办详情信息展示规格
- 申请单号、发起时间、申请人姓名、申请人联系手机（脱敏展示）；
- 设备信息：设备名称、设备编码、所属仓库、所属库房；
- 申请信息：申请事由、申请备注。

#### 3. 审批操作规则
- **【通过】**：
  - 点击弹出确认提示框；
  - 确认后后端触发原子事务：生成挂锁动态密码（时效从审批通过时刻起计算 3 天）并调用短信网关发送至申请人手机；
  - 审批人端**不展示密码明文**。
- **【驳回】**：
  - 弹出驳回弹窗，**驳回原因必填**（最多200字）；
  - 确认后单据流转为“已驳回”，向申请人推送驳回通知。

---

## 4. 异常与边界处理

| 场景分类 | 异常场景 | 系统处置与提示 |
| :--- | :--- | :--- |
| **前置条件缺失** | 申请人账号未绑定手机号 | 提交申请前前端校验拦截，提示：*“当前账号未绑定手机号，无法接收开锁密码短信，请先前往个人中心绑定手机号”* |
| **设备状态异常** | 单据审批过程中设备被解绑或停用 | 审批人点击通过时服务端校验阻断，单据自动作废，提示：*“该设备已被解绑或停用，单据已失效”* |
| **配置变更** | 申请提交后，库房配置修改了审批人 | 保持**快照机制**，当前单据仍由发起时刻指定的审批人处理；若人员被禁用，由管理员进行单据转派 |
| **短信发送异常** | 审批通过后短信网关返回发送失败 | 单据标记为“已通过(短信失败)”，并在详情页向审批人/申请人提供【重发短信】操作 |
| **超时未审批** | 单据超过24小时未完成审核 | 自动流转为“已失效”，释放当前设备的申请防重锁 |

---

## 5. 权限与安全审计

### 5.1 RBAC 权限矩阵

| 功能点 / 操作 | 仓库操作员 | 库管主管 / 风控员 | 仓库管理员 | 系统超级管理员 |
| :--- | :---: | :---: | :---: | :---: |
| 库房开锁审批配置 | ❌ | ❌ | ✅ | ✅ |
| 发起开锁申请 / 获取密码 | ✅ | ✅ | ✅ | ✅ |
| 开锁申请审批 (通过/驳回) | ❌ | ✅ | ✅ | ✅ |
| 审批历史与审计日志查看 | 仅查看自己 | 范围内查看 | 仓库内查看 | 全局查看 |

### 5.2 安全审计规范
- **敏感信息脱敏**：数据库、申请单表、系统操作审计日志中**严禁明文存储动态密码与短信内容**。
- **审计留痕要素**：全流程记录 `单据号`、`操作人ID/姓名`、`操作动作(发起/审批/重发)`、`操作时间`、`终端IP`、`设备编码`、`库房标识`、`短信发送状态码`。
