import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

const LoadingContainer = styled.div`
  text-align: center;
  padding: 120px;
`;

const Loading: React.FC = () => {
  const { t } = useTranslation();

  return <LoadingContainer>{t('loading')}</LoadingContainer>;
};

export default Loading;
