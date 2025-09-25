import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import theme from '../../theme/theme';
import ProductSearch from './ProductSearch';

const renderProductSearch = () => {
  return render(
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <ProductSearch />
      </I18nextProvider>
    </ThemeProvider>
  );
};

describe('ProductSearch', () => {
  it('renders search input with translated placeholder', () => {
    renderProductSearch();

    const searchInput = screen.getByPlaceholderText('Wonach suchst du?');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders input element with proper role', () => {
    renderProductSearch();

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => renderProductSearch()).not.toThrow();
  });
});
