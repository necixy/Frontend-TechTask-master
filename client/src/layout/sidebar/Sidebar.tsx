import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loading from '../../ui/loading/Loading';

const SidebarContainer = styled.div`
  grid-area: sidebar;
  width: 180px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 2px 0 16px 0 rgba(60, 60, 60, 0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
`;

const SidebarTitle = styled.h3`
  margin-bottom: 24px;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.5px;
`;

const CategoryList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
`;

const CategoryListItem = styled.li`
  margin: 0 0 8px 0;
  padding: 0;
  border-radius: 8px;
  transition: background 0.2s;
  a {
    display: block;
    padding: 12px 16px;
    color: #222;
    text-decoration: none;
    font-weight: 500;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

type Category = {
  name: string;
  urlPath: string;
  id: string;
};

type SidebarProps = {
  categories: Category[];
};

const Sidebar: React.FC<SidebarProps> = ({ categories }) => {
  const { t } = useTranslation();

  return (
    <SidebarContainer>
      <SidebarTitle>{t('categories')}</SidebarTitle>
      {categories.length ? (
        <CategoryList>
          {categories.map(({ name, urlPath, id }) => (
            <CategoryListItem key={id}>
              <Link to={`/${urlPath}`}>{name}</Link>
            </CategoryListItem>
          ))}
        </CategoryList>
      ) : (
        <Loading />
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
