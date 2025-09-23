import React from 'react';
import styled from '@emotion/styled';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr 1fr;
  grid-template-areas:
    'header header header'
    'sidebar content content'
    'footer footer footer';
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.background};
`;

export type PageLayoutProps = {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({
  header = <Header />,
  sidebar,
  content,
  footer = <Footer />,
}) => (
  <PageContainer>
    {header}
    {sidebar}
    {content}
    {footer}
  </PageContainer>
);

export default PageLayout;
