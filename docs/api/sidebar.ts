import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/booking-brain-developer-api",
    },
    {
      type: "category",
      label: "Property Search",
      link: {
        type: "doc",
        id: "api/property-search",
      },
      items: [
        {
          type: "doc",
          id: "api/search-properties",
          label: "Search properties with filters",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-all-special-offers",
          label: "Get special offers across all properties",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Property Details",
      link: {
        type: "doc",
        id: "api/property-details",
      },
      items: [
        {
          type: "doc",
          id: "api/get-property-by-id",
          label: "Get property details by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-property-by-slug",
          label: "Get property by place and property slug",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-property-extras",
          label: "Get property extras/add-ons",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-property-reviews",
          label: "Get property reviews (paginated)",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-property-images",
          label: "Get property images",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-property-bedrooms",
          label: "Get property bedroom information",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-owner-contact",
          label: "Get property owner contact info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-property-special-offers",
          label: "Get special offers for a specific property",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Availability & Pricing",
      link: {
        type: "doc",
        id: "api/availability-pricing",
      },
      items: [
        {
          type: "doc",
          id: "api/get-unavailable-dates",
          label: "Get unavailable dates for a property",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-start-days",
          label: "Get available start days for a property",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-short-breaks",
          label: "Get short break rules for a property",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-start-dates",
          label: "Get available start dates for next N months",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/calculate-price",
          label: "Calculate price for a property stay",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/get-available-nights",
          label: "Get available nights from a check-in date",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Booking",
      link: {
        type: "doc",
        id: "api/booking",
      },
      items: [
        {
          type: "doc",
          id: "api/create-booking",
          label: "Submit a booking",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/validate-voucher",
          label: "Validate a discount voucher",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Payment",
      link: {
        type: "doc",
        id: "api/payment",
      },
      items: [
        {
          type: "doc",
          id: "api/process-payment",
          label: "Process a payment via SagePay",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Places",
      link: {
        type: "doc",
        id: "api/places",
      },
      items: [
        {
          type: "doc",
          id: "api/get-all-places",
          label: "Get all property places/locations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-properties-by-place",
          label: "Get properties by place slug",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Usage",
      link: {
        type: "doc",
        id: "api/usage",
      },
      items: [
        {
          type: "doc",
          id: "api/get-usage-stats",
          label: "Get API usage statistics for a client",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-usage-logs",
          label: "Get paginated API usage logs",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
