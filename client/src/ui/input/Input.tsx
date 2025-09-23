import React from 'react';
import styled from '@emotion/styled';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const StyledInput = styled.input`
  padding: 10px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.12);
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
    opacity: 1;
  }
`;

const Input: React.FC<InputProps> = (props) => <StyledInput {...props} />;

export default Input;
