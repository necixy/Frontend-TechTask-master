import React from 'react';

const Error: React.FC<{ message: string }> = ({ message }) => (
  <div>Error: {message}</div>
);

export default Error;
