---
id: intro
title: Introduction
description: Complete REST API documentation for Booking Brain — property search, availability, pricing, booking, and payment processing.
sidebar_position: 1
keywords: [Booking Brain API, REST API, property search, availability, booking, payment, developer documentation]
slug: /intro
---

# Booking Brain Developer API

The Booking Brain Developer API gives you full programmatic access to holiday rental property search, availability, pricing, booking, and payment processing. Everything you need to build a custom booking experience on top of the Booking Brain platform.

## What is Booking Brain?

Booking Brain is a holiday property management platform used by property owners and letting agencies to manage their rental portfolios. The platform handles property listings, availability calendars, pricing rules, guest bookings, payment processing, and guest reviews.

The Developer API opens all of this up to you. Instead of using the default Booking Brain website, you can build your own frontend -- a bespoke website, a mobile app, a chatbot, or an AI agent -- and let Booking Brain handle the backend.

## What can you build?

| Use case | Endpoints you'll need |
|---|---|
| **Custom property website** | Search, Property Details, Images, Availability, Pricing |
| **Booking widget** | Availability, Pricing, Booking, Payment |
| **Destination landing page** | Places, Search, Property Details |
| **AI booking assistant** | All endpoints via function calling |
| **Price comparison feed** | Search, Pricing, Special Offers |
| **Availability calendar** | Unavailable Dates, Start Days, Start Dates, Short Breaks |
| **Mobile app** | Full API surface |

## API at a glance

| | |
|---|---|
| **Base URL** | `https://app.bookingbrain.com/api/v1/developer` |
| **Authentication** | `X-API-Key` header |
| **Format** | JSON |
| **Versioning** | URL-based (`/api/v1`) |
| **Rate limiting** | Per-minute, per-client |
| **Endpoints** | 22 across 7 groups |

### Endpoint groups

- **Property Search** -- Search properties by location, dates, guests, and amenities. Browse special offers.
- **Property Details** -- Full property information including images, reviews, extras, bedrooms, and owner contact.
- **Availability & Pricing** -- Check calendar availability, valid start days, short break rules, and calculate accurate pricing.
- **Booking** -- Submit bookings and validate discount vouchers.
- **Payment** -- Process card payments via the SagePay/Opayo gateway.
- **Places** -- Browse destination areas and retrieve properties by location.
- **Usage** -- Monitor your API consumption with usage statistics and detailed request logs.

## Quick example

Search for pet-friendly cottages in Exmoor:

```bash
curl "https://app.bookingbrain.com/api/v1/developer/search?place=exmoor&guests=4&pets=yes" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

```json
{
  "properties": [
    {
      "id": 312,
      "title": "Meadow Cottage",
      "slug": "meadow-cottage",
      "property_place_slug": "porlock",
      "bed_rooms": 3,
      "total_guest": 6,
      "is_pets": true,
      "min_price": 595.00,
      "rating": 4.7,
      "thumbnailUrl": "https://storage.googleapis.com/bb-property-images/properties/312/meadow-cottage-main.jpg",
      "search_summary": "A charming thatched cottage with stunning views across Porlock Vale to the Bristol Channel."
    }
  ],
  "total_property_on_search": 74,
  "current_page": 1,
  "num_pages": 4,
  "perpage": 20
}
```

## Typical booking flow

The API is designed around a natural booking journey:

```
Search --> Select property --> Check availability --> Calculate price --> Book --> Pay
```

1. **Search** -- `GET /developer/search` to find properties matching the guest's criteria
2. **Detail** -- `GET /developer/properties/{id}` to load the full listing
3. **Availability** -- `GET /developer/properties/{id}/unavailableDates` to show which dates are free
4. **Price** -- `POST /developer/properties/{id}/get-price` to calculate the exact cost
5. **Book** -- `POST /developer/bookings/save` to create the reservation
6. **Pay** -- `POST /developer/bookings/processPayment` to charge the guest's card

See the [Booking Flow Guide](/booking-flow) for a complete walkthrough with code examples.

## Who is this for?

- **Web agencies** building custom property websites for holiday letting businesses
- **Property owners** who want a bespoke booking experience on their own domain
- **AI developers** building booking assistants, chatbots, or automated agents
- **Aggregators** pulling property data into comparison or marketplace platforms

## Sandbox access

You can start making API calls right now with the public sandbox key:

```
bb_sandbox_test_key_do_not_use_in_production
```

The sandbox key returns real property data (search results, property details, images, availability, pricing) but will not create actual bookings or process real payments. It is rate-limited and intended for development and testing only.

No sign-up required. Just add the `X-API-Key` header to your requests and go.

## Next steps

- [Quick Start](/quick-start) -- Make your first API call in under a minute
- [Authentication](/authentication) -- Understand API keys, sandbox vs production, and security
- [Error Handling](/errors) -- Learn the error format and how to handle rate limits
- [Booking Flow](/booking-flow) -- End-to-end integration guide with full code examples
- [AI Integration](/guides/ai-integration) -- Build AI agents that can search and book properties
- [API Reference](/api/booking-brain-developer-api) -- Complete endpoint documentation
