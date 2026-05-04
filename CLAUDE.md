# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Factory Inventory Management System Demo with GitHub integration - Full-stack application with Vue 3 frontend, Python FastAPI backend, and in-memory mock data (no database).

## Critical Tool Usage Rules

### Subagents
Use the Agent tool with these specialized subagents for appropriate tasks:

- **vue-expert**: Use for Vue 3 frontend features, UI components, styling, and client-side functionality
  - Examples: Creating components, fixing reactivity issues, performance optimization, complex state management
  - **MANDATORY RULE: ANY time you need to create or significantly modify a .vue file, you MUST delegate to vue-expert**
- **code-reviewer**: Use after writing significant code to review quality and best practices
- **Explore**: Use for understanding codebase structure, searching for patterns, or answering questions about how components work
- **general-purpose**: Use for complex multi-step tasks or when other agents don't fit

### Skills
- **backend-api-test** skill: Use when writing or modifying tests in `tests/backend` directory with pytest and FastAPI TestClient

### MCP Tools
- **ALWAYS use GitHub MCP tools** (`mcp__github__*`) for ALL GitHub operations
  - Exception: Local branches only - use `git checkout -b` instead of `mcp__github__create_branch`
- **ALWAYS use Playwright MCP tools** (`mcp__playwright__*`) for browser testing
  - Test against: `http://localhost:3000` (frontend), `http://localhost:8001` (API)

## Stack
- **Frontend**: Vue 3 + Composition API + Vite (port 3000)
- **Backend**: Python FastAPI (port 8001)
- **Data**: JSON files in `server/data/` loaded via `server/mock_data.py`

## Commands

```bash
# Backend
cd server && uv run python main.py

# Frontend
cd client && npm install && npm run dev

# Build frontend
cd client && npm run build

# Run all backend tests
cd tests && uv run pytest -v

# Run a single test file
cd tests && uv run pytest backend/test_orders.py -v

# Run a specific test
cd tests && uv run pytest backend/test_dashboard.py::test_summary_all_filters -v

# Run tests with coverage
cd tests && uv run pytest --cov ../server
```

No linting config is present (no .eslintrc or eslint.config.js).

## Architecture

### Data Flow
Vue filter state (useFilters composable) → query params → `client/src/api.js` (axios) → FastAPI → in-memory filtering → Pydantic validation → refs/computed properties in view

### Frontend Composables (`client/src/composables/`)
Three singleton composables share state across the app:
- **useFilters.js** — app-wide filter state (period, location, category, status); views `watch` these and re-fetch
- **useI18n.js** — English/Japanese locale; locale also determines currency (en→USD, ja→JPY); use `t()` for translations
- **useAuth.js** — mock user authentication and task list (these mock tasks merge with API tasks from the backend)

### Backend (`server/main.py`)
All 17 endpoints are defined in a single file (no route modules). Key helpers:
- `apply_filters(data, warehouse, category, status)` — case-insensitive, skips if param is `'all'` or `None`
- `filter_by_month(data, month)` — accepts `2025-01` format OR `Q1-2025`…`Q4-2025` (hardcoded 2025 quarter ranges)

The `/api/backlog` endpoint enhances each item at runtime by checking `purchase_orders.json` to add a `has_purchase_order` flag.

### Test Suite (`tests/`)
51 tests across 4 files using pytest + FastAPI TestClient. The `conftest.py` provides a shared `client` fixture. Tests cover all endpoints, filter combinations, data validation, and edge cases.

## API Endpoints
- `GET /api/inventory` — Filters: warehouse, category (no month filter)
- `GET /api/inventory/{id}` — Single item
- `GET /api/orders` — Filters: warehouse, category, status, month (supports `Q1-2025` format)
- `GET /api/orders/{id}` — Single order
- `GET /api/dashboard/summary` — All filters
- `GET /api/demand` — No filters
- `GET /api/backlog` — No filters; adds `has_purchase_order` flag per item
- `GET /api/spending/summary|monthly|categories|transactions` — Spending data
- `GET /api/reports/quarterly`, `GET /api/reports/monthly-trends` — Computed aggregates
- `POST /api/tasks`, `GET /api/tasks`, `DELETE /api/tasks/{id}`, `PATCH /api/tasks/{id}` — Task CRUD
- `POST /api/purchase-orders`, `GET /api/purchase-orders` — PO management

## Code Conventions
- Always document non-obvious logic changes with comments

## Common Issues
1. Use unique keys in `v-for` (not `index`) — use `sku`, `month`, `id`, etc.
2. Validate dates before calling `.getMonth()` — a common source of runtime errors
3. Update Pydantic models in `server/main.py` when changing JSON data structure
4. Inventory filters don't support month (no time dimension on inventory data)
5. Revenue goals: $800K/month single warehouse, $9.6M YTD all months

## Key Data Assumptions
- Warehouses: `"San Francisco"`, `"London"`, `"Tokyo"`
- Categories: `"Circuit Boards"`, `"Sensors"`, `"Actuators"`, `"Controllers"`, `"Power Supplies"`
- Order statuses: `"Delivered"`, `"Shipped"`, `"Processing"`, `"Backordered"`
- Demand trends: `"uptrend"`, `"downtrend"`, `"stable"`
- All dates are ISO format `YYYY-MM-DD`

## Design System
- Colors: Slate/gray (`#0f172a`, `#64748b`, `#e2e8f0`)
- Status colors: green/blue/yellow/red
- Charts: Custom SVG; layouts use CSS Grid
- No emojis in UI
- Styles live in `client/src/App.vue` (global) and scoped blocks per component
