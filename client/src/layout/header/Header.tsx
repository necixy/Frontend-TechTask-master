import React from 'react';
import Input from '../../ui/input/Input';

const Header: React.FC = () => (
  <div className={'header'}>
    <strong>home24</strong>
    <Input placeholder={'Search'} />
  </div>
);

export default Header;
