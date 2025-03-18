import React, { useEffect } from "react";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import TaskInfo from './components/AdminComponents/uiComponents/TaskInfo';
import LicenseApply from './components/AdminComponents/uiComponents/LicenseApply';
import PermissionMgt from './components/AdminComponents/uiComponents/PermissionMgt';
import AutoApprovedMgt from './components/AdminComponents/uiComponents/AutoApprovedMgt';
import LicenseMgt from './components/AdminComponents/uiComponents/LicenseMgt';
import ClippedDrawer from './ClippedDrawer';
import UserDropdown from './components/common/UserDropdown';
import LocaleDropdown from './components/common/LocaleDropdown';
import SvgIcon from '@mui/material/SvgIcon';
import { logoW } from '../src/assets/images/index';
import '../src/CSS/adminPage.scss';
import pjson from '../package.json';
import moment from 'moment';
import { useSelector } from "react-redux";
import ProtectedRoute from './ProtectedRoute'; // 導入 ProtectedRoute 組件
import "./CSS/admin.scss";
import { createTheme, ThemeProvider } from '@mui/material/styles';
export default function RpaPortal(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const orgNTenantOrg = useSelector((state) => state.view.orgNTenantOrg);
  const user = useSelector((state) => state.user.user);
  const role = useSelector((state) => state.user.role);
  const userKey = useSelector((state) => state.user.userKey);
  const isAdminPath = location.pathname.startsWith("/admin");

  function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }

  useEffect(() => {
    //除了首頁，其他情況根據以下情況默認打開
    if (location.pathname === '/') {
      if (!orgNTenantOrg) {
        navigate("/orgNTenant", { replace: true });
      }
      if (role.includes("IT_ADMIN") && userKey.length === 0) {
        navigate("/admin/permission-mgt", { replace: true });
      } else if (role.includes("IT_ADMIN") && userKey.length !== 0) {
        navigate("/admin/license-mgt", { replace: true });
      } else if (role.includes("ADMIN")) {
        navigate("/admin/license-mgt", { replace: true });
      } else {
        navigate("/task-info", { replace: true });
      }
    }
  }, [location.pathname, orgNTenantOrg, role, navigate]);

  const breadcrumbs = [
    <Link
      key="home"
      component={RouterLink}
      to="/"
      color="inherit"
      underline="hover"
    >
      <HomeIcon color="primary" />
    </Link>,
    location.pathname.includes('task-info') && (
      <Typography key="task-info" color="text.primary">
        Task Info
      </Typography>
    ),
    location.pathname.includes('license-apply') && (
      <Typography key="license-apply" color="text.primary">
        License Apply
      </Typography>
    ),
    location.pathname.includes('admin') && (
      <Typography key="admin" color="text.primary">
        Admin Console
      </Typography>
    ),
  ].filter(Boolean);

  const backToHome = () => {
    if (role.includes("IT_ADMIN") && userKey.length === 0) {
      return
    }
    navigate("/task-info", { replace: true });
  };

  const theme = createTheme({
    // typography: {
    //   fontSize: 12, // 默認字體大小
    // },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '45px' }}>
          <Toolbar
            sx={{
              minHeight: '40px !important',//關鍵
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: '0 16px',
              '& > *': {
                height: '45px',
                display: 'flex',
                alignItems: 'center'
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: (role.includes("IT_ADMIN") && userKey.length === 0) ? null : 'pointer',
                // borderRadius: '4px',
                '&:hover': (role.includes("IT_ADMIN") && userKey.length === 0) ? null : {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
              onClick={backToHome}
            >
              <img
                src={logoW}
                alt="language"
                width="80"
                height="45"
                style={{ marginRight: '8px', paddingBottom: '12px' }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: '#fff',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: 1,
                }}
              >
                PRA Portal
              </Typography>
            </Box>
            {!isAdminPath && (
              <Box sx={{ display: 'flex', marginLeft: '8px' }}>
                <Typography
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    height: '45px',
                    backgroundColor: location.pathname === '/task-info' ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    padding: '0 8px' // 使用 padding 替代 marginRight
                  }}
                  onClick={() => navigate('/task-info')}
                >
                  Task Info
                </Typography>
                <Typography
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    height: '45px',
                    backgroundColor: location.pathname === '/license-apply' ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    padding: '0 8px' // 使用 padding 替代 marginRight
                  }}
                  onClick={() => navigate('/license-apply')}
                >
                  License Apply
                </Typography>
              </Box>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', height: '45px' }}>
              <Box
                sx={{
                  // borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center', // 确保内部元素垂直居中
                  height: '45px',
                }}
              >
                <UserDropdown />
              </Box>
              <Box
                sx={{
                  // borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center', // 确保内部元素垂直居中
                  height: '45px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                <LocaleDropdown {...props} />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: '#f4f6f8',
            paddingTop: '45px',
          }}
        >
          {!isAdminPath ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '16px',
                marginTop: '16px',
              }}
            >
              <Breadcrumbs aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>
            </Box>
          ) : null}
          <Routes>
            <Route
              path="/admin/*"
              element={<ProtectedRoute roles={['IT_ADMIN', 'ADMIN']} />}
            >
              <Route path="license-apply" element={<LicenseApply />} />
              <Route path="auto-approved" element={<AutoApprovedMgt />} />
              <Route path="permission-mgt" element={<PermissionMgt />} />
              <Route
                path="license-mgt"
                element={<LicenseMgt />}
              />
            </Route>
            <Route path="/" element={<TaskInfo />} />
            <Route path="/task-info" element={<TaskInfo />} />
            <Route path="/license-apply" element={<LicenseApply isAdmin={false} />} />
          </Routes>
        </Box>
        <Box
          component="footer"
          sx={{
            backgroundColor: '#f4f4f4',
            padding: '10px 16px',
            textAlign: 'center',
            borderTop: '1px solid #ccc',
            mt: 'auto',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {moment().format('YYYY')} Delta IT. All Rights Reserved. / version {pjson.version}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}    