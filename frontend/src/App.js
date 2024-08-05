import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CheckLogin from "./features/auth/components/CheckLogin";
import Initial from "./pages/InitialPage";
import WelcomePage from "./pages/WelcomePage";
import BottomAppBar from "./components/BottomAppBar";
import MyPage from "./pages/MyPage";
import Category from "./pages/CategoryPage";
import Chat from "./pages/ChatPage";
import Search from "./pages/SearchPage";
import SearchForm from "./components/SearchForm";
import SearchShorts from "./pages/SearchShortsPage";
import SearchLive from "./pages/SearchLivePage";
import PrivateRoute from "./components/PrivateRoute";
import OpenVideo from "./components/OpenVideo";
import AddressSearch from "./pages/AddressSearch"; // Import AddressSearch component

const routes = [
  { path: "/", element: <HomePage />, isPrivate: true },
  { path: "/login", element: <LoginPage />, isPrivate: false },
  { path: "/check", element: <CheckLogin />, isPrivate: false },
  { path: "/initial", element: <Initial />, isPrivate: true },
  { path: "/welcome", element: <WelcomePage />, isPrivate: true },
  { path: "/category", element: <Category />, isPrivate: true },
  { path: "/search", element: <Search />, isPrivate: true },
  { path: "/chat", element: <Chat />, isPrivate: true },
  { path: "/chat/:chatID", element: <Chat />, isPrivate: true },
  { path: "/mypage", element: <MyPage />, isPrivate: true },

  { path: "/search/shorts", element: <SearchShorts />, isPrivate: true },
  { path: "/search/live", element: <SearchLive />, isPrivate: true },
  { path: "/address-search", element: <AddressSearch />, isPrivate: false }, // Add AddressSearch route
];

function App() {
  const LocationWrapper = ({ children }) => {
    const location = useLocation();
    const isLoginPage =
      location.pathname === "/login" ||
      location.pathname === "/initial" ||
      location.pathname === "/welcome" ||
      location.pathname === "/address-search";
    const isSearchPage =
      location.pathname === "/" ||
      location.pathname === "/category" ||
      location.pathname === "/search";

    return (
      <div>
        {isSearchPage && <SearchForm />}
        <div style={{ flex: 1 }}>{children}</div>
        {!isLoginPage && <BottomAppBar />}
      </div>
    );
  };

  return (
    <Router>
      <LocationWrapper>
        <Routes>
          {routes.map((route) =>
            route.isPrivate ? (
              <Route
                key={route.path}
                path={route.path}
                element={<PrivateRoute element={route.element} />}
              />
            ) : (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            )
          )}
          <Route path={"/live/:sessionName"} element={<OpenVideo />}></Route>
        </Routes>
      </LocationWrapper>
    </Router>
  );
}

export default App;
