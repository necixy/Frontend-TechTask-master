import React from 'react';
import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  grid-area: footer;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 16px;
`;

const Footer: React.FC = () => (
  <FooterContainer>
    Alle Preise sind in Euro (€) inkl. gesetzlicher Umsatzsteuer und
    Versandkosten.
  </FooterContainer>
);

export default Footer;
