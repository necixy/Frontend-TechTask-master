import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import theme from '../../theme/theme';
import CategoryList from './CategoryList';

// Category type matching the component's local definition
type Category = {
  name: string;
  urlPath: string;
  id: string;
};

// Mock categories data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    urlPath: 'electronics',
  },
  {
    id: '2',
    name: 'Clothing',
    urlPath: 'clothing',
  },
  {
    id: '3',
    name: 'Home & Garden',
    urlPath: 'home-garden',
  },
];

const renderCategoryList = (categories: Category[] = mockCategories) => {
  return render(
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <CategoryList categories={categories} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

describe('CategoryList', () => {
  it('renders a list of categories', () => {
    renderCategoryList();

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders each category as a link with correct href', () => {
    renderCategoryList();

    const electronicsLink = screen.getByRole('link', { name: /electronics/i });
    expect(electronicsLink).toHaveAttribute('href', '/electronics');

    const clothingLink = screen.getByRole('link', { name: /clothing/i });
    expect(clothingLink).toHaveAttribute('href', '/clothing');

    const homeGardenLink = screen.getByRole('link', { name: /home & garden/i });
    expect(homeGardenLink).toHaveAttribute('href', '/home-garden');
  });

  it('displays category names correctly', () => {
    renderCategoryList();

    expect(screen.getByText(/electronics.*\(id: 1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/clothing.*\(id: 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/home & garden.*\(id: 3\)/i)).toBeInTheDocument();
  });

  it('displays category IDs correctly', () => {
    renderCategoryList();

    expect(screen.getByText(/electronics.*\(id: 1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/clothing.*\(id: 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/home & garden.*\(id: 3\)/i)).toBeInTheDocument();
  });

  it('renders empty list when no categories provided', () => {
    renderCategoryList([]);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toBeEmptyDOMElement();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('handles single category correctly', () => {
    const singleCategory = [mockCategories[0]];
    renderCategoryList(singleCategory);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /electronics/i })).toHaveAttribute(
      'href',
      '/electronics'
    );
  });

  it('renders categories with special characters in names', () => {
    const specialCategories: Category[] = [
      {
        id: '1',
        name: 'Books & Media',
        urlPath: 'books-media',
      },
      {
        id: '2',
        name: 'Sports/Outdoors',
        urlPath: 'sports-outdoors',
      },
    ];

    renderCategoryList(specialCategories);

    expect(screen.getByText(/books & media.*\(id: 1\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/sports\/outdoors.*\(id: 2\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /books & media/i })
    ).toHaveAttribute('href', '/books-media');
    expect(
      screen.getByRole('link', { name: /sports\/outdoors/i })
    ).toHaveAttribute('href', '/sports-outdoors');
  });

  it('handles categories with long names', () => {
    const longNameCategories: Category[] = [
      {
        id: '1',
        name: 'Very Long Category Name That Might Wrap',
        urlPath: 'long-category',
      },
    ];

    renderCategoryList(longNameCategories);

    expect(
      screen.getByText(/very long category name that might wrap.*\(id: 1\)/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/long-category');
  });

  it('renders categories with numeric IDs correctly', () => {
    const numericIdCategories: Category[] = [
      {
        id: '100',
        name: 'Category 100',
        urlPath: 'category-100',
      },
      {
        id: '999',
        name: 'Category 999',
        urlPath: 'category-999',
      },
    ];

    renderCategoryList(numericIdCategories);

    expect(screen.getByText(/category 100.*\(id: 100\)/i)).toBeInTheDocument();
    expect(screen.getByText(/category 999.*\(id: 999\)/i)).toBeInTheDocument();
  });

  it('maintains correct link accessibility attributes', () => {
    renderCategoryList();

    const links = screen.getAllByRole('link');

    links.forEach((link) => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).toMatch(/^\//); // Should start with /
    });
  });

  it('preserves category order', () => {
    renderCategoryList();

    const listItems = screen.getAllByRole('listitem');

    // First item should contain Electronics
    expect(listItems[0]).toHaveTextContent('Electronics (id: 1)');

    // Second item should contain Clothing
    expect(listItems[1]).toHaveTextContent('Clothing (id: 2)');

    // Third item should contain Home & Garden
    expect(listItems[2]).toHaveTextContent('Home & Garden (id: 3)');
  });
});
