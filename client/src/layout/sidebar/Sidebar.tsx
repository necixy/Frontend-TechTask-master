import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const SidebarContainer = styled.div`
  grid-area: sidebar;
  background-color: lavender;
`;

const CategoryList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const CategoryListItem = styled.li`
  margin: 0 0 0 8px;
  padding: 8px 0;
`;

type Category = {
  name: string;
  urlPath: string;
  id: string;
};

type SidebarProps = {
  categories: Category[];
};

const Sidebar: React.FC<SidebarProps> = ({ categories }) => (
  <SidebarContainer>
    <h3>Kategorien</h3>
    {categories.length ? (
      <CategoryList>
        {categories.map(({ name, urlPath, id }, index) => (
          <CategoryListItem key={index}>
            <Link to={`/${urlPath}`}>
              {name} (id: {id})
            </Link>
          </CategoryListItem>
        ))}
      </CategoryList>
    ) : (
      'Loading...'
    )}
  </SidebarContainer>
);

export default Sidebar;
