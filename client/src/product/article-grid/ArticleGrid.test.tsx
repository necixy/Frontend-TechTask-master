import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import ArticleGrid from './ArticleGrid';
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
const mockArticles: Article[] = [
  {
    name: 'Comfortable Sofa',
    variantName: 'Gray Fabric',
    prices: {
      currency: 'EUR',
      regular: {
        value: 89900, // 899.00 EUR in cents
      },
    },
    images: [{ path: '/images/sofa-gray.jpg' }],
  },
  {
    name: 'Coffee Table',
    variantName: 'Oak Wood',
    prices: {
      currency: 'EUR',
      regular: {
        value: 29900, // 299.00 EUR in cents
      },
    },
    images: [{ path: '/images/table-oak.jpg' }],
  },
  {
    name: 'Floor Lamp',
    variantName: 'Modern Style',
    prices: {
      currency: 'EUR',
      regular: {
        value: 12900, // 129.00 EUR in cents
      },
    },
    images: [{ path: '/images/lamp-modern.jpg' }],
  },
];

describe('ArticleGrid', () => {
  it('renders all articles when provided with article data', () => {
    render(<ArticleGrid articles={mockArticles} />, { wrapper: TestWrapper });

    // Check that all articles are rendered
    expect(screen.getByText('Comfortable Sofa')).toBeInTheDocument();
    expect(screen.getByText('Coffee Table')).toBeInTheDocument();
    expect(screen.getByText('Floor Lamp')).toBeInTheDocument();
  });

  it('renders correct number of article cards', () => {
    render(<ArticleGrid articles={mockArticles} />, { wrapper: TestWrapper });

    // Check that all images are present (one per article)
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);

    // Check that all add to cart buttons are present (one per article)
    const buttons = screen.getAllByRole('button', { name: /add to cart/i });
    expect(buttons).toHaveLength(3);
  });

  it('renders article prices correctly', () => {
    render(<ArticleGrid articles={mockArticles} />, { wrapper: TestWrapper });

    // Check that all prices are formatted correctly
    expect(screen.getByText('899,00 €')).toBeInTheDocument();
    expect(screen.getByText('299,00 €')).toBeInTheDocument();
    expect(screen.getByText('129,00 €')).toBeInTheDocument();
  });

  it('handles empty articles array', () => {
    render(<ArticleGrid articles={[]} />, { wrapper: TestWrapper });

    // No articles should be rendered
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders single article correctly', () => {
    const singleArticle = [mockArticles[0]];
    render(<ArticleGrid articles={singleArticle} />, { wrapper: TestWrapper });

    // Only one article should be rendered
    expect(screen.getByText('Comfortable Sofa')).toBeInTheDocument();
    expect(screen.getByText('899,00 €')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getAllByRole('button')).toHaveLength(1);

    // Other articles should not be present
    expect(screen.queryByText('Coffee Table')).not.toBeInTheDocument();
    expect(screen.queryByText('Floor Lamp')).not.toBeInTheDocument();
  });

  it('handles many articles without breaking layout', () => {
    // Create a large array of articles
    const manyArticles: Article[] = Array.from({ length: 12 }, (_, index) => ({
      name: `Article ${index + 1}`,
      variantName: `Variant ${index + 1}`,
      prices: {
        currency: 'EUR',
        regular: {
          value: (index + 1) * 1000, // Different prices
        },
      },
      images: [{ path: `/images/article-${index + 1}.jpg` }],
    }));

    render(<ArticleGrid articles={manyArticles} />, { wrapper: TestWrapper });

    // All articles should be rendered
    expect(screen.getAllByRole('img')).toHaveLength(12);
    expect(screen.getAllByRole('button')).toHaveLength(12);

    // Check first and last articles
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 12')).toBeInTheDocument();
  });

  it('uses correct keys for articles', () => {
    const { container } = render(<ArticleGrid articles={mockArticles} />, {
      wrapper: TestWrapper,
    });

    // Check that the grid container is rendered
    const gridContainer = container.firstChild;
    expect(gridContainer).toBeInTheDocument();

    // Check that child elements are present (ArticleCard components)
    expect(gridContainer).toHaveProperty('childNodes');
    expect(gridContainer?.childNodes).toHaveLength(3);
  });

  it('handles articles with missing optional data gracefully', () => {
    const articlesWithMissingData: Article[] = [
      {
        name: 'Basic Article',
        variantName: '',
        prices: {
          currency: 'EUR',
          regular: {
            value: 5000,
          },
        },
        images: [{ path: '/images/basic.jpg' }],
      },
    ];

    render(<ArticleGrid articles={articlesWithMissingData} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText('Basic Article')).toBeInTheDocument();
    expect(screen.getByText('50,00 €')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/images/basic.jpg');
  });

  it('maintains article order as provided', () => {
    render(<ArticleGrid articles={mockArticles} />, { wrapper: TestWrapper });

    // Get all article names in order
    const articleNames = screen.getAllByText(/Sofa|Table|Lamp/);

    // Should be in the order provided
    expect(articleNames[0]).toHaveTextContent('Comfortable Sofa');
    expect(articleNames[1]).toHaveTextContent('Coffee Table');
    expect(articleNames[2]).toHaveTextContent('Floor Lamp');
  });

  it('applies grid styling correctly', () => {
    const { container } = render(<ArticleGrid articles={mockArticles} />, {
      wrapper: TestWrapper,
    });

    const gridContainer = container.firstChild as HTMLElement;

    // Check that grid styling is applied
    expect(gridContainer).toHaveStyle({
      display: 'grid',
    });
  });

  it('handles duplicate article names with unique keys', () => {
    const duplicateArticles: Article[] = [
      {
        name: 'Same Name',
        variantName: 'Variant 1',
        prices: {
          currency: 'EUR',
          regular: { value: 10000 },
        },
        images: [{ path: '/images/item1.jpg' }],
      },
      {
        name: 'Same Name',
        variantName: 'Variant 2',
        prices: {
          currency: 'EUR',
          regular: { value: 20000 },
        },
        images: [{ path: '/images/item2.jpg' }],
      },
    ];

    render(<ArticleGrid articles={duplicateArticles} />, {
      wrapper: TestWrapper,
    });

    // Both articles should be rendered despite having the same name
    const sameNameElements = screen.getAllByText('Same Name');
    expect(sameNameElements).toHaveLength(2);

    // Different prices should be visible
    expect(screen.getByText('100,00 €')).toBeInTheDocument();
    expect(screen.getByText('200,00 €')).toBeInTheDocument();
  });
});
