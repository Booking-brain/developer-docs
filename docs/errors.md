---
id: errors
title: Error Handling
description: HTTP status codes, error response format, rate limiting, and strategies for building resilient Booking Brain API integrations.
sidebar_position: 4
keywords: [error handling, HTTP status codes, rate limiting, error response, 429, retry, error codes]
---

# Error Handling

The Booking Brain API uses standard HTTP status codes and returns consistent error objects across all endpoints. This page covers the error format, common error codes, rate limiting, and strategies for building resilient integrations.

## Error response format

All errors return a JSON object with the following shape:

```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

| Field | Type | Description |
|---|---|---|
| `statusCode` | `integer` | HTTP status code |
| `message` | `string` or `string[]` | Human-readable error description. For validation errors (422), this is an array of specific error messages. |
| `error` | `string` | Short error label matching the HTTP status text |

### Validation errors (422)

When request validation fails, `message` is an array of human-readable strings describing each issue:

```json
{
  "statusCode": 422,
  "message": [
    "start_date must be a valid date in YYYY-MM-DD format",
    "num_nights must be a positive integer"
  ],
  "error": "Unprocessable Entity"
}
```

Always check whether `message` is a string or an array when parsing errors.

## HTTP status codes

### Success codes

| Code | Meaning | When you'll see it |
|---|---|---|
| `200 OK` | Request succeeded | All successful responses |

### Client error codes

| Code | Meaning | When you'll see it |
|---|---|---|
| `400 Bad Request` | Malformed request body | Invalid JSON, wrong content type |
| `403 Forbidden` | Authentication failed | Invalid API key, IP not whitelisted, origin not allowed |
| `404 Not Found` | Resource does not exist | Property ID or place slug not found |
| `422 Unprocessable Entity` | Validation failed | Missing required fields, invalid field values |
| `429 Too Many Requests` | Rate limit exceeded | Too many requests in the current window |

### Server error codes

| Code | Meaning | When you'll see it |
|---|---|---|
| `500 Internal Server Error` | Unexpected server error | Something went wrong on our end |

## Rate limiting

Each API key has a configurable per-minute rate limit. When you exceed it, the API returns `429 Too Many Requests`.

### Rate limit headers

Every response includes rate limit headers so you can track your usage:

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Maximum requests allowed per minute |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Reset` | Unix timestamp (seconds) when the rate limit window resets |

### Rate limit error response

When you hit the limit, the response includes a `retryAfter` field:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1711036800
Retry-After: 45

{
  "statusCode": 429,
  "message": "Too Many Requests",
  "retryAfter": 45
}
```

| Field | Type | Description |
|---|---|---|
| `statusCode` | `integer` | Always `429` |
| `message` | `string` | `"Too Many Requests"` |
| `retryAfter` | `integer` | Seconds to wait before retrying |

### Handling rate limits

The recommended approach is exponential backoff with jitter:

```javascript
async function callWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);

    if (response.status !== 429) {
      return response;
    }

    if (attempt === maxRetries) {
      throw new Error("Rate limit exceeded after maximum retries");
    }

    // Use Retry-After header if available, otherwise exponential backoff
    const retryAfter = response.headers.get("Retry-After");
    const waitSeconds = retryAfter
      ? parseInt(retryAfter, 10)
      : Math.pow(2, attempt) + Math.random();

    console.log(`Rate limited. Retrying in ${waitSeconds.toFixed(1)}s...`);
    await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
  }
}
```

```python
import time
import random
import requests

def call_with_retry(url, headers, max_retries=3, **kwargs):
    for attempt in range(max_retries + 1):
        response = requests.get(url, headers=headers, **kwargs)

        if response.status_code != 429:
            return response

        if attempt == max_retries:
            raise Exception("Rate limit exceeded after maximum retries")

        # Use retryAfter from response body, or exponential backoff
        body = response.json()
        wait_seconds = body.get("retryAfter", 2 ** attempt + random.random())

        print(f"Rate limited. Retrying in {wait_seconds:.1f}s...")
        time.sleep(wait_seconds)
```

### Rate limit best practices

1. **Monitor the headers.** Check `X-RateLimit-Remaining` proactively and slow down before hitting zero.
2. **Cache responses.** Property details, images, and place data change infrequently. Cache them locally to reduce API calls.
3. **Batch wisely.** If you need data for multiple properties, spread requests over time rather than firing them all at once.
4. **Use the sandbox for development.** Do not test rate limit behaviour against production keys.

## Error handling patterns

### JavaScript

```javascript
const API_KEY = process.env.BOOKINGBRAIN_API_KEY;
const BASE_URL = "https://app.bookingbrain.com/api/v1/developer";

async function searchProperties(params) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/search?${query}`, {
    headers: { "X-API-Key": API_KEY },
  });

  if (!response.ok) {
    const error = await response.json();

    switch (response.status) {
      case 403:
        throw new Error("Authentication failed. Check your API key.");
      case 404:
        throw new Error("Resource not found.");
      case 422:
        // message may be an array for validation errors
        const messages = Array.isArray(error.message)
          ? error.message.join(", ")
          : error.message;
        throw new Error(`Validation failed: ${messages}`);
      case 429:
        throw new Error(
          `Rate limit exceeded. Retry after ${error.retryAfter} seconds.`
        );
      default:
        throw new Error(`API error ${error.statusCode}: ${error.message}`);
    }
  }

  return response.json();
}
```

### Python

```python
import os
import requests

API_KEY = os.environ["BOOKINGBRAIN_API_KEY"]
BASE_URL = "https://app.bookingbrain.com/api/v1/developer"


class BookingBrainError(Exception):
    def __init__(self, status_code, message, error=None):
        self.status_code = status_code
        self.message = message
        self.error = error
        super().__init__(f"[{status_code}] {message}")


def search_properties(params):
    response = requests.get(
        f"{BASE_URL}/search",
        params=params,
        headers={"X-API-Key": API_KEY},
    )

    if not response.ok:
        body = response.json()
        message = body.get("message", "Unknown error")

        # Handle validation errors where message is an array
        if isinstance(message, list):
            message = "; ".join(message)

        raise BookingBrainError(
            status_code=response.status_code,
            message=message,
            error=body.get("error"),
        )

    return response.json()
```

## Idempotency

The booking and payment endpoints do not have built-in idempotency keys. To avoid duplicate bookings:

1. **Check before you create.** After calling `createBooking`, store the returned `booking_id`. If a network error occurs and you are unsure whether the booking was created, do not blindly retry.
2. **Deduplicate on your side.** Use a unique reference in your system (e.g., a session ID or cart ID) and check against it before submitting a booking.
3. **Payment safeguards.** The `processPayment` endpoint is tied to a specific `booking_id`. Attempting to pay for an already-paid booking will return an error rather than double-charging.

## Next steps

- [Authentication](/docs/authentication) -- Understand API keys and security
- [Booking Flow](/docs/booking-flow) -- End-to-end integration guide
- [API Reference](/docs/api/booking-brain-developer-api) -- Full endpoint documentation
