import React, { ReactNode } from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { NetworkStatus, InMemoryCache } from '@apollo/client';
import { useCategories } from './useCategories';
import { GET_CATEGORIES } from '../services/apollo/queries';
import { apolloClient } from '../services/apollo/client';

// Mock the apollo client
jest.mock('../services/apollo/client', () => ({
  apolloClient: {
    query: jest.fn(),
  },
}));

const mockedApolloClient = apolloClient as jest.Mocked<typeof apolloClient>;

// Mock data
const mockCategoriesData = {
  categories: [
    {
      __typename: 'Category',
      name: 'Living Room',
      articleCount: 3,
      childrenCategories: {
        __typename: 'CategoryList',
        list: [
          { __typename: 'Category', name: 'Sofas', urlPath: '/sofas', id: '1' },
          {
            __typename: 'Category',
            name: 'Tables',
            urlPath: '/tables',
            id: '2',
          },
        ],
      },
      categoryArticles: {
        __typename: 'ArticleList',
        articles: [
          {
            __typename: 'Article',
            name: 'Comfortable Sofa',
            variantName: 'Gray Fabric',
            prices: {
              __typename: 'Price',
              currency: 'EUR',
              regular: { __typename: 'PriceValue', value: 89900 },
            },
            images: [{ __typename: 'Image', path: '/images/sofa.jpg' }],
          },
          {
            __typename: 'Article',
            name: 'Coffee Table',
            variantName: 'Oak Wood',
            prices: {
              __typename: 'Price',
              currency: 'EUR',
              regular: { __typename: 'PriceValue', value: 29900 },
            },
            images: [{ __typename: 'Image', path: '/images/table.jpg' }],
          },
        ],
      },
    },
  ],
};

const mockLoadMoreData = {
  categories: [
    {
      __typename: 'Category',
      name: 'Living Room',
      articleCount: 3,
      childrenCategories: {
        __typename: 'CategoryList',
        list: [
          { __typename: 'Category', name: 'Sofas', urlPath: '/sofas', id: '1' },
          {
            __typename: 'Category',
            name: 'Tables',
            urlPath: '/tables',
            id: '2',
          },
        ],
      },
      categoryArticles: {
        __typename: 'ArticleList',
        articles: [
          {
            __typename: 'Article',
            name: 'Floor Lamp',
            variantName: 'Modern Style',
            prices: {
              __typename: 'Price',
              currency: 'EUR',
              regular: { __typename: 'PriceValue', value: 12900 },
            },
            images: [{ __typename: 'Image', path: '/images/lamp.jpg' }],
          },
        ],
      },
    },
  ],
};

// Helper to create proper Apollo query result
const createMockResult = (data: any) => ({
  data,
  loading: false,
  networkStatus: NetworkStatus.ready,
});

// Test wrapper
const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <MockedProvider mocks={[]} cache={new InMemoryCache()}>
      {children}
    </MockedProvider>
  );
};

describe('useCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress React act() warnings for cleaner test output
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        args[0]?.includes?.(
          'Warning: An update to TestComponent inside a test was not wrapped in act'
        ) ||
        args[0]?.includes?.('act(...)')
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterEach(() => {
    // Restore console.error
    jest.restoreAllMocks();
  });

  it('fetches categories and articles successfully', async () => {
    // Mock successful API response
    mockedApolloClient.query.mockResolvedValueOnce(
      createMockResult(mockCategoriesData)
    );

    const { result } = renderHook(() => useCategories('177577', 50), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.categories).toEqual([]);
    expect(result.current.articles).toEqual([]);
    expect(result.current.error).toBe(null);

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check final state
    expect(result.current.categories).toEqual(mockCategoriesData.categories);
    expect(result.current.articles).toEqual(
      mockCategoriesData.categories[0].categoryArticles.articles
    );
    expect(result.current.error).toBe(null);
    expect(result.current.hasMore).toBe(true); // 2 articles < 3 total
  });

  it('handles loading state correctly', async () => {
    // Mock delayed response
    let resolvePromise!: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedApolloClient.query.mockReturnValue(delayedPromise as any);

    const { result } = renderHook(() => useCategories('177577', 50), {
      wrapper: createWrapper(),
    });

    // Should be loading initially
    expect(result.current.loading).toBe(true);
    expect(result.current.categories).toEqual([]);
    expect(result.current.articles).toEqual([]);

    // Resolve the promise
    resolvePromise({
      data: mockCategoriesData,
      loading: false,
      networkStatus: NetworkStatus.ready,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(mockCategoriesData.categories);
  });

  it('handles error state correctly', async () => {
    const mockError = new Error('Network error');
    mockedApolloClient.query.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCategories('177577', 50), {
      wrapper: createWrapper(),
    });

    // Wait for error to be set
    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.categories).toEqual([]);
    expect(result.current.articles).toEqual([]);
  });

  it('implements loadMore functionality correctly', async () => {
    // Mock initial data
    mockedApolloClient.query.mockResolvedValueOnce(
      createMockResult(mockCategoriesData)
    );

    const { result } = renderHook(() => useCategories('177577', 50), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Mock loadMore data with a promise that doesn't resolve immediately
    let resolveLoadMore!: (value: any) => void;
    const loadMorePromise = new Promise((resolve) => {
      resolveLoadMore = resolve;
    });
    mockedApolloClient.query.mockReturnValueOnce(loadMorePromise as any);

    // Call loadMore
    act(() => {
      result.current.loadMore();
    });

    // Should be loading during loadMore
    expect(result.current.loading).toBe(true);

    // Resolve the promise
    act(() => {
      resolveLoadMore(createMockResult(mockLoadMoreData));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have combined articles (original + new)
    expect(result.current.articles).toHaveLength(3);
    expect(result.current.articles[0].name).toBe('Comfortable Sofa');
    expect(result.current.articles[1].name).toBe('Coffee Table');
    expect(result.current.articles[2].name).toBe('Floor Lamp');
  });

  it('prevents duplicate articles in loadMore', async () => {
    // Mock initial data
    mockedApolloClient.query.mockResolvedValueOnce(
      createMockResult(mockCategoriesData)
    );

    const { result } = renderHook(() => useCategories('177577', 50), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Mock loadMore with duplicate data
    mockedApolloClient.query.mockResolvedValueOnce(
      createMockResult({
        categories: [
          {
            ...mockCategoriesData.categories[0],
            categoryArticles: {
              articles:
                mockCategoriesData.categories[0].categoryArticles.articles,
            },
          },
        ],
      })
    );

    const originalLength = result.current.articles.length;

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should not have duplicate articles
    expect(result.current.articles).toHaveLength(originalLength);
  });

  it('calculates hasMore correctly', async () => {
    // Mock data where articles.length equals articleCount
    const completeData = {
      categories: [
        {
          ...mockCategoriesData.categories[0],
          articleCount: 2, // Same as number of articles
        },
      ],
    };

    mockedApolloClient.query.mockResolvedValueOnce(
      createMockResult(completeData)
    );

    const { result } = renderHook(() => useCategories('177577', 50), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
    expect(result.current.articles).toHaveLength(2);
  });

  it('handles empty results gracefully', async () => {
    const emptyData = {
      categories: [],
    };

    mockedApolloClient.query.mockResolvedValueOnce(createMockResult(emptyData));

    const { result } = renderHook(() => useCategories('177577', 50), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
    expect(result.current.articles).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.hasMore).toBe(true); // totalCount is null
  });

  it('prevents loadMore when already loading', async () => {
    // Mock initial data
    mockedApolloClient.query.mockResolvedValueOnce(
      createMockResult(mockCategoriesData)
    );

    const { result } = renderHook(() => useCategories('177577', 50), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Mock a slow loadMore response
    let resolveLoadMore!: (value: any) => void;
    const loadMorePromise = new Promise((resolve) => {
      resolveLoadMore = resolve;
    });
    mockedApolloClient.query.mockReturnValue(loadMorePromise as any);

    // Call loadMore
    act(() => {
      result.current.loadMore();
    });
    expect(result.current.loading).toBe(true);

    // Call loadMore again while still loading
    const queryCallCount = mockedApolloClient.query.mock.calls.length;
    act(() => {
      result.current.loadMore();
    });

    // Should not make another API call
    expect(mockedApolloClient.query.mock.calls.length).toBe(queryCallCount);

    // Clean up
    resolveLoadMore(createMockResult(mockLoadMoreData));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('handles loadMore error correctly', async () => {
    // Mock initial successful data
    mockedApolloClient.query.mockResolvedValueOnce(
      createMockResult(mockCategoriesData)
    );

    const { result } = renderHook(() => useCategories('177577', 50), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Mock loadMore error
    const loadMoreError = new Error('LoadMore failed');
    mockedApolloClient.query.mockRejectedValueOnce(loadMoreError);

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.error).toBe(loadMoreError);
    });

    expect(result.current.loading).toBe(false);
    // Original articles should remain
    expect(result.current.articles).toHaveLength(2);
  });

  it('calls Apollo client with correct variables', async () => {
    mockedApolloClient.query.mockResolvedValueOnce(
      createMockResult(mockCategoriesData)
    );

    renderHook(() => useCategories('test-id', 25), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockedApolloClient.query).toHaveBeenCalledWith({
        query: GET_CATEGORIES,
        variables: { ids: ['test-id'], first: 25, offset: 0 },
        fetchPolicy: 'network-only',
      });
    });
  });

  it('refetches data when parameters change', async () => {
    mockedApolloClient.query.mockResolvedValue(
      createMockResult(mockCategoriesData)
    );

    const { result, rerender } = renderHook(
      ({ id, first }) => useCategories(id, first),
      {
        wrapper: createWrapper(),
        initialProps: { id: 'id1', first: 10 },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedApolloClient.query).toHaveBeenCalledTimes(1);

    // Change parameters
    rerender({ id: 'id2', first: 20 });

    await waitFor(() => {
      expect(mockedApolloClient.query).toHaveBeenCalledTimes(2);
    });

    expect(mockedApolloClient.query).toHaveBeenLastCalledWith({
      query: GET_CATEGORIES,
      variables: { ids: ['id2'], first: 20, offset: 0 },
      fetchPolicy: 'network-only',
    });
  });
});
