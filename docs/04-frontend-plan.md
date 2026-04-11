# Frontend Plan Description

## Frontend role

The frontend is not only a marketing website.
It is the customer-facing layer of the insurance purchase workflow.

It should support both:

- public-facing presentation and pricing discovery
- authenticated insurance purchase and policy access

## Recommended frontend scope

The frontend should eventually include:

- home page
- product explanation pages
- quote entry flow
- login and registration
- Google login
- customer account area
- vehicle management screens
- driver management screens
- checkout and payment screens
- order status pages
- policy download pages
- refund request pages

## Recommended implementation strategy

Use a modern React-based application inside `frontend/` and keep it in the same repository as the backend for now.

At this stage, the best practical approach is:

- use a template only as a visual starting point if needed
- build the insurance workflow pages intentionally from scratch

This is important because:

- marketing pages can reuse generic patterns
- insurance quote and checkout flows are highly specific to the business
- core purchase flow should remain fully under your control

## Page groups

### Public pages

- homepage
- product overview
- pricing explanation
- FAQ
- contact

### Account and onboarding pages

- sign up
- sign in
- Google login callback
- forgot password

### Customer workflow pages

- quote start page
- product selection
- vehicle selection or creation
- driver selection or creation
- coverage timing selection
- quote summary
- payment
- post-payment waiting or review state
- policy download
- refund request

### Admin-facing pages

An admin portal may be partly handled through Directus at first, but eventually the project may also want custom admin-facing workflow screens for:

- review queues
- order detail review
- refund review
- policy issuance monitoring

## Data dependencies

The frontend depends on the backend model for:

- customer profiles
- vehicles
- drivers
- insurance products
- geo zones
- pricing rules
- quotes
- orders
- policies
- refunds

This is why keeping frontend and backend in the same repository still makes sense at the current phase.

## UX priorities

The most important frontend priorities should be:

- clear product selection
- low-friction quote flow
- trustworthy pricing presentation
- simple account creation and login
- strong visibility into policy status
- clear refund rules

For this product, reducing confusion in the insurance journey is more important than building a flashy website.
