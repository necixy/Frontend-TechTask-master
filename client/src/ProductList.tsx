import React from 'react';

import { Article } from './types';
import './ProductList.css';
import { useCategories } from './hooks/useCategories';

export const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

export var ArticleCard = ({ article }: { article: Article }) => {
  return (
    <div className={'article'}>
      <img src={article.images[0].path} alt={article.name} />
      <div>{article.name}</div>
      <div>{formatter.format(article.prices.regular.value / 100)}</div>
      <section role="button">Add to cart</section>
    </div>
  );
};

const DEFAULT_CATEGORY_ID = '156126';
const DEFAULT_FIRST = 100;

const ArticleList: React.FC = () => {
  const { categories, articles, loading, error } = useCategories(
    DEFAULT_CATEGORY_ID,
    DEFAULT_FIRST
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={'page'}>
      <div className={'header'}>
        <strong>home24</strong>
        <input placeholder={'Search'} />
      </div>

      <div className={'sidebar'}>
        <h3>Kategorien</h3>
        {categories.length ? (
          <ul>
            {categories[0].childrenCategories.list.map(
              (
                {
                  name,
                  urlPath,
                  id,
                }: { name: string; urlPath: string; id: string },
                index: number
              ) => {
                return (
                  <li key={index}>
                    <a href={`/${urlPath}`}>
                      {name} (id: {id})
                    </a>
                  </li>
                );
              }
            )}
          </ul>
        ) : (
          'Loading...'
        )}
      </div>

      <div className={'content'}>
        {categories.length ? (
          <h1>
            {categories[0].name}
            <small> ({categories[0].articleCount})</small>
          </h1>
        ) : (
          'Loading...'
        )}
        <div className={'articles'}>
          {articles.map((article: Article, index: number) => (
            <ArticleCard key={`${article.name}-${index}`} article={article} />
          ))}
        </div>
      </div>

      <div className={'footer'}>
        Alle Preise sind in Euro (€) inkl. gesetzlicher Umsatzsteuer und
        Versandkosten.
      </div>
    </div>
  );
};

var PLP = () => {
  return <ArticleList />;
};

export default PLP;
