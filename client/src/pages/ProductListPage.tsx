import React from 'react';
import styled from '@emotion/styled';
import { useCategories } from '../hooks/useCategories';
import PageLayout from '../layout/page-layout/PageLayout';
import Sidebar from '../layout/sidebar/Sidebar';
import ArticleGrid from '../product/article-grid/ArticleGrid';
import Loading from '../ui/loading/Loading';
import Error from '../ui/error/Error';
import Button from '../ui/button/Button';
import { useTranslation } from 'react-i18next';

const DEFAULT_CATEGORY_ID = '177577';
const DEFAULT_FIRST = 50;

const Content = styled.div`
  grid-area: content;
  grid-column: span 2;
  padding-bottom: 30px;
`;

const LoadMoreWrapper = styled.div`
  text-align: center;
  margin-top: 5rem;
`;

const ProductListPage: React.FC = () => {
  const { t } = useTranslation();
  const { categories, articles, loading, error, hasMore, loadMore } =
    useCategories(DEFAULT_CATEGORY_ID, DEFAULT_FIRST);

  if (error) return <Error message={error.message} />;

  return (
    <PageLayout
      sidebar={
        categories.length ? (
          <Sidebar categories={categories[0].childrenCategories.list} />
        ) : (
          <Loading />
        )
      }
      content={
        <Content>
          {categories.length ? (
            <h1>
              {categories[0].name}
              <small> ({categories[0].articleCount})</small>
            </h1>
          ) : (
            <Loading />
          )}
          <ArticleGrid articles={articles} />
          {/* Show Load More if there are more articles to load */}
          {hasMore && articles.length > 0 && (
            <LoadMoreWrapper>
              <Button onClick={loadMore} disabled={loading}>
                {loading ? t('loading') : t('loadMore')}
              </Button>
            </LoadMoreWrapper>
          )}
        </Content>
      }
    />
  );
};

export default ProductListPage;
