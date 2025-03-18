import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RpaPortal from "./RpaPortal";
import TokenHandler from "./pages/login/TokenHandler";
import Login from "./pages/login/Login";
import IsLogin from "./pages/mainContent/IsLogin";
import ChooseOrgNTenant from "./pages/login/ChooseOrgNTenant";
import "./CSS/admin.scss";
import Snackbar from "./components/common/Snackbar";
import { LoadingBackdrop } from "./components/AdminComponents/uiComponents/index";
import { createTheme, ThemeProvider } from '@mui/material/styles';
function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isLoading = useSelector((state) => state.view.isLoading);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("persist:user")) || {};
    const token = storedUser.token || null;

    if (token && token !== "null") {
      dispatch({
        type: "STORE_USER",
        payload: { token: token.replace(/["\\]/g, "") },
      });
    }

    setIsInitialized(true);
  }, [dispatch]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }
  const theme = createTheme({
    // typography: {
    //   fontSize: 12, // 默認字體大小
    // },
  });

  return (
    <ThemeProvider theme={theme}>
    <Router>
      <TokenHandler />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/isLogin" element={<IsLogin />} />
        <Route path="/orgNTenant" element={<ChooseOrgNTenant />} />
        {/* 根路由 */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <RpaPortal />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* 404 頁面 */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
      <Snackbar />
      <LoadingBackdrop open={isLoading}></LoadingBackdrop>
    </Router>
    </ThemeProvider>
  );
}

export default App;
