import React from 'react';
import styled from '@emotion/styled';

const StyledButton = styled.button`
  padding: 0.2em;
  background-color: lightgoldenrodyellow;
  border: 1px solid lightgray;
  cursor: pointer;
  text-align: center;
`;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <StyledButton {...props}>{children}</StyledButton>
);

export default Button;
