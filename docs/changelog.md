---
id: changelog
title: Changelog
description: A record of all changes to the Booking Brain Developer API, including new endpoints, breaking changes, and improvements.
sidebar_position: 7
keywords: [changelog, API updates, new features, breaking changes, release notes]
---

# Changelog

All notable changes to the Booking Brain Developer API are documented here.

## v2.0.0 — 2026-03-19

**Initial public release** of the Booking Brain Developer API.

### Endpoints (22)

- **Property Search** — `GET /search`, `GET /specialoffers`
- **Property Details** — `GET /properties/{id}`, `GET /properties/slug/{slug}`, `GET /properties/{id}/extras`, `GET /properties/{id}/bedrooms`, `GET /properties/{id}/owner-contact`, `GET /properties/{id}/images`, `GET /properties/{id}/reviews`, `GET /properties/{id}/specialoffers`
- **Availability & Pricing** — `GET /properties/{id}/unavailableDates`, `GET /properties/{id}/startDays`, `GET /properties/{id}/shortBreaks`, `GET /properties/{id}/start-dates`, `POST /properties/{id}/get-price`, `GET /properties/{id}/available-nights`
- **Booking** — `POST /bookings/save`, `POST /bookings/validate-voucher`
- **Payment** — `POST /bookings/processPayment`
- **Places** — `GET /places`, `GET /places/{slug}`
- **Usage** — `GET /usage/stats`, `GET /usage/logs`

### Features

- API key authentication via `X-API-Key` header
- Sandbox key for development (`bb_sandbox_test_key_do_not_use_in_production`)
- Per-minute rate limiting with `X-RateLimit-*` headers
- IP whitelisting and origin restrictions for production keys
- Full OpenAPI 3.0 specification at [/openapi.yaml](/openapi.yaml)
- Machine-readable documentation at [/llms.txt](/llms.txt)
- Postman collection at [/bookingbrain-api.postman_collection.json](/bookingbrain-api.postman_collection.json)

### Documentation

- Developer portal launched at [docs.bookingbrain.com](https://docs.bookingbrain.com)
- Quick start guide, authentication guide, error handling reference, booking flow walkthrough
- AI integration guide with function calling examples
- Interactive API reference with code samples in 6 languages
