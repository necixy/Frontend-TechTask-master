import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';

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
  <div className={'page'}>
    {header}
    {sidebar}
    {content}
    {footer}
  </div>
);

export default PageLayout;
