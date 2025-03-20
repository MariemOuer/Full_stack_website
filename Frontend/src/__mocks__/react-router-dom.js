// __mocks__/react-router-dom.js
module.exports = {
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  useNavigate: () => jest.fn(),
  Link: ({ children }) => children,
  Outlet: () => null,
};
