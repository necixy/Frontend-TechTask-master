import React from 'react';
import styled from '@emotion/styled';
import { Article } from '../../types/types';
import ArticleCard from '../article-card/ArticleCard';

type ArticleGridProps = {
  articles: Article[];
};

// Styled component using Emotion
const ArticlesContainer = styled.div`
  display: grid;
  grid-gap: 26px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => (
  <ArticlesContainer>
    {articles.map((article, index) => (
      <ArticleCard key={`${article.name}-${index}`} article={article} />
    ))}
  </ArticlesContainer>
);

export default ArticleGrid;
