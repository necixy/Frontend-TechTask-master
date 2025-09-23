import React from 'react';
import styled from '@emotion/styled';

const StyledButton = styled.button`
  padding: 0.6em 1.4em;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.buttonBorder};
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 2px 8px 0 rgba(60, 60, 60, 0.06);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 4px 16px 0 rgba(25, 118, 210, 0.1);
    outline: none;
    transform: translateY(-2px) scale(1.03);
  }
`;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <StyledButton {...props}>{children}</StyledButton>
);

export default Button;
