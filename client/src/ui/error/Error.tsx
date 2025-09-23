import React from 'react';
import { useTranslation } from 'react-i18next';

const Error: React.FC<{ message: string }> = ({ message }) => {
  const { t } = useTranslation();

  return <div>{t('error', { message })}</div>;
};

export default Error;
