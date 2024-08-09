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
import ChatRoom from "./pages/ChatRoom";
import Search from "./pages/SearchPage";
import SearchForm from "./components/SearchForm";
import SearchShorts from "./pages/SearchShortsPage";
import SearchLive from "./pages/SearchLivePage";
import PrivateRoute from "./components/PrivateRoute";
import OpenVideo from "./components/OpenVideo";
import Shorts from "./pages/ShortsPage";
import AddressSearch from "./pages/AddressSearch";
import BuyList from "./features/mypage/components/BuyList";
import SellList from "./features/mypage/components/SellList";
import WatchList from "./features/mypage/components/WatchList";
import ProfileEdit from "./pages/ProfileEdit";
import Notification from "./pages/NotificationPage";

const routes = [
  {
    path: "/",
    element: <HomePage />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/notifications",
    element: <Notification />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  { path: "/login", element: <LoginPage />, isPrivate: false },
  { path: "/check", element: <CheckLogin />, isPrivate: false },
  {
    path: "/initial",
    element: <Initial />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/welcome",
    element: <WelcomePage />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/category",
    element: <Category />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/search",
    element: <Search />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/chat",
    element: <Chat />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/chat/:chatID",
    element: <ChatRoom />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/mypage",
    element: <MyPage />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/mypage/buy-list",
    element: <BuyList />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/mypage/sell-list",
    element: <SellList />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/mypage/watch-list",
    element: <WatchList />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/address-search",
    element: <AddressSearch />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/search/shorts",
    element: <SearchShorts />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/search/live",
    element: <SearchLive />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  {
    path: "/profile-edit/:email",
    element: <ProfileEdit />,
    isPrivate: process.env.REACT_APP_LOGIN_BOOL === "true",
  },
  
];

function App() {
  const LocationWrapper = ({ children }) => {
    const location = useLocation();
    const isLoginPage =
      location.pathname === "/login" ||
      location.pathname === "/initial" ||
      location.pathname === "/welcome" ||
      location.pathname === "/address-search" ||
      location.pathname.startsWith("/live/") ||
      location.pathname.startsWith("/shorts/");
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
          <Route path={"/shorts/:shortsId"} element={<Shorts />}></Route>
        </Routes>
      </LocationWrapper>
    </Router>
  );
}

export default App;
