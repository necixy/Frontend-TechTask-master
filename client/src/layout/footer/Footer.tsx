import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

const FooterContainer = styled.footer`
  grid-area: footer;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 16px;
`;

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return <FooterContainer>{t('footerText')}</FooterContainer>;
};

export default Footer;
