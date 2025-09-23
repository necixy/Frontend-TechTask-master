import React from 'react';
import { Article } from '../../types/types';

export const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <div className={'article'}>
    <img src={article.images[0].path} alt={article.name} />
    <div>{article.name}</div>
    <div>{formatter.format(article.prices.regular.value / 100)}</div>
    <section role="button">Add to cart</section>
  </div>
);

export default ArticleCard;
