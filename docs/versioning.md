---
id: versioning
title: Versioning
description: How the Booking Brain API is versioned, what constitutes a breaking change, and how deprecation works.
sidebar_position: 6
keywords: [API versioning, breaking changes, deprecation, backwards compatibility, migration]
---

# Versioning

The Booking Brain Developer API uses URL-based versioning to ensure your integration remains stable as the API evolves.

## Current version

```
https://app.bookingbrain.com/api/v2/developer
```

The current version is **v2**. The version is part of the base URL.

## What is a breaking change?

The following are considered breaking changes and will only be introduced in a new API version:

- Removing an endpoint
- Removing or renaming a response field
- Changing the type of an existing response field
- Adding a new required request parameter
- Changing authentication behaviour
- Changing error response structure

## What is NOT a breaking change?

The following may happen within the current version without notice:

- Adding new optional query parameters
- Adding new fields to response objects
- Adding new endpoints
- Adding new enum values to existing fields
- Changing the order of fields in JSON responses
- Increasing rate limits

:::tip Build defensively
Always ignore unknown fields in API responses rather than failing on them. This ensures your integration continues to work when we add new fields.
:::

## Deprecation policy

When a new API version is released:

1. The previous version will continue to work for **at least 12 months** after the new version is available
2. Deprecated endpoints will return a `Sunset` header indicating when they will be removed
3. We will announce deprecations via email to all registered API key holders and in the [Changelog](/changelog)

## Staying informed

- **[Changelog](/changelog)** — All API changes are documented with dates
- **Email notifications** — Production API key holders receive advance notice of breaking changes
- **`Sunset` header** — Deprecated endpoints include this header in responses
