# Project Development & Technical Documentation

This documentation covers the development history, architectural choices, and detailed technical features of the `Home 24 Task` repository (`necixy/Frontend-TechTask-master`). It includes both high-level overviews and concrete references to the codebase, reflecting the evolution and best practices implemented.

---

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Dependency Management & Project Structure](#dependency-management--project-structure)
3. [GraphQL Data Fetching (Migration from HTTP)](#graphql-data-fetching-migration-from-http)
4. [Component Architecture](#component-architecture)
5. [Styling System Modernization](#styling-system-modernization)
6. [Routing Enhancements](#routing-enhancements)
7. [Internationalization (i18n)](#internationalization-i18n)
8. [UI/UX Improvements](#uiux-improvements)
9. [Load More Feature & Pagination](#load-more-feature--pagination)
10. [Testing Suite & Coverage](#testing-suite--coverage)
11. [Summary & Best Practices](#summary--best-practices)
12. [References](#references)

---

## 1. Initial Setup

- **First Commit:**  
  Set up the repository with a Create React App client and a basic Express server.

---

## 2. Dependency Management & Project Structure

- **Yarn & Folder Handling:**
  - `.yarn` folder is ignored to avoid unnecessary bloat, as recommended by Yarn documentation.
- **Apollo Client:**
  - Standardized on `@apollo/client` for GraphQL integration.
- **Directory Structure:**
  - Clear separation between `client/` and `server/`, with modular folders for components, hooks, and services.

---

## 3. GraphQL Data Fetching (Migration from HTTP)

### 3.1 Overview

- **Original:**  
  Data fetching was based on REST/HTTP.
- **Now:**  
  Entire data flow is handled via GraphQL, using Apollo Client.

### 3.2 Server-Side Proxy

```typescript
// server/server.ts
import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';
const app = express();
const proxy = createProxyMiddleware({
  target: 'https://www.home24.de',
  changeOrigin: true,
  logLevel: 'debug',
});
// Disabled caching to make load more work.
// app.post('/graphql', cache('5 minutes'), proxy);
app.post('/graphql', proxy);
app.listen(3001);
```

- _Purpose:_ Disables cache to ensure up-to-date results during pagination.

### 3.3 Apollo Client Example

```typescript
// client/src/services/apollo/client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
const httpLink = createHttpLink({ uri: '/graphql' });
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Category: { keyFields: ['name'] },
      Article: { keyFields: ['name', 'variantName'] },
    },
  }),
});
```

- _Purpose:_ All frontend data flows through Apollo GraphQL, providing normalized, strongly-typed access to category and article data.

---

## 4. Component Architecture

### 4.1 Structure

- **Functional Components:**
  - All UI elements are implemented as functional components using React Hooks.
- **Domain-based Grouping:**
  - E.g., `article-card/`, `article-grid/`, `category-list/`, `layout/sidebar/`.

#### Example: Article Grid Component

```tsx
// client/src/product/article-grid/ArticleGrid.tsx
const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => (
  <ArticlesContainer>
    {articles.map((article, index) => (
      <ArticleCard key={`${article.name}-${index}`} article={article} />
    ))}
  </ArticlesContainer>
);
```

---

## 5. Styling System Modernization

- **EmotionJS & styled-system:**
  - All styles are managed via `@emotion/styled` and `styled-system`, enabling theme support and scalable, maintainable design.
- **Removed Standalone CSS:**
  - Transitioned from CSS files to CSS-in-JS.

---

## 6. Routing Enhancements

- **SPA Navigation with react-router-dom:**
  - Ensures single-page app experience.
  - Category clicks update content without full page reloads.

---

## 7. Internationalization (i18n)

- **i18next Integration:**
  - All user-facing text is translated using i18next, with no hardcoded UI strings.
- **Example Translation:**
  ```json
  // client/src/locales/de/translation.json
  {
    "search": "Wonach suchst du?",
    "categories": "Kategorien",
    "addToCart": "In den Warenkorb",
    "footerText": "...",
    "loading": "Lädt...",
    "loadMore": "Mehr laden",
    "error": "Ein Fehler ist aufgetreten. {{message}}"
  }
  ```

---

## 8. UI/UX Improvements

- **General Enhancements:**
  - Improved accessibility, responsive layout, and visual hierarchy.
  - Sidebar, header, and product cards are visually distinct components.
- **Component Example:**
  - Product search with a localized placeholder and ARIA roles.

---

## 9. Load More Feature & Pagination

### 9.1 Offset-Based GraphQL Pagination

- **Where:**
  - Logic: `client/src/hooks/useCategories.ts`
  - UI: `client/src/pages/ProductListPage.tsx`

#### Example: Custom Hook for Pagination

```typescript
// useCategories.ts
const loadMore = useCallback(() => {
  if (loading) return;
  setLoading(true);
  apolloClient
    .query({
      query: GET_CATEGORIES,
      variables: { ids: [ids], first, offset: articles.length },
      fetchPolicy: 'network-only',
    })
    .then(({ data }) => {
      // Merge new unique articles
    });
}, [ids, first, articles, loading]);
```

- **UI Button:**
  ```tsx
  {
    hasMore && articles.length > 0 && (
      <LoadMoreWrapper>
        <Button onClick={loadMore} disabled={loading}>
          {loading ? t('loading') : t('loadMore')}
        </Button>
      </LoadMoreWrapper>
    );
  }
  ```
- _Purpose:_ Ensures efficient, user-friendly data loading without duplication.

---

## 10. Testing Suite & Coverage

### 10.1 Tools

- **Unit/Integration:** Jest, React Testing Library

### 10.2 Major Test Cases

- **ArticleCard:**
  - Image alt/src, name, price formatting, "Add to Cart" button, multi-image handling.
- **ArticleGrid:**
  - Renders correct number of cards, empty/grid state, price display.
- **CategoryList:**
  - Renders category links with correct href/ids.
- **ProductListPage:**
  - Header/sidebar/footer presence, loading state, "Load More" functionality (button enabled/disabled, click handling).
- **useCategories Hook:**
  - Correct variables to Apollo Client, refetch on parameter change, pagination, error/empty handling, prevents duplicate loads.

#### Example Test: Load More Button Logic

```tsx
// ProductListPage.test.tsx
it('calls loadMore function when load more button is clicked', async () => {
  const user = userEvent.setup();
  const mockLoadMore = jest.fn();
  render(<ProductListPage />, { wrapper: TestWrapper });
  const loadMoreButton = screen.getByText('Load More');
  await user.click(loadMoreButton);
  expect(mockLoadMore).toHaveBeenCalled();
});
```

---

## 11. Summary & Best Practices

- **Modern React and TypeScript:** Hooks, context, strict typing.
- **GraphQL-centric data flows:** All major data retrievals use normalized, strongly-typed queries.
- **Component isolation:** Logical separation and reusability.
- **Comprehensive and robust testing:** All major features and UI states are covered, including edge cases.
- **Internationalization:** No hardcoded UI text.

---

## 12. References

- [GraphQL Query Example](https://github.com/necixy/Frontend-TechTask-master/blob/main/client/src/services/apollo/queries.ts)
- [useCategories Hook](https://github.com/necixy/Frontend-TechTask-master/blob/main/client/src/hooks/useCategories.ts)
- [Component Test Example](https://github.com/necixy/Frontend-TechTask-master/blob/main/client/src/product/article-card/ArticleCard.test.tsx)
- [View All Code](https://github.com/necixy/Frontend-TechTask-master)

> **Note:** This summary references only a subset of the codebase for brevity. For exhaustive details or search, visit the [GitHub repository](https://github.com/necixy/Frontend-TechTask-master).
