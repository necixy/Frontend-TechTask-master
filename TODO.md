# TODO

This document lists the features and improvements that could not be completed within the available timeframe. Each item includes a brief explanation of what was intended and the reason it was not finished.

---

## 1. Enhanced UI & Mobile Responsiveness

- **Planned:** Further improve the UI to achieve a more polished, visually appealing, and mobile-responsive design, ideally matching a Figma file or official design guidelines.
- **Reason Not Done:** No detailed design guide or Figma reference was provided. A more robust design implementation would require such resources to ensure visual consistency with brand standards.

---

## 2. Dynamic Category Functionality

- **Planned:** Make category navigation and filtering fully functional, allowing users to browse by category.
- **Reason Not Done:** Additional information about the GraphQL schema and endpoint details is needed to implement category-based data fetching and navigation reliably.

---

## 3. Product Search Implementation

- **Planned:** Implement a search feature to allow users to query and filter products by text.
- **Reason Not Done:** A search query and/or GraphQL schema for product search was not provided, making it unclear how to fetch filtered results.

---

## 4. Infinite Scrolling

- **Planned:** Replace the "Load More" button with infinite scroll to load new products automatically as the user scrolls.
- **Reason Not Done:** For demonstration, the "Load More" button was kept to clearly show pagination logic (offset-based loading). Infinite scroll can be added once the rest of the logic is stable.

---

## 5. Additional Test Coverage

- **Planned:** Expand test coverage to include more edge cases, error states, and possibly component interaction tests.
- **Reason Not Done:** To balance time and effort, focus was placed on covering the main features and flows, ensuring essential reliability.

---

## 6. Playwright E2E Tests

- **Planned:** Add Playwright end-to-end (E2E) tests to validate user flows and integration across the application.
- **Reason Not Done:** The current product listing page is relatively simple and does not contain complex flows that would fully benefit from E2E testing. Setting up Playwright would require significant time, which was better spent on code quality, performance, and comprehensive unit/integration tests.

---

If any of these items become a priority, or if more information (such as design files or GraphQL documentation) becomes available, they should be revisited for future development.