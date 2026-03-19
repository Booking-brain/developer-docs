---
id: node-sdk
title: Node.js SDK
sidebar_position: 2
---

# Node.js SDK

The official `@bookingbrain/sdk` package provides a typed client for the Booking Brain API. Zero dependencies, full TypeScript support, works with Node.js 18+.

## Installation

```bash
npm install @bookingbrain/sdk
```

## Setup

```typescript
import { BookingBrain } from "@bookingbrain/sdk";

const bb = new BookingBrain({
  apiKey: "your_api_key",
});
```

## Search properties

```typescript
const results = await bb.searchProperties({
  place: "porlock",
  checkin: "2026-07-04",
  nights: 7,
  guests: 4,
  pets: "yes",
  sort: "price",
});

for (const property of results.properties) {
  console.log(`${property.title} — £${property.min_price} — ${property.bed_rooms} bed`);
}
```

## Full booking flow

```typescript
// 1. Find a property
const results = await bb.searchProperties({ place: "exmoor", guests: 4 });
const property = results.properties[0];

// 2. Get full details
const details = await bb.getPropertyById(property.id);
console.log(details.data.description);

// 3. Check availability
const unavailable = await bb.getUnavailableDates(property.id);
const availableNights = await bb.getAvailableNights(property.id, "2026-07-04");

// 4. Calculate price
const price = await bb.calculatePrice(property.id, {
  start_date: "2026-07-04",
  num_nights: 7,
  num_guests: 4,
});

// response === 0 means available
if (price.response === 0) {
  // 5. Create booking
  const booking = await bb.createBooking({
    property_id: property.id,
    checkin: "2026-07-04",
    checkout: "2026-07-11",
    nights: 7,
    guests: 4,
    property_charge: price.final_total_price!,
    guest: {
      first_name: "Sarah",
      last_name: "Thompson",
      email: "sarah@example.co.uk",
      phone: "+44 7700 900123",
      city: "Bristol",
      country: "United Kingdom",
    },
  });

  console.log(`Booking confirmed: ${booking.booking_id}`);
}
```

## Error handling

```typescript
import { BookingBrain, BookingBrainError } from "@bookingbrain/sdk";

const bb = new BookingBrain({ apiKey: "your_api_key" });

try {
  const property = await bb.getPropertyById(999999);
} catch (err) {
  if (err instanceof BookingBrainError) {
    console.error(`${err.status}: ${err.message}`);
    // err.body contains the full API error response
  }
}
```

## All methods

Every API endpoint has a corresponding SDK method:

| Method | Description |
|---|---|
| `searchProperties(params?)` | Search properties with filters |
| `getAllSpecialOffers()` | Get all current special offers |
| `getPropertyById(id)` | Get full property details |
| `getPropertyBySlug(placeSlug, propertySlug)` | Get property by URL slug |
| `getPropertyExtras(id)` | Get extras/add-ons |
| `getPropertyReviews(id)` | Get guest reviews |
| `getPropertyImages(id)` | Get property images |
| `getPropertyBedrooms(id)` | Get bedroom config |
| `getUnavailableDates(id)` | Get booked/blocked dates |
| `getStartDays(id)` | Get valid check-in days of the week |
| `getShortBreaks(id)` | Get short break rules |
| `getStartDates(id)` | Get available start dates |
| `calculatePrice(id, params)` | Calculate stay price |
| `getAvailableNights(id, date)` | Get valid night durations |
| `createBooking(params)` | Submit a booking |
| `validateVoucher(params)` | Validate a discount code |
| `processPayment(params)` | Process card payment |
| `getAllPlaces()` | Get all destinations |
| `getPropertiesByPlace(slug)` | Get properties by location |
| `getOwnerContact(id)` | Get owner contact info |
| `getPropertySpecialOffers(id)` | Get property offers |
| `getUsageStats(params?)` | Get API usage stats |
| `getUsageLogs(params?)` | Get request logs |

## TypeScript types

All request and response types are exported:

```typescript
import type {
  SearchParams,
  SearchResult,
  PropertyDetail,
  Price,
  BookingResult,
  BookingGuest,
} from "@bookingbrain/sdk";
```

## Next steps

- [Quick Start](/docs/quick-start) -- Make your first API call
- [Booking Flow](/docs/booking-flow) -- Understand the booking sequence
- [AI Integration](/docs/guides/ai-integration) -- Connect with AI agents via MCP
- [API Reference](/docs/api/booking-brain-developer-api) -- Full endpoint docs
