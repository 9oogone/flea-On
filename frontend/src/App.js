import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
// import { checkLoginStatus } from "./features/auth/actions";
import BottomAppBar from "./components/BottomAppBar";
import CheckLogin from "./features/auth/components/CheckLogin";
function App() {
  // const dispatch = useDispatch();

  // // useEffect(() => {
  // //   dispatch(checkLoginStatus());
  // // }, [dispatch]);

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
          <Route path="/check" element={<CheckLogin />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<HomePage />} />
        </Routes>
      </LocationWrapper>
    </Router>
  );
}

export default App;
