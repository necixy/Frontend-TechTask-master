import { useCallback, useEffect, useState } from 'react';
import { apolloClient } from '../services/apollo/client';
import { GET_CATEGORIES } from '../services/apollo/queries';
import { Category, Article } from '../types/types';

interface UseCategoriesResult {
  categories: Category[];
  articles: Article[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
}

export const useCategories = (
  ids: string,
  first: number
): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // Fetch initial categories and articles
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    apolloClient
      .query({
        query: GET_CATEGORIES,
        variables: { ids: [ids], first, offset: 0 },
        fetchPolicy: 'network-only',
      })
      .then(({ data }) => {
        if (!isMounted) return;
        if (data?.categories?.length) {
          setCategories(data.categories);
          setArticles(data.categories[0].categoryArticles.articles);
          setTotalCount(data.categories[0].articleCount);
        }
      })
      .catch((e) => {
        if (isMounted) setError(e);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [ids, first]);

  // Load more articles
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
        if (data?.categories?.length) {
          setArticles((prev) => {
            const seen = new Set(prev.map((a) => a.name + a.variantName));
            return [
              ...prev,
              ...data.categories[0].categoryArticles.articles.filter(
                (a: any) => !seen.has(a.name + a.variantName)
              ),
            ];
          });
        }
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [ids, first, articles, loading]);

  const hasMore = totalCount === null ? true : articles.length < totalCount;

  return {
    categories,
    articles,
    loading,
    error,
    hasMore,
    loadMore,
  };
};
