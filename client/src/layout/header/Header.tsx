import React from 'react';
import styled from '@emotion/styled';

import ProductSearch from '../../product/product-search/ProductSearch';
import logoSvg from '../../assets/home-24-logo.svg';

const HeaderContainer = styled.header`
  grid-area: header;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 16px;
`;

const Logo = styled.img`
  height: 32px;
  vertical-align: middle;
`;

const Header: React.FC = () => (
  <HeaderContainer>
    <Logo src={logoSvg} alt="Logo" />
    <ProductSearch />
  </HeaderContainer>
);

export default Header;
