---
id: booking-flow
title: Booking Flow
description: Step-by-step guide to the complete booking journey — from property search to payment processing with full code examples.
sidebar_position: 5
keywords: [booking flow, checkout, payment processing, availability, pricing, integration guide, code examples]
---

# Complete Booking Flow

:::info What you'll learn
By the end of this guide you will be able to:
- Search and filter properties by location, dates, and guest criteria
- Build an availability calendar with start days and short break rules
- Calculate accurate pricing including fees and discounts
- Create a booking and collect guest details
- Process card payments with 3D Secure support
:::

This guide walks through the entire booking journey from property search to payment, with full code examples.

## Overview

The Booking Brain booking flow follows six steps:

import BookingFlowDiagram from '@site/src/components/BookingFlowDiagram';

<BookingFlowDiagram />

Each step builds on the previous one. Let's walk through them.

## Setup

All examples use JavaScript with `fetch`. The same flow applies to any language.

```javascript
const API_KEY = "bb_sandbox_test_key_do_not_use_in_production";
const BASE_URL = "https://app.bookingbrain.com/api/v1/developer";

async function api(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API error ${error.statusCode}: ${error.message}`);
  }

  return response.json();
}
```

## Step 1: Search for properties

Start by searching for properties that match the guest's criteria. The search endpoint supports filtering by location, dates, guest count, bedrooms, pet-friendliness, and sorting.

```javascript
// Guest wants: Exmoor, 4 guests, 7 nights from July 4th, pet-friendly
const searchResults = await api(
  "/search?place=exmoor&checkin=2026-07-04&nights=7&guests=4&pets=yes&sort=price"
);

console.log(`Found ${searchResults.total_property_on_search} properties`);

// Display results to the guest
for (const property of searchResults.properties) {
  console.log(`${property.title} - from £${property.min_price}/week`);
  console.log(`  ${property.bed_rooms} bedrooms, sleeps ${property.total_guest}`);
  console.log(`  ${property.search_summary}`);
  console.log(`  Image: ${property.thumbnailUrl}`);
}
```

**Pagination:** Use `page` and `limit` to navigate large result sets:

```javascript
// Page 2, 10 results per page
const page2 = await api("/search?place=exmoor&page=2&limit=10");
```

## Step 2: Load property details

When the guest selects a property, fetch the full details:

```javascript
const propertyId = 312; // from search results

// Full property details
const { data: property } = await api(`/properties/${propertyId}`);

// Property images for the gallery
const { data: images } = await api(`/properties/${propertyId}/images`);

// Guest reviews for social proof
const reviews = await api(`/properties/${propertyId}/reviews?limit=5`);

// Bookable extras (dogs, cots, etc.)
const extras = await api(`/properties/${propertyId}/extras`);

// Bedroom configuration
const bedrooms = await api(`/properties/${propertyId}/bedrooms`);

console.log(property.title);          // "Meadow Cottage"
console.log(property.description);     // Full editorial description
console.log(property.checkin);         // "16:00"
console.log(property.checkout);        // "10:00"
console.log(property.house_rules);     // "No smoking. Maximum 2 well-behaved dogs..."
console.log(property.wifi_download_speed); // 48.5 (Mbps)
```

:::tip Slug-based lookup
If you are building SEO-friendly URLs, you can also look up properties by slug:

```javascript
const { data: property } = await api("/porlock/meadow-cottage");
```

This uses the `getPropertyBySlug` endpoint with the place slug and property slug.
:::

## Step 3: Check availability

Build an availability calendar by combining three data sources:

### 3a. Unavailable dates

Fetch dates that are booked or blocked:

```javascript
const unavailable = await api(
  `/properties/${propertyId}/unavailableDates?year=2026&month=7`
);
// ["2026-07-05", "2026-07-06", "2026-07-07", ...]
```

Grey these out in your datepicker.

### 3b. Valid start days

Some properties only allow check-in on certain days of the week:

```javascript
const startDays = await api(`/properties/${propertyId}/startDays`);
// { monday: false, tuesday: false, ..., friday: true, saturday: true, sunday: false }
```

Disable non-start days in your datepicker.

### 3c. Available start dates

For a more precise calendar, fetch the actual available check-in dates:

```javascript
const { data: startDates } = await api(
  `/properties/${propertyId}/start-dates?months=3`
);
// ["2026-07-04", "2026-07-11", "2026-07-18", ...]
```

### 3d. Short break rules

Check whether short stays are available:

```javascript
const shortBreaks = await api(`/properties/${propertyId}/shortBreaks`);
// { short_breaks_enabled: true, min_nights: 3, ... }
```

### 3e. Available nights from a date

Once the guest selects a check-in date, find out which durations are available:

```javascript
const availableNights = await api(`/properties/${propertyId}/available-nights`, {
  method: "POST",
  body: JSON.stringify({ checkin_date: "2026-07-04" }),
});
// [3, 4, 7, 10, 14]
```

Use this to populate a "number of nights" dropdown.

## Step 4: Calculate the price

With check-in date and number of nights selected, calculate the exact price:

```javascript
const pricing = await api(`/properties/${propertyId}/get-price`, {
  method: "POST",
  body: JSON.stringify({
    start_date: "2026-07-04",
    num_nights: 7,
    num_guests: 4,
  }),
});
```

### Check the response code

The `response` field indicates availability:

| Code | Meaning |
|---|---|
| `0` | Available -- proceed to booking |
| `1` | Booking conflict -- dates overlap with an existing booking |
| `2` | Dates unavailable -- blocked by the property owner |
| `3` | Too many guests -- exceeds the property's capacity |
| `4` | Date in the past -- check-in date has already passed |

```javascript
if (pricing.response !== 0) {
  // Dates are not available -- show error to guest
  console.error("Selected dates are not available");
  return;
}

// Display pricing breakdown
console.log(`Accommodation: £${pricing.price}`);
console.log(`Cleaning fee:  £${pricing.cleaning_fee}`);
console.log(`Service fee:   £${pricing.service_fee}`);
console.log(`Total:         £${pricing.final_total_price}`);
console.log(`Deposit:       £${pricing.security_deposit} (refundable)`);

if (pricing.discount?.type !== "no") {
  console.log(`Discount:      ${pricing.applicable_discount}`);
}
```

## Step 4b: Validate a voucher (optional)

If the guest has a promo code, validate it before creating the booking:

```javascript
const voucherResult = await api("/bookings/validate-voucher", {
  method: "POST",
  body: JSON.stringify({
    voucher_code: "SUMMER20",
    property_id: propertyId,
    num_nights: 7,
    checkin_date: "2026-07-04",
    total_price: pricing.final_total_price,
    guest_email: "sarah.thompson@example.co.uk",
  }),
});

if (voucherResult.valid) {
  console.log(`Voucher applied: ${voucherResult.message}`);
  console.log(`Original price: £${voucherResult.original_price}`);
  console.log(`New price:      £${voucherResult.discounted_price}`);

  // Use the discounted price for the booking
  const finalPrice = voucherResult.discounted_price;
} else {
  console.log(`Voucher invalid: ${voucherResult.message}`);
}
```

## Step 5: Create the booking

Submit the booking with guest details and the calculated price:

```javascript
const booking = await api("/bookings/save", {
  method: "POST",
  body: JSON.stringify({
    property_id: propertyId,
    checkin: "2026-07-04",
    checkout: "2026-07-11",
    nights: 7,
    guests: 4,
    property_charge: pricing.final_total_price,
    User: {
      first_name: "Sarah",
      last_name: "Thompson",
      email: "sarah.thompson@example.co.uk",
      phone: "+44 7700 900123",
      address: "14 Harbour View",
      city: "Bristol",
      country: "United Kingdom",
    },
  }),
});

console.log(`Booking created: #${booking.booking_id}`);
console.log(`Status: ${booking.status}`);
console.log(`Total: £${booking.total_amount} ${booking.currency}`);
```

:::warning Important
The `property_charge` field must match the `final_total_price` returned by the `calculatePrice` endpoint. Always call `get-price` immediately before creating a booking to ensure the price is current. Prices can change due to seasonal rates, promotions, and availability.
:::

### Sandbox behaviour

When using the sandbox key, `createBooking` returns a mock response with `sandbox: true` and `status: "sandbox"`. No actual booking is created in the system.

## Step 6: Process payment

After the booking is created, process the payment:

```javascript
const payment = await api("/bookings/processPayment", {
  method: "POST",
  body: JSON.stringify({
    booking_id: booking.booking_id,
    card_holder: "Sarah Thompson",
    card_number: "4929000000006",
    expiry_date: "1228",
    security_code: "123",
    amount: booking.total_amount,
    payment_type: "full", // or "deposit"
  }),
});
```

### Handle the payment result

The payment can have three outcomes:

#### Success -- payment complete

```json
{
  "success": true,
  "status": "paid",
  "transactionId": "VSP-TXN-ABC12345",
  "booking_id": 28456,
  "amount": 925.00,
  "currency": "GBP"
}
```

The booking is confirmed. Show the guest a confirmation page.

#### 3D Secure required

```json
{
  "success": true,
  "status": "3ds_required",
  "acsUrl": "https://acs.bank.co.uk/3ds/authenticate?txn=abc123",
  "cReq": "eJxVUd1ugyAU...",
  "threeDSSessionData": "abc-123-def-456",
  "booking_id": 28456
}
```

The cardholder's bank requires additional authentication. Redirect the guest to `acsUrl` with the `cReq` payload to complete 3D Secure verification.

```javascript
if (payment.status === "3ds_required") {
  // Create a form and POST to the ACS URL
  const form = document.createElement("form");
  form.method = "POST";
  form.action = payment.acsUrl;

  const creqInput = document.createElement("input");
  creqInput.type = "hidden";
  creqInput.name = "creq";
  creqInput.value = payment.cReq;
  form.appendChild(creqInput);

  const sessionInput = document.createElement("input");
  sessionInput.type = "hidden";
  sessionInput.name = "threeDSSessionData";
  sessionInput.value = payment.threeDSSessionData;
  form.appendChild(sessionInput);

  document.body.appendChild(form);
  form.submit();
}
```

#### Payment failed

```json
{
  "success": true,
  "status": "failed",
  "message": "Card declined -- insufficient funds",
  "errorCode": "2032",
  "booking_id": 28456
}
```

Display the error message to the guest and let them try a different card.

:::caution Sandbox limitations
The sandbox key cannot process payments. Calling `processPayment` with a sandbox key will return an error. To test the full payment flow, you need a production key with the SagePay test gateway configured.
:::

## Complete example

Here is the full flow in a single function:

```javascript
const API_KEY = "bb_sandbox_test_key_do_not_use_in_production";
const BASE_URL = "https://app.bookingbrain.com/api/v1/developer";

async function api(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`[${error.statusCode}] ${error.message}`);
  }
  return response.json();
}

async function bookProperty() {
  // 1. Search
  const search = await api(
    "/search?place=exmoor&checkin=2026-07-04&nights=7&guests=4&pets=yes"
  );
  const propertyId = search.properties[0].id;
  console.log(`Selected: ${search.properties[0].title} (ID: ${propertyId})`);

  // 2. Property details
  const { data: property } = await api(`/properties/${propertyId}`);
  console.log(`Check-in: ${property.checkin}, Check-out: ${property.checkout}`);

  // 3. Check availability
  const unavailable = await api(
    `/properties/${propertyId}/unavailableDates?year=2026&month=7`
  );
  console.log(`${unavailable.length} dates unavailable in July`);

  // 4. Calculate price
  const pricing = await api(`/properties/${propertyId}/get-price`, {
    method: "POST",
    body: JSON.stringify({
      start_date: "2026-07-04",
      num_nights: 7,
      num_guests: 4,
    }),
  });

  if (pricing.response !== 0) {
    throw new Error("Dates not available");
  }
  console.log(`Total: £${pricing.final_total_price}`);

  // 5. Create booking
  const booking = await api("/bookings/save", {
    method: "POST",
    body: JSON.stringify({
      property_id: propertyId,
      checkin: "2026-07-04",
      checkout: "2026-07-11",
      nights: 7,
      guests: 4,
      property_charge: pricing.final_total_price,
      User: {
        first_name: "Sarah",
        last_name: "Thompson",
        email: "sarah.thompson@example.co.uk",
        phone: "+44 7700 900123",
        address: "14 Harbour View",
        city: "Bristol",
        country: "United Kingdom",
      },
    }),
  });
  console.log(`Booking #${booking.booking_id} created`);

  // 6. Process payment (production keys only)
  const payment = await api("/bookings/processPayment", {
    method: "POST",
    body: JSON.stringify({
      booking_id: booking.booking_id,
      card_holder: "Sarah Thompson",
      card_number: "4929000000006",
      expiry_date: "1228",
      security_code: "123",
      amount: pricing.final_total_price,
      payment_type: "full",
    }),
  });

  if (payment.status === "paid") {
    console.log(`Payment complete. Transaction: ${payment.transactionId}`);
  } else if (payment.status === "3ds_required") {
    console.log("3D Secure authentication required");
    // Redirect guest to payment.acsUrl
  } else {
    console.error(`Payment failed: ${payment.message}`);
  }
}

bookProperty().catch(console.error);
```

## Special offers

You can surface promotional deals to guests using the special offers endpoints:

```javascript
// All special offers across all properties
const allOffers = await api("/properties/specialoffers");

// Special offers for a specific property
const propertyOffers = await api(`/properties/${propertyId}/specialoffers`);

for (const offer of propertyOffers) {
  console.log(
    `${offer.description}: £${offer.price} (${offer.checkin} to ${offer.checkout})`
  );
}
```

## Next steps

- [Error Handling](/errors) -- Handle errors and rate limits gracefully
- [AI Integration](/guides/ai-integration) -- Build AI agents that book properties
- [API Reference](/api/booking-brain-developer-api) -- Full endpoint documentation
