---
id: ai-integration
title: AI Agent Integration
sidebar_position: 1
---

# AI Agent Integration

The Booking Brain API is designed to work with AI agents, LLM function calling, and automated assistants. Every endpoint has a unique `operationId`, request/response schemas are fully typed, and the OpenAPI spec is available for programmatic consumption.

This guide covers how to connect AI systems to Booking Brain for property search, availability checking, pricing, and booking.

## Why Booking Brain is AI-ready

1. **OpenAPI 3.0 spec** -- Machine-readable API contract that LLMs can parse directly
2. **operationId on every endpoint** -- Clean function names like `searchProperties`, `calculatePrice`, `createBooking`
3. **Typed schemas** -- Every request and response has a JSON Schema definition
4. **`/llms.txt` discovery** -- Standard AI discovery file at the docs root
5. **Deterministic flows** -- The booking journey follows a strict sequence that agents can reliably execute

## OpenAPI spec

The full spec is available at:

```
https://docs.bookingbrain.com/openapi.yaml
```

Feed this to any tool that generates function definitions from OpenAPI specs. The spec includes:
- All 23 endpoints with full parameter documentation
- Request body schemas for POST endpoints
- Response schemas with field descriptions and examples
- Code samples in 5 languages

## operationId reference

Every endpoint has a descriptive `operationId` suitable for function calling:

| operationId | Method | Path | Description |
|---|---|---|---|
| `searchProperties` | GET | `/developer/search` | Search properties with filters |
| `getAllSpecialOffers` | GET | `/developer/properties/specialoffers` | Get all special offers |
| `getPropertyById` | GET | `/developer/properties/{id}` | Get property details by ID |
| `getPropertyBySlug` | GET | `/developer/{placeSlug}/{propertySlug}` | Get property by slug |
| `getPropertyExtras` | GET | `/developer/properties/{id}/extras` | Get extras/add-ons |
| `getPropertyReviews` | GET | `/developer/properties/{id}/reviews` | Get reviews (paginated) |
| `getPropertyImages` | GET | `/developer/properties/{id}/images` | Get property images |
| `getPropertyBedrooms` | GET | `/developer/properties/{id}/bedrooms` | Get bedroom details |
| `getOwnerContact` | GET | `/developer/properties/{id}/owner-contact` | Get owner contact info |
| `getPropertySpecialOffers` | GET | `/developer/properties/{id}/specialoffers` | Get property-specific offers |
| `getUnavailableDates` | GET | `/developer/properties/{id}/unavailableDates` | Get booked/blocked dates |
| `getStartDays` | GET | `/developer/properties/{id}/startDays` | Get valid check-in days |
| `getStartDates` | GET | `/developer/properties/{id}/start-dates` | Get available start dates |
| `getShortBreaks` | GET | `/developer/properties/{id}/shortBreaks` | Get short break rules |
| `calculatePrice` | POST | `/developer/properties/{id}/get-price` | Calculate price for a stay |
| `getAvailableNights` | POST | `/developer/properties/{id}/available-nights` | Get valid night durations |
| `createBooking` | POST | `/developer/bookings/save` | Submit a booking |
| `validateVoucher` | POST | `/developer/bookings/validate-voucher` | Validate a discount voucher |
| `processPayment` | POST | `/developer/bookings/processPayment` | Process card payment |
| `getAllPlaces` | GET | `/developer/places` | Get all places/locations |
| `getPropertiesByPlace` | GET | `/developer/places/{slug}` | Get properties by place |
| `getUsageStats` | GET | `/developer/usage/stats` | Get usage statistics |
| `getUsageLogs` | GET | `/developer/usage/logs` | Get usage logs |

## Example: Claude function calling

Here is how to set up Booking Brain as a tool for Claude using the Anthropic API:

### Define the tools

```python
import anthropic
import requests
import json

API_KEY = "bb_sandbox_test_key_do_not_use_in_production"
BASE_URL = "https://app.bookingbrain.com/api/v1/developer"

# Define Booking Brain tools for Claude
tools = [
    {
        "name": "searchProperties",
        "description": "Search holiday rental properties by location, dates, guest count, and amenities. Returns paginated results with property summaries.",
        "input_schema": {
            "type": "object",
            "properties": {
                "place": {
                    "type": "string",
                    "description": "Place slug or name (e.g. 'exmoor', 'north-devon', 'porlock')"
                },
                "checkin": {
                    "type": "string",
                    "description": "Check-in date in YYYY-MM-DD format"
                },
                "nights": {
                    "type": "integer",
                    "description": "Number of nights"
                },
                "guests": {
                    "type": "integer",
                    "description": "Number of guests"
                },
                "bedrooms": {
                    "type": "integer",
                    "description": "Minimum number of bedrooms"
                },
                "pets": {
                    "type": "string",
                    "enum": ["yes"],
                    "description": "Set to 'yes' to filter pet-friendly only"
                },
                "sort": {
                    "type": "string",
                    "enum": ["price", "rating", "title"],
                    "description": "Sort results by field"
                }
            }
        }
    },
    {
        "name": "getPropertyById",
        "description": "Get full details for a property including description, amenities, pricing, location, check-in/out times, and house rules.",
        "input_schema": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "description": "Property ID"
                }
            },
            "required": ["id"]
        }
    },
    {
        "name": "calculatePrice",
        "description": "Calculate the total price for a property stay. Response code 0 means available; non-zero means unavailable.",
        "input_schema": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "description": "Property ID"
                },
                "start_date": {
                    "type": "string",
                    "description": "Check-in date in YYYY-MM-DD format"
                },
                "num_nights": {
                    "type": "integer",
                    "description": "Number of nights"
                },
                "num_guests": {
                    "type": "integer",
                    "description": "Number of guests"
                }
            },
            "required": ["id", "start_date", "num_nights"]
        }
    },
    {
        "name": "getUnavailableDates",
        "description": "Get dates that are booked or blocked for a property. Returns an array of date strings.",
        "input_schema": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "description": "Property ID"
                },
                "year": {
                    "type": "string",
                    "description": "Filter by year (e.g. '2026')"
                },
                "month": {
                    "type": "string",
                    "description": "Filter by month 1-12"
                }
            },
            "required": ["id"]
        }
    },
    {
        "name": "getAllPlaces",
        "description": "Get all destination areas where properties are listed. Returns place names, slugs, and descriptions.",
        "input_schema": {
            "type": "object",
            "properties": {}
        }
    }
]
```

### Execute tool calls

```python
def execute_tool(tool_name, tool_input):
    """Execute a Booking Brain API call based on the tool name and input."""
    headers = {"X-API-Key": API_KEY}

    if tool_name == "searchProperties":
        params = {k: v for k, v in tool_input.items() if v is not None}
        response = requests.get(f"{BASE_URL}/search", params=params, headers=headers)

    elif tool_name == "getPropertyById":
        response = requests.get(
            f"{BASE_URL}/properties/{tool_input['id']}", headers=headers
        )

    elif tool_name == "calculatePrice":
        property_id = tool_input.pop("id")
        response = requests.post(
            f"{BASE_URL}/properties/{property_id}/get-price",
            json=tool_input,
            headers={**headers, "Content-Type": "application/json"},
        )

    elif tool_name == "getUnavailableDates":
        property_id = tool_input.pop("id")
        params = {k: v for k, v in tool_input.items() if v is not None}
        response = requests.get(
            f"{BASE_URL}/properties/{property_id}/unavailableDates",
            params=params,
            headers=headers,
        )

    elif tool_name == "getAllPlaces":
        response = requests.get(f"{BASE_URL}/places", headers=headers)

    else:
        return {"error": f"Unknown tool: {tool_name}"}

    return response.json()
```

### Run the conversation loop

```python
client = anthropic.Anthropic()

def chat(user_message):
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250514",
            max_tokens=4096,
            system="You are a holiday booking assistant for properties on Exmoor and North Devon. Use the Booking Brain API tools to search for properties, check availability, and calculate prices. Be helpful and conversational.",
            tools=tools,
            messages=messages,
        )

        # Check if Claude wants to use a tool
        if response.stop_reason == "tool_use":
            # Process each tool call
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                    })

            # Continue the conversation with tool results
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
        else:
            # Claude has a final text response
            for block in response.content:
                if hasattr(block, "text"):
                    return block.text

# Example conversation
print(chat("I'm looking for a dog-friendly cottage in Porlock for 2 adults and 2 children, ideally the first week of August. What's available and how much would it cost?"))
```

This gives Claude the ability to search Booking Brain, check availability, and present pricing -- all through natural conversation.

## Example: Building a chatbot

For a web-based chatbot, the pattern is the same but runs server-side:

```javascript
// Server-side: Express.js endpoint
app.post("/api/chat", async (req, res) => {
  const { message, conversationHistory } = req.body;

  // Call your LLM with Booking Brain tools defined
  const response = await callLLM({
    messages: [...conversationHistory, { role: "user", content: message }],
    tools: bookingBrainTools,
  });

  // If the LLM wants to call a tool, execute it
  if (response.toolCalls) {
    for (const call of response.toolCalls) {
      const result = await executeBookingBrainTool(call.name, call.arguments);
      // Feed the result back to the LLM for the next turn
    }
  }

  res.json({ reply: response.text });
});
```

The key principle: your backend acts as a bridge between the LLM and the Booking Brain API. The LLM decides which tools to call based on the user's request, and your backend executes those calls with the API key securely stored server-side.

## `/llms.txt` discovery

The docs site publishes a standard `llms.txt` file at:

```
https://docs.bookingbrain.com/llms.txt
```

This file follows the [llms.txt specification](https://llmstxt.org/) and provides a concise summary of the API for LLM consumption. It includes:
- API description and capabilities
- Authentication details
- Links to the full OpenAPI spec
- Links to detailed documentation

For a comprehensive version suitable for ingesting the full API context:

```
https://docs.bookingbrain.com/llms-full.txt
```

## MCP Server (Model Context Protocol)

The Booking Brain MCP server lets AI tools like **Claude Desktop**, **Claude Code**, and **Cursor** interact with the API natively -- no custom code needed. All 23 API endpoints are available as MCP tools.

### What is MCP?

[Model Context Protocol](https://modelcontextprotocol.io/) is an open standard for connecting AI assistants to external tools and data sources. Instead of writing custom function-calling code, you configure an MCP server and the AI can use all its tools directly.

### Installation

```bash
# Clone or download the MCP server
cd bb-mcp-server
npm install
npm run build
```

Or install from npm:

```bash
npm install -g @bookingbrain/mcp-server
```

### Configuration

Add the server to your AI tool's MCP configuration:

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "booking-brain": {
      "command": "node",
      "args": ["/path/to/bb-mcp-server/dist/server.js"],
      "env": {
        "BB_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Claude Code

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "booking-brain": {
      "command": "node",
      "args": ["/path/to/bb-mcp-server/dist/server.js"],
      "env": {
        "BB_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Cursor

Add to Cursor's MCP settings (`Settings > MCP Servers`):

```json
{
  "booking-brain": {
    "command": "node",
    "args": ["/path/to/bb-mcp-server/dist/server.js"],
    "env": {
      "BB_API_KEY": "your_api_key_here"
    }
  }
}
```

### Available tools

Once configured, your AI assistant can use all 23 tools:

| Group | Tools |
|---|---|
| **Property Search** | `searchProperties`, `getAllSpecialOffers` |
| **Property Details** | `getPropertyById`, `getPropertyBySlug`, `getPropertyExtras`, `getPropertyReviews`, `getPropertyImages`, `getPropertyBedrooms` |
| **Availability & Pricing** | `getUnavailableDates`, `getStartDays`, `getShortBreaks`, `getStartDates`, `calculatePrice`, `getAvailableNights` |
| **Booking** | `createBooking`, `validateVoucher` |
| **Payment** | `processPayment` |
| **Places** | `getAllPlaces`, `getPropertiesByPlace` |
| **Usage** | `getUsageStats`, `getUsageLogs` |
| **Other** | `getOwnerContact`, `getPropertySpecialOffers` |

### Example conversation

Once the MCP server is connected, you can talk to your AI assistant naturally:

> **You:** Find me a dog-friendly cottage in Porlock for 4 people, first week of August. How much would it cost?

The AI will automatically call `searchProperties`, then `calculatePrice`, and present the results conversationally -- no code required.

## Tips for AI integration

### Start with read-only operations

Begin with search, property details, and pricing. These are safe to call repeatedly and do not modify any data. Only add booking and payment capabilities once your agent is thoroughly tested.

### Cache property data

Property details, images, and place data change infrequently. Cache them to reduce API calls and improve response times in conversational flows.

### Handle the booking sequence

The booking flow is sequential. An AI agent must follow the correct order:

1. Search or identify a property
2. Verify availability for the requested dates
3. Calculate the price (and check `response === 0`)
4. Only then create a booking with the calculated price

Skipping steps (for example, trying to book without checking price) will result in errors or incorrect charges.

### Provide context to the LLM

When defining tools for your LLM, include rich descriptions that help the model understand when to use each tool. For example:

- "Use `searchProperties` when the user asks to find or browse properties"
- "Use `calculatePrice` when the user asks about cost, pricing, or how much a stay would be"
- "Use `getUnavailableDates` when the user asks about availability for specific dates"

### Rate limits in agent loops

AI agents can make many API calls in rapid succession. Implement rate limit handling with exponential backoff (see [Error Handling](/docs/errors)) and consider adding a delay between consecutive calls in agent loops.

## Next steps

- [Booking Flow](/docs/booking-flow) -- Understand the complete booking sequence
- [Error Handling](/docs/errors) -- Build resilient API calls with retry logic
- [API Reference](/docs/api/booking-brain-developer-api) -- Full endpoint documentation
