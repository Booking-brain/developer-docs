---
id: test-data
title: Test Data
description: Sandbox API key, example property IDs, ready-to-use request payloads, and expected responses for testing your Booking Brain integration.
sidebar_position: 3
keywords: [test data, sandbox, testing, example requests, sample data, property IDs]
---

# Test Data

Everything you need to test your integration against the Booking Brain sandbox.

## Sandbox API key

```
bb_sandbox_test_key_do_not_use_in_production
```

Include this in every request as the `X-API-Key` header. No sign-up required.

## Base URL

```
https://app.bookingbrain.com/api/v1/developer
```

## Example property IDs

These properties have rich data suitable for testing all endpoints:

| Property ID | Name | Location | Bedrooms | Sleeps | Pets |
|---|---|---|---|---|---|
| `3818` | Coastal retreat | Porlock | 3 | 6 | Yes |
| `2095` | Country cottage | Dunster | 2 | 4 | No |
| `3659` | Farmhouse | Lynton | 4 | 8 | Yes |

:::tip
Property IDs 1-10 do not exist. Always use IDs from search results or the table above.
:::

## Example places

| Slug | Name |
|---|---|
| `porlock` | Porlock |
| `dunster` | Dunster |
| `lynton` | Lynton |
| `exmoor` | Exmoor (broad area) |

## Ready-to-use requests

### Search properties

```bash
curl "https://app.bookingbrain.com/api/v1/developer/search?place=exmoor&guests=4" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

### Get property details

```bash
curl "https://app.bookingbrain.com/api/v1/developer/properties/3818" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

### Check unavailable dates

```bash
curl "https://app.bookingbrain.com/api/v1/developer/properties/3818/unavailableDates?year=2026&month=7" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

### Calculate price

```bash
curl -X POST "https://app.bookingbrain.com/api/v1/developer/properties/3818/get-price" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production" \
  -H "Content-Type: application/json" \
  -d '{"start_date": "2026-08-01", "num_nights": 7, "num_guests": 4}'
```

### List places

```bash
curl "https://app.bookingbrain.com/api/v1/developer/places" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

### Get property images

```bash
curl "https://app.bookingbrain.com/api/v1/developer/properties/3818/images" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

### Get property reviews

```bash
curl "https://app.bookingbrain.com/api/v1/developer/properties/3818/reviews?limit=5" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

### Check usage stats

```bash
curl "https://app.bookingbrain.com/api/v1/developer/usage/stats" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

## Sandbox limitations

| Feature | Sandbox behaviour |
|---|---|
| Search, property details, images, reviews | Returns real data |
| Availability and pricing | Returns real data |
| Create booking | Returns mock response (`sandbox: true`) |
| Process payment | Blocked (returns error) |
| Rate limit | 60 requests per minute |

## Next steps

- [Quick Start](/docs/quick-start) -- Make your first API call
- [Booking Flow](/docs/booking-flow) -- End-to-end integration guide
- [Error Handling](/docs/errors) -- Handle errors and rate limits
