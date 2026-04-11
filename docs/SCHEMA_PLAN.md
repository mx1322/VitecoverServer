# Directus Schema Plan

## 设计目标

这一版 schema 规划的目标是：

- 第一阶段先把短期车险跑通
- 主要面向法国本地，也覆盖欧洲临近国家的短期运输场景
- 客户群体以 `pro` 为主，但兼容个人客户
- 车型需要覆盖小型乘用车、拖挂车、重型卡车、载人大巴
- 法国海外省需要特殊价格
- 后续可以平滑扩展到 `VTC`、`Taxi`、运营车辆保险和其他险种

我建议不要把模型只做成“临时写几个表先跑起来”的结构，而是做成：

- 业务主线清晰
- 报价、订单、保单、退款可以追溯
- 定价规则可配置
- 后续换产品线时不需要重做主干表

## 总体建议

建议第一阶段建立 `12` 个业务 collection，并复用 Directus 自带的两个系统 collection：

- `directus_users`
- `directus_files`

推荐的 `12` 个业务 collection：

1. `customers`
2. `vehicles`
3. `drivers`
4. `insurance_products`
5. `geo_zones`
6. `pricing_rules`
7. `quotes`
8. `orders`
9. `payments`
10. `admin_reviews`
11. `policies`
12. `refunds`

这样设计的好处是：

- 登录和业务资料分开
- 报价、订单、支付、保单、退款各自独立
- 法国本土、海外省、欧洲邻近国家可以通过区域和定价规则建模
- 以后加 `VTC`、`Taxi` 时主要是加产品和价格规则，不用推翻主干表

## 先说两个 Directus 系统 collection

### `directus_users`

这个表不要自己重复造一个登录表，直接拿来做认证账号。

用途：

- 站内注册登录
- Google 登录
- 管理员账号

建议做法：

- 把“登录账号”和“业务客户资料”分开
- `directus_users` 只负责认证身份
- `customers` 负责投保人/企业客户资料

### `directus_files`

这个表直接用来存：

- 车辆相关附件
- 审核附件
- 最终 PDF 保单

第一阶段不一定要单独做 `policy_documents` collection，因为一个保单先挂一个 PDF 文件就够了，文件本体可以直接关联 `directus_files`

## Collection 设计

### 1. `customers`

作用：

- 表示业务上的客户主体
- 既支持个人客户，也支持企业客户

建议字段：

- `id`
- `directus_user`
- `customer_type`
- `account_status`
- `email`
- `phone`
- `first_name`
- `last_name`
- `company_name`
- `legal_form`
- `siret`
- `vat_number`
- `billing_country_code`
- `billing_postcode`
- `billing_city`
- `billing_address_1`
- `billing_address_2`
- `preferred_language`
- `gdpr_consent_at`
- `marketing_consent`
- `notes`

字段说明：

- `directus_user`：关联 `directus_users`，建议做成唯一关联，等价于一对一
- `customer_type`：`individual | pro`
- `account_status`：`active | blocked | pending_verification`
- 企业客户用 `company_name / legal_form / siret`
- 个人客户用 `first_name / last_name`

关联关系：

- `customers` 对 `vehicles` 是一对多
- `customers` 对 `drivers` 是一对多
- `customers` 对 `quotes` 是一对多
- `customers` 对 `orders` 是一对多
- `customers` 对 `policies` 是一对多
- `customers` 对 `refunds` 是一对多

说明：

- 这一版先假设一个客户主体对应一个登录账号
- 如果后面企业客户需要一个公司多个登录人，再加 `customer_members` 即可

### 2. `vehicles`

作用：

- 存客户的车辆信息
- 兼容乘用车、拖挂车、重卡、大巴

建议字段：

- `id`
- `customer`
- `registration_number`
- `vin`
- `registration_country_code`
- `vehicle_category`
- `usage_type`
- `make`
- `model`
- `version_trim`
- `first_registration_date`
- `fiscal_power_cv`
- `gross_vehicle_weight_kg`
- `payload_kg`
- `axle_count`
- `seat_count`
- `empty_weight_kg`
- `insured_value`
- `is_active`
- `notes`

字段说明：

- `customer`：关联 `customers`
- `vehicle_category`：`passenger_car | trailer | heavy_truck | coach_bus`
- `usage_type`：第一阶段建议先支持 `private | commercial_transport`
- 为了兼容以后业务，字段值里预留 `vtc | taxi`
- `gross_vehicle_weight_kg / payload_kg / seat_count` 对重卡、大巴、拖挂车很重要
- `fiscal_power_cv` 对法国本地定价可能有帮助

关联关系：

- 多辆 `vehicles` 属于一个 `customer`
- `quotes` 会关联一辆 `vehicle`
- `orders` 会关联一辆 `vehicle`
- `policies` 会关联一辆 `vehicle`

### 3. `drivers`

作用：

- 存驾驶员信息

建议字段：

- `id`
- `customer`
- `first_name`
- `last_name`
- `birth_date`
- `nationality_country_code`
- `license_number`
- `license_country_code`
- `license_issue_date`
- `bonus_malus_coefficient`
- `claims_history_count`
- `phone`
- `email`
- `is_active`
- `notes`

字段说明：

- `customer`：关联 `customers`
- `license_country_code`：法国和欧洲跨境场景需要
- `bonus_malus_coefficient`：法国车险常见定价因素，建议预留

关联关系：

- 多个 `drivers` 属于一个 `customer`
- `quotes` 会关联一个主驾驶员
- `orders` 会关联一个主驾驶员
- `policies` 会关联一个主驾驶员

说明：

- 第一阶段先按“一张单一个主驾驶员”建模
- 如果后面要支持一张保单多个驾驶员，再补 M2M 关联表

### 4. `insurance_products`

作用：

- 存可销售的保险产品

建议字段：

- `id`
- `code`
- `name`
- `product_family`
- `customer_segment`
- `description`
- `min_duration_days`
- `max_duration_days`
- `supports_auto_refund_before_start`
- `requires_admin_review`
- `status`
- `terms_file`
- `wording_version`

字段说明：

- `code`：唯一编码，比如 `TEMP_AUTO_FR`
- `product_family`：建议先用 `temporary_motor`
- 后续可以扩成 `vtc_motor`、`taxi_motor`、其他险种
- `customer_segment`：`individual | pro | both`
- `terms_file`：关联 `directus_files`

关联关系：

- 一个 `insurance_product` 对多个 `pricing_rules`
- 一个 `insurance_product` 对多个 `quotes`
- 一个 `insurance_product` 对多个 `orders`
- 一个 `insurance_product` 对多个 `policies`

### 5. `geo_zones`

作用：

- 表示定价区域
- 解决法国本土、海外省、欧洲临近国家的价格差异

建议字段：

- `id`
- `code`
- `name`
- `zone_type`
- `country_code`
- `region_code`
- `is_overseas`
- `is_active`
- `notes`

建议的初始数据：

- `fr_mainland`
- `fr_overseas_gp`
- `fr_overseas_mq`
- `fr_overseas_gf`
- `fr_overseas_re`
- `fr_overseas_yt`
- `eu_near_border`

字段说明：

- `zone_type`：`fr_mainland | fr_overseas | eu`
- 如果你第一阶段不想细分每个海外省，也可以先只有两个值：
- `fr_mainland`
- `fr_overseas`

关联关系：

- 一个 `geo_zone` 对多个 `pricing_rules`
- 一个 `geo_zone` 对多个 `quotes`
- 一个 `geo_zone` 对多个 `orders`
- 一个 `geo_zone` 对多个 `policies`

### 6. `pricing_rules`

作用：

- 核心定价表
- 不要把价格写死在前端或代码里

建议字段：

- `id`
- `product`
- `geo_zone`
- `customer_type`
- `vehicle_category`
- `usage_type`
- `min_vehicle_weight_kg`
- `max_vehicle_weight_kg`
- `min_seat_count`
- `max_seat_count`
- `duration_days`
- `base_premium`
- `tax_rate`
- `tax_amount`
- `overseas_surcharge`
- `cross_border_surcharge`
- `requires_manual_quote`
- `effective_from`
- `effective_to`
- `priority`
- `is_active`
- `notes`

字段说明：

- `product`：关联 `insurance_products`
- `geo_zone`：关联 `geo_zones`
- `customer_type`：`individual | pro | both`
- `vehicle_category`：`passenger_car | trailer | heavy_truck | coach_bus`
- `usage_type`：第一阶段至少支持 `private | commercial_transport | all`
- 后续直接加入 `vtc | taxi`
- `requires_manual_quote`：对于特别复杂或超范围车辆，直接落人工报价

关联关系：

- 多条 `pricing_rules` 属于一个 `insurance_product`
- 多条 `pricing_rules` 属于一个 `geo_zone`
- 一条 `pricing_rule` 可以被多个 `quotes` 引用

说明：

- 法国海外省特殊价格，核心就是靠 `geo_zone + pricing_rules`
- 未来扩 VTC 和 Taxi，核心也是加新产品或加新 `usage_type` 规则

### 7. `quotes`

作用：

- 存用户看到并确认过的报价

建议字段：

- `id`
- `quote_number`
- `customer`
- `product`
- `vehicle`
- `primary_driver`
- `geo_zone`
- `pricing_rule`
- `status`
- `coverage_start_at`
- `coverage_end_at`
- `duration_days`
- `circulation_countries_json`
- `base_premium`
- `surcharge_amount`
- `tax_amount`
- `total_premium`
- `currency`
- `price_breakdown_json`
- `valid_until`
- `created_from_channel`

字段说明：

- `customer / product / vehicle / primary_driver / geo_zone` 都做关联
- `status`：`draft | priced | expired | converted | cancelled`
- `circulation_countries_json`：先存 ISO 国家码数组，第一阶段不用为多国单独拆表
- `price_breakdown_json`：保存当次报价拆分，方便后面审计

关联关系：

- 多个 `quotes` 属于一个 `customer`
- 多个 `quotes` 属于一个 `insurance_product`
- 多个 `quotes` 指向一个 `vehicle`
- 多个 `quotes` 指向一个 `driver`
- 多个 `quotes` 指向一个 `geo_zone`
- 多个 `quotes` 指向一个 `pricing_rule`
- 一个 `quote` 可以转成一个 `order`

### 8. `orders`

作用：

- 存真正进入支付和审核流程的投保订单

建议字段：

- `id`
- `order_number`
- `customer`
- `quote`
- `product`
- `vehicle`
- `primary_driver`
- `geo_zone`
- `status`
- `coverage_start_at`
- `coverage_end_at`
- `circulation_countries_json`
- `premium_amount`
- `tax_amount`
- `total_amount`
- `currency`
- `paid_at`
- `payment_deadline_at`
- `refund_eligibility_until`
- `admin_review_required`
- `admin_review_status`
- `customer_notes`
- `internal_notes`
- `locked_snapshot_json`

字段说明：

- `status` 建议至少有：
- `draft`
- `awaiting_payment`
- `paid`
- `pending_review`
- `approved`
- `rejected`
- `policy_issued`
- `cancelled`
- `refund_pending`
- `refunded`
- `refund_eligibility_until`：通常等于保单生效时间
- `locked_snapshot_json`：把下单时的关键车辆、驾驶员、价格信息快照锁住，避免后续用户改资料影响历史单据

关联关系：

- 多个 `orders` 属于一个 `customer`
- 多个 `orders` 来自一个 `quote`
- 多个 `orders` 关联一个 `product`
- 多个 `orders` 关联一个 `vehicle`
- 多个 `orders` 关联一个 `driver`
- 多个 `orders` 关联一个 `geo_zone`
- 一个 `order` 对多个 `payments`
- 一个 `order` 对多个 `admin_reviews`
- 一个 `order` 对一个 `policy`
- 一个 `order` 对多个 `refunds`

### 9. `payments`

作用：

- 存支付记录

建议字段：

- `id`
- `order`
- `payment_provider`
- `provider_payment_intent_id`
- `provider_charge_id`
- `amount`
- `currency`
- `status`
- `payment_method_type`
- `paid_at`
- `failure_code`
- `failure_message`
- `provider_response_json`

字段说明：

- `order`：关联 `orders`
- `status`：`pending | authorized | succeeded | failed | refunded | partially_refunded`
- 第一阶段即使只接一个支付渠道，也建议字段设计保持通用

关联关系：

- 多个 `payments` 属于一个 `order`
- 一个 `payment` 可以对应多个 `refunds`

### 10. `admin_reviews`

作用：

- 存管理员审核轨迹
- 不建议只在 `orders` 上留一个“审核通过”字段，因为后面会缺审计记录

建议字段：

- `id`
- `order`
- `policy`
- `reviewed_by`
- `review_type`
- `status`
- `checklist_json`
- `decision_reason`
- `internal_comment`
- `reviewed_at`

字段说明：

- `order`：关联 `orders`
- `policy`：可选关联 `policies`
- `reviewed_by`：关联 `directus_users`
- `review_type`：`identity | vehicle | driver | payment | final_issue`
- `status`：`pending | approved | rejected | needs_changes`

关联关系：

- 多条 `admin_reviews` 属于一个 `order`
- 多条 `admin_reviews` 可选关联一个 `policy`
- 多条 `admin_reviews` 由一个管理员用户处理

### 11. `policies`

作用：

- 存最终签发的保单

建议字段：

- `id`
- `policy_number`
- `order`
- `customer`
- `product`
- `vehicle`
- `primary_driver`
- `geo_zone`
- `status`
- `issued_at`
- `coverage_start_at`
- `coverage_end_at`
- `circulation_countries_json`
- `premium_amount`
- `tax_amount`
- `total_amount`
- `currency`
- `pdf_file`
- `pdf_generated_at`
- `document_version`
- `refund_status`
- `cancelled_at`
- `cancellation_reason`

字段说明：

- `order`：关联 `orders`，建议唯一，等价于一对一
- `pdf_file`：关联 `directus_files`
- `status`：`issued | active | expired | cancelled | refunded`
- `refund_status`：`none | eligible_auto | manual_only | processing | refunded`

关联关系：

- 一个 `policy` 来自一个 `order`
- 一个 `policy` 属于一个 `customer`
- 一个 `policy` 对应一个 `product`
- 一个 `policy` 对应一个 `vehicle`
- 一个 `policy` 对应一个 `driver`
- 一个 `policy` 对应一个 `geo_zone`
- 一个 `policy` 可以关联多个 `refunds`

### 12. `refunds`

作用：

- 单独管理退款流程
- 因为你这里有“生效前自动退款、生效后只能人工退款”的明确规则，所以退款最好单独成表

建议字段：

- `id`
- `order`
- `payment`
- `policy`
- `customer`
- `requested_by`
- `handled_by`
- `refund_type`
- `status`
- `reason`
- `requested_at`
- `eligibility_checked_at`
- `eligible_until`
- `refund_amount`
- `refund_currency`
- `provider_refund_id`
- `completed_at`
- `rejection_reason`
- `notes`

字段说明：

- `refund_type`：`automatic_before_effective | manual_after_effective`
- `status`：`requested | eligible | ineligible | processing | completed | rejected`
- `requested_by`：可关联 `directus_users`
- `handled_by`：管理员，关联 `directus_users`
- `eligible_until`：通常等于保单生效时间

关联关系：

- 多个 `refunds` 属于一个 `order`
- 多个 `refunds` 可关联一个 `payment`
- 多个 `refunds` 可关联一个 `policy`
- 多个 `refunds` 属于一个 `customer`

## 推荐的主干关系

主干关系建议如下：

- `directus_users` 1:1 `customers`
- `customers` 1:N `vehicles`
- `customers` 1:N `drivers`
- `insurance_products` 1:N `pricing_rules`
- `geo_zones` 1:N `pricing_rules`
- `customers` 1:N `quotes`
- `quotes` N:1 `vehicles`
- `quotes` N:1 `drivers`
- `quotes` N:1 `insurance_products`
- `quotes` N:1 `geo_zones`
- `quotes` N:1 `pricing_rules`
- `quotes` 1:0..1 `orders`
- `orders` 1:N `payments`
- `orders` 1:N `admin_reviews`
- `orders` 1:1 `policies`
- `orders` 1:N `refunds`
- `policies` 1:N `refunds`

## 为什么这样适合你现在的业务

### 1. 短期车险主流程能完整闭环

从报价到支付到人工审核到出 PDF 保单到退款，这一版都能覆盖。

### 2. 法国本土、海外省、周边欧洲能建模

靠这两个核心点解决：

- `geo_zones`
- `pricing_rules`

### 3. `pro` 和个人客户可以共用主干

通过 `customers.customer_type` 区分，不需要拆两套订单系统。

### 4. 多种车型可以兼容

通过 `vehicles.vehicle_category` 加不同维度字段支持：

- 小型乘用车
- 拖挂车
- 重型卡车
- 载人大巴

### 5. 以后扩 VTC / Taxi 不需要重做主结构

主要扩这几个位置：

- `insurance_products.product_family`
- `vehicles.usage_type`
- `pricing_rules.usage_type`

## 第一阶段哪些字段可以先简单一点

如果你想先把 schema 推上去、先跑通业务，以下内容可以先简化：

- `circulation_countries_json` 先用 JSON 数组，不拆多国关联表
- `price_breakdown_json` 先用 JSON，不拆报价明细子表
- `locked_snapshot_json` 先用 JSON，后续再抽快照表
- 先只支持一个主驾驶员，不建多驾驶员 M2M
- PDF 先直接挂 `policies.pdf_file`，不建文档子表

## 我建议你下一步怎么落地

如果你现在要开始在 Directus 里建 collection，我建议顺序是：

1. `customers`
2. `vehicles`
3. `drivers`
4. `insurance_products`
5. `geo_zones`
6. `pricing_rules`
7. `quotes`
8. `orders`
9. `payments`
10. `admin_reviews`
11. `policies`
12. `refunds`

这个顺序比较顺，因为：

- 先把主数据建好
- 再建报价和订单
- 最后建审核、保单、退款

## 额外建议

有两个点建议从第一天就定下来：

- 所有订单和保单都要有独立编号字段，比如 `order_number`、`policy_number`
- 所有关键业务状态都要用明确的状态字段，不要只靠布尔值

这是因为你这个项目不是普通内容站，而是保险业务后台，后面一定会遇到：

- 人工审核
- 售后退款
- PDF 出单
- 对账
- 审计追踪

这些流程如果一开始状态设计太轻，后面会很难补
