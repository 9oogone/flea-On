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
import BottomAppBar from "./components/BottomAppBar";
import MyPage from "./pages/MyPage";
import Category from "./pages/CategoryPage";
import Search from "./pages/SearchPage";
import SearchForm from "./components/SearchForm";
function App() {
  // 로그인 페이지가 아닌 경우에만 하단 앱 바를 표시
  const LocationWrapper = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/check" element={<CheckLogin />} />
          <Route path="/category" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </LocationWrapper>
    </Router>
  );
}

export default App;
