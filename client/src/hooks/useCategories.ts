import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../services/apollo/queries';
import { Category, Article } from '../types/types';

interface GetCategoriesData {
  categories: Category[];
}

interface UseCategoriesResult {
  categories: Category[];
  articles: Article[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useCategories = (
  ids: string,
  first: number
): UseCategoriesResult => {
  const { data, loading, error, refetch } = useQuery<GetCategoriesData>(
    GET_CATEGORIES,
    {
      variables: { ids: [ids], first },
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    }
  );

  const categories = data?.categories || [];
  const articles = categories.flatMap(
    (category) => category.categoryArticles.articles
  );

  return {
    categories,
    articles,
    loading,
    error: error || null,
    refetch,
  };
};
