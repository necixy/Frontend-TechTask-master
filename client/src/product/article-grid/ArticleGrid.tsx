import React from 'react';
import { Article } from '../../types/types';
import ArticleCard from '../article-card/ArticleCard';

type ArticleGridProps = {
  articles: Article[];
};

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => (
  <div className={'articles'}>
    {articles.map((article, index) => (
      <ArticleCard key={`${article.name}-${index}`} article={article} />
    ))}
  </div>
);

export default ArticleGrid;
