---
id: authentication
title: Authentication
description: Learn how API key authentication works with the Booking Brain API, including sandbox vs production keys and security best practices.
sidebar_position: 3
keywords: [API key, authentication, sandbox key, production key, security, HTTPS, X-API-Key]
---

# Authentication

Every request to the Booking Brain Developer API must include an API key. This page explains how keys work, the difference between sandbox and production, and how to keep your integration secure.

## How it works

Pass your API key in the `X-API-Key` header on every request:

```bash
curl "https://app.bookingbrain.com/api/v1/developer/search?place=exmoor" \
  -H "X-API-Key: YOUR_API_KEY"
```

```javascript
const response = await fetch(
  "https://app.bookingbrain.com/api/v1/developer/search?place=exmoor",
  {
    headers: {
      "X-API-Key": "YOUR_API_KEY",
    },
  }
);
```

```python
import requests

response = requests.get(
    "https://app.bookingbrain.com/api/v1/developer/search",
    params={"place": "exmoor"},
    headers={"X-API-Key": "YOUR_API_KEY"},
)
```

:::caution Important
Do **not** use `Authorization: Bearer` or any other authentication scheme. The API exclusively uses the `X-API-Key` header.
:::

## API key types

Booking Brain issues two types of API key:

### Sandbox key

The sandbox key is publicly available and designed for development and testing:

```
bb_sandbox_test_key_do_not_use_in_production
```

| Capability | Sandbox |
|---|---|
| Search properties | Yes -- returns real data |
| Property details, images, reviews | Yes -- returns real data |
| Availability and pricing | Yes -- returns real data |
| Create bookings | Returns mock response (no real booking created) |
| Process payments | Blocked (returns error) |
| IP whitelisting | Not required |
| Rate limit | Lower than production |

The sandbox key is ideal for:
- Exploring the API before requesting a production key
- Developing and testing your integration
- Running automated tests in CI/CD pipelines
- Building demos and prototypes

### Production key

Production keys are issued per-client by the Booking Brain team. They unlock the full API including real booking creation and payment processing.

| Capability | Production |
|---|---|
| All read endpoints | Yes |
| Create bookings | Yes -- creates real bookings |
| Process payments | Yes -- charges real cards via SagePay |
| IP whitelisting | Required (configured per key) |
| Origin restrictions | Optional (configured per key) |
| Rate limit | Higher, configurable per client |

To request a production key, contact [support@bookingbrain.co.uk](mailto:support@bookingbrain.co.uk) with:

1. Your company name and website
2. A description of your integration
3. The IP addresses that will make API calls
4. The origin domains for browser-based requests (if applicable)

## HTTPS required

All API requests must be made over HTTPS. Requests made over plain HTTP will be rejected. This ensures your API key and all request/response data are encrypted in transit.

## Base URL

All API requests use a single base URL. There is no separate sandbox server -- the sandbox key and production key hit the same endpoint:

```
https://app.bookingbrain.com/api/v1/developer
```

The API key determines the behaviour (sandbox mock responses vs real operations).

## IP whitelisting

Production API keys are locked to specific IP addresses. Requests from non-whitelisted IPs will receive a `403 Forbidden` response:

```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

To update your whitelisted IPs, contact Booking Brain support. You can register multiple IPs per key (for example, your production servers, staging environment, and CI/CD runners).

The sandbox key does not require IP whitelisting.

## Origin restrictions

For browser-based integrations (JavaScript running on your website), production keys can optionally be restricted to specific origins. This prevents your key from being used on unauthorised domains.

When configured, the API checks the `Origin` header against the allowed list. Requests from non-matching origins receive a `403 Forbidden` response.

## Authentication errors

If authentication fails, you will receive one of these responses:

### Missing API key

```http
HTTP/1.1 403 Forbidden

{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

**Cause:** The `X-API-Key` header is missing from the request.

### Invalid API key

```http
HTTP/1.1 403 Forbidden

{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

**Cause:** The API key does not match any active key in the system.

### IP not whitelisted

```http
HTTP/1.1 403 Forbidden

{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

**Cause:** The request is coming from an IP address that is not on the key's whitelist. This only applies to production keys.

### Origin not allowed

```http
HTTP/1.1 403 Forbidden

{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

**Cause:** The `Origin` header does not match the key's allowed origins. This only applies to production keys with origin restrictions configured.

:::tip Debugging 403 errors
All 403 responses look the same for security reasons -- the API does not reveal which specific check failed. If you are getting unexpected 403 errors with a production key:

1. Verify the key is correct (no trailing whitespace or newline characters)
2. Check the IP address your server is using (it may differ from your local machine)
3. Confirm your IPs are whitelisted with Booking Brain support
4. For browser requests, check the `Origin` header matches your allowed domains
:::

## Security best practices

### Never expose production keys in client-side code

If your website calls the API directly from the browser, the API key is visible in network requests. This is acceptable for the sandbox key and for production keys with origin restrictions, but for maximum security:

- **Server-side proxy** (recommended): Make API calls from your backend server and return results to the frontend. Your API key stays on the server and is never exposed.
- **Origin restrictions**: If you must call the API from the browser, ensure your production key has origin restrictions configured.

### Rotate keys if compromised

If you suspect a production key has been compromised, contact Booking Brain support immediately to revoke it and issue a replacement.

### Use environment variables

Store your API key in an environment variable, not in source code:

```bash
# .env (never commit this file)
BOOKINGBRAIN_API_KEY=bb_prod_your_key_here
```

```javascript
// Read from environment
const API_KEY = process.env.BOOKINGBRAIN_API_KEY;
```

```python
import os

API_KEY = os.environ["BOOKINGBRAIN_API_KEY"]
```

### One key per environment

Use separate keys for development, staging, and production. This makes it easy to revoke a compromised key without disrupting other environments.

## Next steps

- [Error Handling](/docs/errors) -- Understand error responses and rate limits
- [Quick Start](/docs/quick-start) -- Make your first API call
- [API Reference](/docs/api/booking-brain-developer-api) -- Full endpoint documentation
