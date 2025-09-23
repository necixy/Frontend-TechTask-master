import React from 'react';
import Input from '../../ui/input/Input';
import { useTranslation } from 'react-i18next';

const ProductSearch: React.FC = () => {
  const { t } = useTranslation();

  return <Input placeholder={t('search')} />;
};

export default ProductSearch;
