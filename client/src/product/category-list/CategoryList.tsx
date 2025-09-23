import React from 'react';

type Category = {
  name: string;
  urlPath: string;
  id: string;
};

type CategoryListProps = {
  categories: Category[];
};

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => (
  <ul>
    {categories.map(({ name, urlPath, id }, index) => (
      <li key={index}>
        <a href={`/${urlPath}`}>
          {name} (id: {id})
        </a>
      </li>
    ))}
  </ul>
);

export default CategoryList;
