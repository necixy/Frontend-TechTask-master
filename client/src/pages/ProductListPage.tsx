import React from 'react';
import { useCategories } from '../hooks/useCategories';
import PageLayout from '../layout/page-layout/PageLayout';
import Sidebar from '../layout/sidebar/Sidebar';
import ArticleGrid from '../product/article-grid/ArticleGrid';
import Loading from '../ui/loading/Loading';
import Error from '../ui/error/Error';
import './ProductListPage.css';

const DEFAULT_CATEGORY_ID = '156126';
const DEFAULT_FIRST = 100;

const ProductListPage: React.FC = () => {
  const { categories, articles, loading, error } = useCategories(
    DEFAULT_CATEGORY_ID,
    DEFAULT_FIRST
  );

  if (loading) return <Loading />;
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
        <div className={'content'}>
          {categories.length ? (
            <h1>
              {categories[0].name}
              <small> ({categories[0].articleCount})</small>
            </h1>
          ) : (
            <Loading />
          )}
          <ArticleGrid articles={articles} />
        </div>
      }
    />
  );
};

export default ProductListPage;
