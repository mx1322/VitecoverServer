# Project Overview

## Project positioning

This project is an insurance company backend.

Its main purpose is to support the end-to-end business flow for temporary car insurance, including:

- product display and pricing support for the frontend
- customer registration and login
- Google account login
- vehicle data management
- driver data management
- insurance order creation
- payment result handling
- admin review and manual confirmation
- PDF policy delivery
- refund handling based on policy effective time

The current development model is local-first:

- develop locally with Docker and Directus
- manage and evolve schema in the local repository
- push validated schema to the server
- deploy the final backend architecture on AWS

## Core business flow

The first business module is temporary car insurance.

The target user journey is:

1. The customer visits the frontend website and checks insurance prices.
2. The customer selects an insurance product.
3. The customer logs in either with Google account authentication or with an account registered directly on the website.
4. After login, the customer either selects an existing vehicle or enters new vehicle information.
5. The customer either selects an existing driver or enters new driver information.
6. The customer provides the insurance effective time.
7. The customer enters the payment flow and completes payment.
8. After successful payment, the administrator manually reviews and confirms the submitted information.
9. When all information is confirmed, the process is completed.
10. The customer receives a PDF insurance policy document.

## Roles in the system

The system currently implies at least these roles:

- customer
  Uses the frontend, logs in, manages personal/vehicle/driver information, submits insurance orders, pays, receives policy documents, and may request refunds.
- administrator
  Reviews submitted data after payment, manually confirms the order, finalizes the policy process, and handles refund cases that are no longer eligible for automatic refund.

## Authentication model

The backend needs to support two authentication paths:

- Google account login
- native website account registration and login

This means the customer identity model should be able to represent:

- a platform-local account
- a Google-linked account
- the possibility that one customer may have multiple authentication attributes tied to the same business profile

## Main business entities

Based on the current schema direction and the described flow, the backend will likely revolve around these core entities:

- customers
  Business customer profile and account linkage
- vehicles
  Vehicle information used for quotation and policy issuance
- drivers
  Driver information linked to a customer and potentially to a policy/order
- insurance_products
  The insurance products selectable on the frontend
- quotes or pricing records
  Price calculation result shown to the customer before purchase
- orders
  The insurance purchase order created by the customer
- payments
  Payment result and payment status tracking
- admin_reviews
  Manual review records and admin decisions
- policies
  Final insurance policy records
- policy_documents
  Generated PDF policy files and related metadata
- refunds
  Refund request, refund eligibility, and refund outcome records

## Important business rules

The following rules are central to the product logic:

- The customer must authenticate before completing the insurance purchase flow.
- The customer must provide or select both vehicle information and driver information before completing the order.
- The customer must provide the insurance effective time as part of the purchase flow.
- Payment success does not automatically complete the whole process.
- After payment, an administrator must manually confirm the submitted information.
- Only after the administrator confirmation is complete is the process considered finished.
- When the process is finished, the customer receives a PDF insurance policy.
- Before the insurance effective time, the system can support automatic refund.
- After the insurance effective time, refund can no longer be automatic and must be handled manually through human support.

## Suggested lifecycle states

To support this business cleanly, the order or policy lifecycle will probably need states similar to:

- draft
- awaiting_payment
- paid
- pending_admin_review
- confirmed
- policy_issued
- active
- refund_requested
- auto_refunded
- manual_refund_required
- manually_refunded
- cancelled

The exact naming can change, but a clear state machine will be important because this business includes:

- payment completion
- manual admin intervention
- document generation
- time-based refund eligibility

## PDF policy output

One important final output of the process is the PDF insurance policy.

The backend should eventually support:

- generating or storing the PDF policy document
- linking the PDF file to the final policy record
- making the document available to the customer after confirmation
- preserving document metadata such as issue time, policy number, and file location

## Infrastructure direction

This repository is currently a backend development workspace, not yet the final cloud architecture.

The practical target direction is:

- local development with Directus, PostgreSQL, Redis, and Nginx
- remote schema synchronization from the repo to the server
- final production deployment on AWS

For AWS, the likely future shape is:

- Directus application hosted on AWS compute
- PostgreSQL hosted on RDS
- uploaded and generated documents stored on S3
- reverse proxy or load balancing in front of the application
- production secrets managed in the cloud environment

## What this means for backend design

Going forward, this backend should be treated as a business system for temporary car insurance rather than only a generic CMS setup.

That means the schema and backend logic should be designed around:

- customer identity and authentication linkage
- reusable customer vehicle and driver records
- product selection and pricing
- order creation and payment status
- admin review workflow
- policy issuance
- PDF document delivery
- refund rules based on insurance effective time
