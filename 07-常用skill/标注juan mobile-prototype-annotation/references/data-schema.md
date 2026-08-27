# Mobile Prototype Annotation Data Schema

Use this reference when turning requirements into the configuration that drives the page directory, phone preview, and annotation panel.

## Page model

```js
{
  id: "01_home_dashboard",
  title: "01. Home dashboard",
  navIcon: "home",
  phoneTitle: "Dashboard",
  description: "Short page purpose.",
  flow: ["Step one", "Step two"],
  tab: "home",
  modules: [
    {
      id: "metrics",
      kind: "metric-grid",
      label: "Today's metrics",
      data: []
    }
  ],
  rules: [],
  apiContracts: []
}
```

## Target IDs

Target IDs are the contract between the phone preview and the annotation panel.

- Use lowercase kebab-case or snake_case consistently.
- Make IDs semantic and stable across visual refactors.
- Do not use array indexes, text labels, or generated DOM IDs as the contract.
- One rule may target one module; several rules may target the same module.
- A field-level target may extend a module ID, for example `order-form.customer`.

Examples:

```text
metrics
quick-actions
warning-list
product-list
order-form.customer
order-form.submit
inventory-table
detail-drawer
```

## Rule model

```js
{
  id: "rule_dashboard_metrics",
  title: "Real-time metric calculation",
  type: "business-logic", // business-logic | interaction | field | permission | api
  target: "metrics",
  body: "Explain the behavior in one short paragraph.",
  bullets: [
    "State the formula, validation, or boundary condition."
  ],
  states: ["default", "loading", "error"],
  roles: ["admin", "operator"]
}
```

## API contract model

```js
{
  id: "api_dashboard_summary",
  target: "metrics",
  method: "GET",
  path: "/api/v1/dashboard/summary",
  purpose: "Fetch dashboard aggregates.",
  auth: "Bearer token",
  query: {
    date: "YYYY-MM-DD"
  },
  response: {
    code: 200,
    data: {}
  },
  errors: [
    { status: 401, meaning: "Unauthenticated" },
    { status: 500, meaning: "Server error" }
  ]
}
```

Do not claim that a mock endpoint is connected to a real backend. Label mock responses as mock data in code or in the final summary.
