import React from 'react';
import styled from '@emotion/styled';
import { Article } from '../../types/types';
import Button from '../../ui/button/Button';
import { useTranslation } from 'react-i18next';

const ArticleContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;
`;

const ArticleImage = styled.img`
  margin-top: auto;
  margin-bottom: auto;
`;

export const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const { t } = useTranslation();

  return (
    <ArticleContainer>
      <ArticleImage src={article.images[0].path} alt={article.name} />
      <div>{article.name}</div>
      <div>{formatter.format(article.prices.regular.value / 100)}</div>
      <Button>{t('addToCart')}</Button>
    </ArticleContainer>
  );
};

export default ArticleCard;
