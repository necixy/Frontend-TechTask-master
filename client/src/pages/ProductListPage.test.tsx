import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@emotion/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import theme from '../theme/theme';

import ProductListPage from './ProductListPage';

// Initialize a basic i18n instance for testing
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        error: 'Error: {{message}}',
        loading: 'Loading...',
        loadMore: 'Load More',
        addToCart: 'Add to Cart',
        categories: 'Categories',
        search: 'Search',
      },
    },
  },
});

// Mock Apollo Client
const mockClient = {
  query: jest.fn(),
  mutate: jest.fn(),
  watchQuery: jest.fn(),
  readQuery: jest.fn(),
  writeQuery: jest.fn(),
  resetStore: jest.fn(),
  clearStore: jest.fn(),
  onResetStore: jest.fn(),
  cache: {
    readQuery: jest.fn(),
    writeQuery: jest.fn(),
  },
} as any;

// Mock useCategories hook
jest.mock('../hooks/useCategories', () => ({
  useCategories: jest.fn(),
}));
import { useCategories } from '../hooks/useCategories';

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApolloProvider client={mockClient}>
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </ThemeProvider>
  </ApolloProvider>
);

describe('ProductListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header, sidebar, and footer', () => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: [
        {
          name: 'Living Room',
          articleCount: 2,
          childrenCategories: { list: [] },
        },
      ],
      articles: [],
      loading: false,
      error: undefined,
      hasMore: false,
      loadMore: jest.fn(),
    });
    render(<ProductListPage />, { wrapper: TestWrapper });

    // Check header elements
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

    // Check sidebar content
    expect(screen.getByText('Living Room')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: [],
      articles: [],
      loading: true,
      error: undefined,
      hasMore: false,
      loadMore: jest.fn(),
    });
    render(<ProductListPage />, { wrapper: TestWrapper });
    expect(screen.getAllByTestId('loading').length).toBeGreaterThan(0);
  });

  it('renders product search in header', () => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: [],
      articles: [],
      loading: false,
      error: undefined,
      hasMore: false,
      loadMore: jest.fn(),
    });
    render(<ProductListPage />, { wrapper: TestWrapper });

    const searchInput = screen.getByPlaceholderText('Search');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeInstanceOf(HTMLInputElement);
  });

  it('allows typing in the search input', async () => {
    const user = userEvent.setup();
    (useCategories as jest.Mock).mockReturnValue({
      categories: [],
      articles: [],
      loading: false,
      error: undefined,
      hasMore: false,
      loadMore: jest.fn(),
    });
    render(<ProductListPage />, { wrapper: TestWrapper });

    const searchInput = screen.getByPlaceholderText(
      'Search'
    ) as HTMLInputElement;
    await user.type(searchInput, 'sofa');

    expect(searchInput.value).toBe('sofa');
  });

  it('shows error state', () => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: [],
      articles: [],
      loading: false,
      error: { message: 'Error' },
      hasMore: false,
      loadMore: jest.fn(),
    });
    render(<ProductListPage />, { wrapper: TestWrapper });
    expect(screen.getByText('Error: Error')).toBeInTheDocument();
  });

  it('renders product list', async () => {
    const mockArticles = [
      {
        id: '1',
        name: 'Product 1',
        images: [{ path: 'img1.jpg' }],
        prices: {
          regular: { value: 1000 },
          currency: 'EUR',
        },
        variantName: 'Variant 1',
      },
      {
        id: '2',
        name: 'Product 2',
        images: [{ path: 'img2.jpg' }],
        prices: {
          regular: { value: 2000 },
          currency: 'EUR',
        },
        variantName: 'Variant 2',
      },
    ];
    (useCategories as jest.Mock).mockReturnValue({
      categories: [
        {
          name: 'Living Room',
          articleCount: 2,
          childrenCategories: { list: [] },
        },
      ],
      articles: mockArticles,
      loading: false,
      error: undefined,
      hasMore: false,
      loadMore: jest.fn(),
    });
    render(<ProductListPage />, { wrapper: TestWrapper });
    for (const product of mockArticles) {
      expect(await screen.findByText(product.name)).toBeInTheDocument();
    }
  });

  it('shows load more button when hasMore is true and articles exist', () => {
    const mockLoadMore = jest.fn();
    (useCategories as jest.Mock).mockReturnValue({
      categories: [
        {
          name: 'Living Room',
          articleCount: 10,
          childrenCategories: { list: [] },
        },
      ],
      articles: [
        {
          name: 'Product 1',
          images: [{ path: 'img1.jpg' }],
          prices: {
            regular: { value: 1000 },
            currency: 'EUR',
          },
          variantName: 'Variant 1',
        },
      ],
      loading: false,
      error: undefined,
      hasMore: true,
      loadMore: mockLoadMore,
    });
    render(<ProductListPage />, { wrapper: TestWrapper });

    const loadMoreButton = screen.getByText('Load More');
    expect(loadMoreButton).toBeInTheDocument();
    expect(loadMoreButton).not.toBeDisabled();
  });

  it('does not show load more button when hasMore is false', () => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: [
        {
          name: 'Living Room',
          articleCount: 1,
          childrenCategories: { list: [] },
        },
      ],
      articles: [
        {
          name: 'Product 1',
          images: [{ path: 'img1.jpg' }],
          prices: {
            regular: { value: 1000 },
            currency: 'EUR',
          },
          variantName: 'Variant 1',
        },
      ],
      loading: false,
      error: undefined,
      hasMore: false,
      loadMore: jest.fn(),
    });
    render(<ProductListPage />, { wrapper: TestWrapper });

    expect(screen.queryByText('Load More')).not.toBeInTheDocument();
  });

  it('does not show load more button when no articles exist', () => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: [
        {
          name: 'Living Room',
          articleCount: 0,
          childrenCategories: { list: [] },
        },
      ],
      articles: [],
      loading: false,
      error: undefined,
      hasMore: true,
      loadMore: jest.fn(),
    });
    render(<ProductListPage />, { wrapper: TestWrapper });

    expect(screen.queryByText('Load More')).not.toBeInTheDocument();
  });

  it('shows loading text and disables button when loading more articles', () => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: [
        {
          name: 'Living Room',
          articleCount: 10,
          childrenCategories: { list: [] },
        },
      ],
      articles: [
        {
          name: 'Product 1',
          images: [{ path: 'img1.jpg' }],
          prices: {
            regular: { value: 1000 },
            currency: 'EUR',
          },
          variantName: 'Variant 1',
        },
      ],
      loading: true,
      error: undefined,
      hasMore: true,
      loadMore: jest.fn(),
    });
    render(<ProductListPage />, { wrapper: TestWrapper });

    // Find the button specifically (not the sidebar loading)
    const loadMoreButton = screen.getByRole('button', { name: 'Loading...' });
    expect(loadMoreButton).toBeInTheDocument();
    expect(loadMoreButton).toBeDisabled();
  });

  it('calls loadMore function when load more button is clicked', async () => {
    const user = userEvent.setup();
    const mockLoadMore = jest.fn();
    (useCategories as jest.Mock).mockReturnValue({
      categories: [
        {
          name: 'Living Room',
          articleCount: 10,
          childrenCategories: { list: [] },
        },
      ],
      articles: [
        {
          name: 'Product 1',
          images: [{ path: 'img1.jpg' }],
          prices: {
            regular: { value: 1000 },
            currency: 'EUR',
          },
          variantName: 'Variant 1',
        },
      ],
      loading: false,
      error: undefined,
      hasMore: true,
      loadMore: mockLoadMore,
    });
    render(<ProductListPage />, { wrapper: TestWrapper });

    const loadMoreButton = screen.getByText('Load More');
    await user.click(loadMoreButton);

    expect(mockLoadMore).toHaveBeenCalledTimes(1);
  });
});
