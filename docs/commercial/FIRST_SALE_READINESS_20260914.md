# FIRST SALE READINESS — 2026-09-14

**Conclusion first:** the technical commercial tape is proven in test mode for all four priority offers. The first real customer transaction remains outstanding. Founder spend required to reach it: **$0**.

Zero-dollar court: `scripts/zero-dollar-court.mjs` · receipts `docs/receipts-external/zero-dollar-court-20260914/` (test id `zdc-20260914172646-85baa8`) · repository court `tests/zero-dollar-court.test.mjs`. Every receipt is designated `TEST / SANDBOX — NOT A REAL CUSTOMER — NO MONEY CHARGED`.

## What the court executed (same code paths production uses, synthetic inputs)

| Offer | Path exercised | Checkout | Payment event | Webhook | Intake | Order/job | Fulfillment | Delivery | Receipt |
|---|---|---|---|---|---|---|---|---|---|
| O01 Data Rescue $299 | `data-rescue` app, `STRIPE_MODE=fixture`, `MISSION_AUTHORITY=LOCAL`, isolated data dir, Founder Runtime port dead | PASS (priced order, no Stripe session) | PASS (fixture `checkout.session.completed`, HMAC-signed) | PASS (real `/api/webhooks/stripe`: bad signature 400, good 200, replay duplicate) | PASS | PASS (PAID, customer isolation 403) | PASS (parse/normalize in-process on the fixture CSV) | PASS (tokenized delivery surface, 7 artifacts) | PASS (`RECEIPT.json`, digests match every artifact, input digest = fixture) |
| O02 Opportunity Dossier $499 | `neuruh-fulfillment-contracts` `runFulfillmentE2E`, fixture Founder Runtime client, fixture worker receipt over the sample artifact | PASS (live cashier HEAD 200, not opened) | RECORDED_NOT_CONSUMED | NOT_APPLICABLE (static site, no receiver) | PASS | PASS (fixture mission, stable idempotency key) | PASS (acceptance 6/6) | PASS | PASS (sealed, verifies, replay-stable hash) |
| O05 Workflow Sprint $1,250 | same as O02, `internal_mode=BUILD` | PASS | RECORDED_NOT_CONSUMED | NOT_APPLICABLE | PASS | PASS | PASS | PASS | PASS |
| Property Opportunity Scan $100 | `neuruh-property-scan` CLI `court` → `quote` → `fulfil` on synthetic intake + frozen LandOS fixture (pin `1779abf2`) | NO_CASHIER_QUOTE_PATH (quote request written, no Stripe object) | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS (`MISSION_REQUEST` pointer, `mission_id null`, `post false`) | PASS (buyer-safe projection, redaction court) | PASS (`BUYER_REPORT.json`) | PASS (`DELIVERY_RECEIPT.json`, deterministic) |

Production untouched (recorded in `SUMMARY.json`): data-rescue repository ledger sha256 unchanged, sibling repositories `git status --porcelain` empty, neuruh.com truth signature unchanged, Stripe network never called, live Founder Runtime never called, cards charged 0, real customer records created 0, founder payment method used: no.

## Classification per offer

| Class | O01 Data Rescue | O02 Opportunity Dossier | O05 Workflow Sprint | Property Opportunity Scan |
|---|---|---|---|---|
| LIVE_AND_SELLABLE | YES (page + live cashier) | YES (page + live cashier) | YES (page + live cashier) | YES by email order and invoice (no cashier) |
| TEST_PATH_PROVEN | YES (full chain incl. webhook) | YES (intake → receipt; cashier link only) | YES (intake → receipt; cashier link only) | YES (intake → receipt; quote path) |
| CHECKOUT_LIVE | YES — Stripe payment link, HTTP 200 | YES — Stripe payment link, HTTP 200 | YES — Stripe payment link, HTTP 200 | NO — by design; contact intake + invoice |
| INTAKE_LIVE | YES — Stripe receipt email → founder emails for inputs (manual); `/contact?product=` live | same | same | YES — `/contact?product=property-opportunity-scan` → prefilled mailto |
| FULFILLMENT_MANUAL | YES — founder runs the data-rescue pipeline | YES — founder researches and writes | YES — founder builds | YES — founder runs the scan pack against LandOS/DeedSonar |
| DELIVERY_MANUAL | YES — email | YES — email | YES — email | YES — email |
| RECEIPT_PROVEN_TEST | YES — `RECEIPT.json` with digests | YES — `neuruh.fulfillment.delivery_receipt.v1`, `receipt_hash` | YES — same | YES — `neuruh.o-property-scan.delivery-receipt.v1`, deterministic |
| PAID_CUSTOMER_PROOF | **NONE** | **NONE** | **NONE** | **NONE** |

PAID_CUSTOMER_PROOF is not upgraded by anything in this lane and must not be until a real customer pays and receives a deliverable with a receipt.

## What the product pages now say (deployed after this court)

Every Top 10 product page and the index carry a four-step strip: **BUY or REQUEST → PROVIDE → WE ANALYZE → RECEIVE**, with the exact mechanism per product (hosted Stripe checkout for O01/O02/O05; email order + invoice for the $100 scan; email request + written quote for the rest). CTAs for products without a cashier read "Order … by email" / "Request …", never "Buy".

## FIRST-SALE PATH — $0 founder spend

1. **Prospect reaches a live product page** — `neuruh.com/products/top10/<slug>` (all 12 routes PROVEN_LIVE).
2. **Prospect acts** — O01/O02/O05: hosted Stripe checkout (payment collected from the customer by Stripe). Scan and everything else: `/contact?product=<slug>` → prefilled email to the founder.
3. **Founder receives the request** — Stripe's payment receipt email (cashier offers) or the prospect's email (intake offers). No webhook, no CRM; the inbox is the queue.
4. **Founder fulfils manually with existing capability** — O01: run the data-rescue pipeline on the customer files (the same `fulfillPaidOrder` path the court executed). O02: research + write the dossier against the contract's acceptance criteria. O05: build the one workflow. Scan: run the property-scan pack against LandOS/DeedSonar for the parcel (the production tape reached 10/15 steps read-only on 2026-09-14).
5. **Founder sends the deliverable** — by email, in the format the product page states.
6. **Founder records the delivery receipt** — O01 `RECEIPT.json` from the app; O02/O05 `neuruh.fulfillment.delivery_receipt.v1` via `runFulfillmentE2E` with the real artifact; scan `DELIVERY_RECEIPT.json` from `fulfil`. Vendor a public-safe attestation under `docs/receipts-external/` and move that product's ladder rungs to PROVEN_LIVE.
7. **Payment is collected from the customer** — already collected by Stripe for cashier offers before step 4; for scan and quoted offers, invoice the customer when the deliverable is scoped (or on delivery, founder's choice). The founder never pays anything.

## Known limitations (unchanged, stated on the site)

No webhook or order system on neuruh.com; fulfillment, delivery, and delivery receipts are founder-operated; no customer has paid yet; the $100 scan has no cashier; prices other than the three cashiers are test pricing.
