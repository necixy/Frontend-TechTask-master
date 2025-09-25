const React = require('react');

module.exports = {
  Link: ({ children, ...props }) => React.createElement('a', props, children),
  BrowserRouter: ({ children }) => React.createElement('div', {}, children),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  useParams: () => ({}),
};
