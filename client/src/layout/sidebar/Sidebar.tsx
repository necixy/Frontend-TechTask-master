import React from 'react';

type Category = {
  name: string;
  urlPath: string;
  id: string;
};

type SidebarProps = {
  categories: Category[];
};

const Sidebar: React.FC<SidebarProps> = ({ categories }) => (
  <div className={'sidebar'}>
    <h3>Kategorien</h3>
    {categories.length ? (
      <ul>
        {categories.map(({ name, urlPath, id }, index) => (
          <li key={index}>
            <a href={`/${urlPath}`}>
              {name} (id: {id})
            </a>
          </li>
        ))}
      </ul>
    ) : (
      'Loading...'
    )}
  </div>
);

export default Sidebar;
