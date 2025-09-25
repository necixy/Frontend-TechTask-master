import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@emotion/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import ArticleCard from './ArticleCard';
import theme from '../../theme/theme';
import { Article } from '../../types/types';

// Initialize i18n for testing
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        addToCart: 'Add to Cart',
      },
    },
  },
});

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  </ThemeProvider>
);

// Mock article data
const mockArticle: Article = {
  name: 'Comfortable Sofa',
  variantName: 'Gray Fabric',
  prices: {
    currency: 'EUR',
    regular: {
      value: 89900, // 899.00 EUR in cents
    },
  },
  images: [
    { path: '/images/sofa-gray.jpg' },
    { path: '/images/sofa-gray-2.jpg' },
  ],
};

describe('ArticleCard', () => {
  it('displays article image with correct src and alt text', () => {
    render(<ArticleCard article={mockArticle} />, { wrapper: TestWrapper });

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/sofa-gray.jpg');
    expect(image).toHaveAttribute('alt', 'Comfortable Sofa');
  });

  it('displays article name correctly', () => {
    render(<ArticleCard article={mockArticle} />, { wrapper: TestWrapper });

    expect(screen.getByText('Comfortable Sofa')).toBeInTheDocument();
  });

  it('formats and displays price correctly from cents to euros', () => {
    render(<ArticleCard article={mockArticle} />, { wrapper: TestWrapper });

    // Price should be formatted as German locale currency (899,00 €)
    expect(screen.getByText('899,00 €')).toBeInTheDocument();
  });

  it('renders add to cart button', () => {
    render(<ArticleCard article={mockArticle} />, { wrapper: TestWrapper });

    const addToCartButton = screen.getByRole('button', {
      name: /add to cart/i,
    });
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).toBeEnabled();
  });

  it('handles add to cart button click', async () => {
    const user = userEvent.setup();
    render(<ArticleCard article={mockArticle} />, { wrapper: TestWrapper });

    const addToCartButton = screen.getByRole('button', {
      name: /add to cart/i,
    });

    // Click should not throw error (no handler implemented yet, but button should be clickable)
    await user.click(addToCartButton);
    expect(addToCartButton).toBeInTheDocument();
  });

  it('uses first image when multiple images available', () => {
    const articleWithMultipleImages: Article = {
      ...mockArticle,
      images: [
        { path: '/images/first-image.jpg' },
        { path: '/images/second-image.jpg' },
        { path: '/images/third-image.jpg' },
      ],
    };

    render(<ArticleCard article={articleWithMultipleImages} />, {
      wrapper: TestWrapper,
    });

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/images/first-image.jpg');
  });

  it('handles different price values correctly', () => {
    const expensiveArticle: Article = {
      ...mockArticle,
      name: 'Luxury Sofa',
      prices: {
        currency: 'EUR',
        regular: {
          value: 299999, // 2999.99 EUR in cents
        },
      },
    };

    render(<ArticleCard article={expensiveArticle} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText('2.999,99 €')).toBeInTheDocument();
  });

  it('handles small price values correctly', () => {
    const cheapArticle: Article = {
      ...mockArticle,
      name: 'Budget Item',
      prices: {
        currency: 'EUR',
        regular: {
          value: 1250, // 12.50 EUR in cents
        },
      },
    };

    render(<ArticleCard article={cheapArticle} />, { wrapper: TestWrapper });

    expect(screen.getByText('12,50 €')).toBeInTheDocument();
  });

  it('handles zero price correctly', () => {
    const freeArticle: Article = {
      ...mockArticle,
      name: 'Free Sample',
      prices: {
        currency: 'EUR',
        regular: {
          value: 0, // Free item
        },
      },
    };

    render(<ArticleCard article={freeArticle} />, { wrapper: TestWrapper });

    expect(screen.getByText('0,00 €')).toBeInTheDocument();
  });

  it('renders with proper card structure', () => {
    render(<ArticleCard article={mockArticle} />, { wrapper: TestWrapper });

    // Check that all main elements are present in the card
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('Comfortable Sofa')).toBeInTheDocument();
    expect(screen.getByText('899,00 €')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  it('handles long article names gracefully', () => {
    const longNameArticle: Article = {
      ...mockArticle,
      name: 'This is a very long article name that should be handled gracefully by the component without breaking the layout',
    };

    render(<ArticleCard article={longNameArticle} />, { wrapper: TestWrapper });

    expect(
      screen.getByText(/this is a very long article name/i)
    ).toBeInTheDocument();
  });
});
