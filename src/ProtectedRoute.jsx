import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClippedDrawer from './ClippedDrawer';

const ProtectedRoute = ({ roles }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const role = useSelector((state) => state.user.role);
  const userKey = useSelector((state) => state.user.userKey);
  const orgNTenantOrg = useSelector((state) => state.view.orgNTenantOrg);

  // 1. 強制檢查組織信息
  if (!orgNTenantOrg) {
    return <Navigate to="/orgNTenant" replace state={{ from: location }} />;
  }

  // 2. 檢查登錄狀態
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. 權限分類處理
  const isAdminPath = location.pathname.startsWith("/admin");

  // 如果是 admin 路徑且不具備權限
  if (isAdminPath && !roles.some(r => role.includes(r))) {
    return <Navigate to="/unauthorized" replace />;
  }
  // 4. IT_ADMIN 的 userKey 邏輯（精確控制）
  if (role.includes("IT_ADMIN")) {
    let allowedAdminPaths = [];
    let isAllowedPath = []
    if (userKey.length === 0) {
      // 定義允許訪問的 admin 路徑白名單
      allowedAdminPaths = ['permission-mgt', 'auto-approved'];
      isAllowedPath = allowedAdminPaths.some(path =>
        location.pathname.includes(path)
      );
      // 如果是非 admin 路徑 或 不在白名單中的 admin 路徑
      if (!isAdminPath || !isAllowedPath) {
        return <Navigate to="/admin/permission-mgt" replace />;
      }
    } else {
      // 定義允許訪問的 admin 路徑白名單
      allowedAdminPaths = ['license-apply', 'permission-mgt', 'auto-approved', 'license-mgt'];
      isAllowedPath = allowedAdminPaths.some(path =>
        location.pathname.includes(path)
      );
      if (!isAdminPath || !isAllowedPath) {
        return <Navigate to="/admin/license-mgt" replace />;
      }
    }
  }

  // 5. ADMIN 強制跳轉到 license-apply
  if (role.includes("ADMIN") && !location.pathname.includes("license-apply")) {
    let allowedAdminPaths = ['license-apply', 'permission-mgt', 'auto-approved', 'license-mgt'];
    let isAllowedPath = allowedAdminPaths.some(path =>
      location.pathname.includes(path)
    );
    if (!isAdminPath || !isAllowedPath) {
      return <Navigate to="/admin/license-mgt" replace />;
    }
  }

  // 6. 普通用戶禁止訪問 admin 路徑
  if (isAdminPath && !role.includes("ADMIN") && !role.includes("IT_ADMIN")) {
    return <Navigate to="/task-info" replace />;
  }

  // 所有檢查通過後渲染子路由
  return (
    <ClippedDrawer>
      <Outlet /> {/* 这将渲染匹配的嵌套路由 */}
    </ClippedDrawer>
  );
};

export default ProtectedRoute;