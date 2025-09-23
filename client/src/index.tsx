import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';

import './index.css';
import ProductListPage from './pages/ProductListPage';
import { apolloClient } from './services/apollo/client';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <ProductListPage />
    </ApolloProvider>
  </React.StrictMode>
);
