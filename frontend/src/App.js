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

function App() {
  // 로그인 페이지가 아닌 경우에만 하단 앱 바를 표시
  const LocationWrapper = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    return (
      <div>
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
          <Route path="/check" element={<CheckLogin />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </LocationWrapper>
    </Router>
  );
}

export default App;
