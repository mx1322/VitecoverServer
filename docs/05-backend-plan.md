# Backend Plan Description

## Backend role

The backend is the operational core of the insurance platform.

It must support:

- customer account linkage
- vehicle and driver data management
- product and pricing definition
- quote creation
- order lifecycle
- payment tracking
- admin review
- policy issuance
- PDF delivery
- refund control

## Current backend foundation

The backend currently uses Directus as the main application and schema management layer.

The current functional backbone includes these business collections:

- `customers`
- `drivers`
- `vehicles`
- `insurance_products`
- `geo_zones`
- `pricing_rules`
- `quotes`
- `orders`
- `payments`
- `admin_reviews`
- `policies`
- `refunds`

It also relies on Directus system collections such as:

- `directus_users`
- `directus_files`

## Core collection responsibilities

### `customers`

Represents the business customer profile.
Supports both individuals and professional customers.
Can link business identity to a Directus user account.

### `drivers`

Stores driver information associated with a customer.
Used in pricing, order creation, and policy issuance.

### `vehicles`

Stores insured vehicle information associated with a customer.
Supports multiple vehicle categories including cars, trailers, heavy trucks, and buses.

### `insurance_products`

Defines which products can be sold.
Supports product grouping and later expansion into additional product lines.

### `geo_zones`

Defines pricing geography such as mainland France, overseas areas, and nearby European scenarios.

### `pricing_rules`

Stores the pricing logic by product, zone, customer type, vehicle type, duration, and fiscal power range.

### `quotes`

Stores the generated quote state before purchase.
Acts as the transition point between pricing and ordering.

### `orders`

Represents the actual purchase order entering payment and review workflow.

### `payments`

Tracks payment records and payment provider references.

### `admin_reviews`

Stores manual review decisions and review trail.

### `policies`

Represents issued insurance policies and links to the final PDF file.

### `refunds`

Tracks refund requests, refund eligibility, and resolution outcome.

## Main relationship model

The main relationship logic is:

- one `customer` can own many `vehicles`
- one `customer` can own many `drivers`
- one `insurance_product` can have many `pricing_rules`
- one `geo_zone` can have many `pricing_rules`
- one `customer` can have many `quotes`
- one `quote` references one `vehicle`, one `driver`, one `product`, and one `geo_zone`
- one `quote` can be converted into one `order`
- one `order` can have many `payments`
- one `order` can have many `admin_reviews`
- one `order` can produce one `policy`
- one `order` can have many `refunds`
- one `policy` can also be linked to refund records

## Schema workflow

The backend schema is maintained through JSON snapshot files:

- `schema-target.json`
- `schema-remote-baseline.json`

This allows the project to:

- evolve schema locally
- compare intended changes against the server
- apply controlled schema updates
- keep schema history in Git

## Operational reasoning

This backend design is suitable for the current product because it separates the major operational stages:

- pricing
- ordering
- payment
- manual review
- policy issuance
- refund handling

That separation is important for an insurance business because payment success alone is not the end of the process.

## Future backend expansion

The backend should later expand into:

- payment provider integration logic
- document generation flow
- more explicit state transitions
- richer admin tooling
- VTC and taxi product families
- more advanced pricing and underwriting rules
