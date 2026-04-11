# Business Plan Description

## Project identity

VitecoverServer is the backend foundation for an insurance business platform.

The initial business focus is temporary motor insurance, mainly for the French market, while also covering short-term transport scenarios involving nearby European countries.

## Target customers

The primary target audience is:

- professional customers
- transport-related customers
- business users managing commercial vehicles

The platform must also support:

- individual customers

This means the product should support both retail and professional insurance journeys from the start.

## First product line

The first product line is short-term vehicle insurance.

The vehicle scope currently includes:

- passenger cars
- trailers
- heavy trucks
- coach or passenger buses

The pricing model must also consider:

- mainland France
- French overseas departments and territories
- nearby European circulation or transport scenarios

## Core business flow

The intended customer journey is:

1. The customer visits the website and checks available insurance pricing.
2. The customer selects an insurance product.
3. The customer logs in with Google or with a native website account.
4. The customer selects or enters vehicle information.
5. The customer selects or enters driver information.
6. The customer provides the insurance effective time.
7. The customer enters the payment flow and completes payment.
8. After payment, an administrator manually reviews the submitted data.
9. When the review is complete and approved, the process is finalized.
10. The customer receives a PDF insurance policy.

## Refund policy

The refund logic is a core business rule:

- before the policy effective time, the system should support automatic refund
- after the policy effective time, the refund must be handled manually by support or administration

This rule affects:

- order lifecycle
- payment logic
- policy status logic
- customer support flow

## Operational model

The platform is not only a brochure website.
It is an operational insurance workflow system that needs to support:

- product selection
- pricing
- account identity
- policy issuance
- manual review
- refund handling
- PDF document delivery

## Future expansion

The current short-term motor insurance flow should be designed as a base for future insurance products.

Planned or likely future product directions include:

- VTC insurance
- taxi insurance
- commercial vehicle insurance
- additional insurance categories beyond motor insurance

The platform should therefore avoid a narrow one-product-only design.
It should keep the current temporary motor flow clear while leaving room for additional product families later.
