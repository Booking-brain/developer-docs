---
id: quick-start
title: Quick Start
description: Make your first Booking Brain API call in under a minute with the public sandbox key. No sign-up required.
sidebar_position: 2
keywords: [quick start, getting started, first API call, sandbox key, curl, tutorial]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start

Go from zero to your first API response in under a minute. No sign-up, no account creation -- just a cURL command and the public sandbox key.

:::info What you'll learn
By the end of this guide you will be able to:
- Search for holiday properties by location and guest count
- Retrieve full property details including images and amenities
- Check date availability for a property calendar
- Calculate the total price for a stay including fees
:::

## Prerequisites

All you need is an HTTP client. The examples below use cURL, JavaScript (`fetch`), and Python (`requests`), but any language or tool works.

## Step 1: Make your first request

Search for holiday properties in Exmoor that sleep at least 4 guests:

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
curl "https://app.bookingbrain.com/api/v1/developer/search?place=exmoor&guests=4" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
const response = await fetch(
  "https://app.bookingbrain.com/api/v1/developer/search?place=exmoor&guests=4",
  {
    headers: {
      "X-API-Key": "bb_sandbox_test_key_do_not_use_in_production",
    },
  }
);

const data = await response.json();
console.log(data);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://app.bookingbrain.com/api/v1/developer/search",
    params={"place": "exmoor", "guests": 4},
    headers={"X-API-Key": "bb_sandbox_test_key_do_not_use_in_production"},
)

data = response.json()
print(data)
```

</TabItem>
</Tabs>

## Step 2: Understand the response

The search endpoint returns a paginated list of properties:

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
      "bath_rooms": 2,
      "is_pets": true,
      "status": "active",
      "min_price": 595.00,
      "price_per_night": 85.00,
      "apply_price": "nightly",
      "thumbnailUrl": "https://storage.googleapis.com/bb-property-images/properties/312/meadow-cottage-main.jpg",
      "latitude": 51.2089,
      "longitude": -3.5915,
      "search_summary": "A charming thatched cottage with stunning views across Porlock Vale to the Bristol Channel.",
      "rating": 4.7
    }
  ],
  "total_property_on_search": 74,
  "current_page": 1,
  "num_pages": 4,
  "perpage": 20
}
```

Key fields:

| Field | Description |
|---|---|
| `properties` | Array of property summaries matching your search |
| `total_property_on_search` | Total results across all pages |
| `current_page` | Current page (1-based) |
| `num_pages` | Total number of pages |
| `perpage` | Results per page (default 20, max 100) |

Each property includes the essential information for a listing card: title, location, price, guest capacity, pet-friendliness, thumbnail image, and coordinates for map display.

## Step 3: Get property details

Pick a property from the search results and fetch its full details using the `id`:

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
curl "https://app.bookingbrain.com/api/v1/developer/properties/312" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
const response = await fetch(
  "https://app.bookingbrain.com/api/v1/developer/properties/312",
  {
    headers: {
      "X-API-Key": "bb_sandbox_test_key_do_not_use_in_production",
    },
  }
);

const { data: property } = await response.json();
console.log(property.title);       // "Meadow Cottage"
console.log(property.description);  // Full editorial description
console.log(property.bed_rooms);    // 3
console.log(property.checkin);      // "16:00"
```

</TabItem>
<TabItem value="python" label="Python">

```python
response = requests.get(
    "https://app.bookingbrain.com/api/v1/developer/properties/312",
    headers={"X-API-Key": "bb_sandbox_test_key_do_not_use_in_production"},
)

property = response.json()["data"]
print(property["title"])        # "Meadow Cottage"
print(property["description"])  # Full editorial description
print(property["bed_rooms"])    # 3
```

</TabItem>
</Tabs>

The property detail response includes everything you need for a full listing page: description, amenities, location details, pricing, check-in/check-out times, house rules, WiFi speeds, parking, EV charging, nearby attractions, and more.

## Step 4: Check availability

Before a guest can book, check which dates are unavailable:

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
curl "https://app.bookingbrain.com/api/v1/developer/properties/312/unavailableDates?year=2026&month=7" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production"
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
const response = await fetch(
  "https://app.bookingbrain.com/api/v1/developer/properties/312/unavailableDates?year=2026&month=7",
  {
    headers: {
      "X-API-Key": "bb_sandbox_test_key_do_not_use_in_production",
    },
  }
);

const unavailableDates = await response.json();
// ["2026-07-05", "2026-07-06", "2026-07-07", ...]
```

</TabItem>
<TabItem value="python" label="Python">

```python
response = requests.get(
    "https://app.bookingbrain.com/api/v1/developer/properties/312/unavailableDates",
    params={"year": "2026", "month": "7"},
    headers={"X-API-Key": "bb_sandbox_test_key_do_not_use_in_production"},
)

unavailable_dates = response.json()
# ["2026-07-05", "2026-07-06", "2026-07-07", ...]
```

</TabItem>
</Tabs>

The response is a flat array of date strings (`YYYY-MM-DD`) that are booked or blocked. Use these to grey out dates in your calendar widget.

## Step 5: Calculate the price

Once the guest has selected dates, calculate the exact price:

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://app.bookingbrain.com/api/v1/developer/properties/312/get-price" \
  -H "X-API-Key: bb_sandbox_test_key_do_not_use_in_production" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2026-07-04",
    "num_nights": 7,
    "num_guests": 4
  }'
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
const response = await fetch(
  "https://app.bookingbrain.com/api/v1/developer/properties/312/get-price",
  {
    method: "POST",
    headers: {
      "X-API-Key": "bb_sandbox_test_key_do_not_use_in_production",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_date: "2026-07-04",
      num_nights: 7,
      num_guests: 4,
    }),
  }
);

const pricing = await response.json();
console.log(pricing.response);          // 0 = available
console.log(pricing.final_total_price); // 925.00
console.log(pricing.cleaning_fee);      // 45.00
```

</TabItem>
<TabItem value="python" label="Python">

```python
response = requests.post(
    "https://app.bookingbrain.com/api/v1/developer/properties/312/get-price",
    json={
        "start_date": "2026-07-04",
        "num_nights": 7,
        "num_guests": 4,
    },
    headers={"X-API-Key": "bb_sandbox_test_key_do_not_use_in_production"},
)

pricing = response.json()
print(pricing["response"])          # 0 = available
print(pricing["final_total_price"]) # 925.00
```

</TabItem>
</Tabs>

The price response tells you:

| Field | Description |
|---|---|
| `response` | `0` = available. Non-zero means there is a conflict (see [Booking Flow](/docs/booking-flow)) |
| `price` | Accommodation charge before fees |
| `cleaning_fee` | Cleaning fee (if applicable) |
| `service_fee` | Service fee (if applicable) |
| `final_total_price` | Total the guest pays, including all fees and discounts |
| `security_deposit` | Refundable security deposit |
| `discount` | Discount details if a promotional rate applies |

## Next steps

You have now completed the read-only portion of the API. From here:

- **[Booking Flow Guide](/docs/booking-flow)** -- Continue the journey: create a booking and process payment
- **[Authentication](/docs/authentication)** -- Understand production keys, IP whitelisting, and security
- **[Error Handling](/docs/errors)** -- Handle errors and rate limits gracefully
- **[AI Integration](/docs/guides/ai-integration)** -- Use the API with AI function calling
- **[API Reference](/docs/api/booking-brain-developer-api)** -- Full documentation for all 22 endpoints
