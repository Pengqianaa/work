# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

如需更改登錄人的userKey和role
到UserReducer裡
case ACTIONS.SET_ROLE:
      return {
        ...state,
        role: payload.role,
        // role : ["IT_ADMIN"]
      };
case ACTIONS.SET_LOGIN_USER_KEY:
      return {
        ...state,
        userKey: payload?.data || '',
        // userKey:'123'
      };

如需更改菜單顯示
到ClippedDrawer裡
  const apiResponse = useSelector((state) => state.permission.menuList); // 從 Redux 獲取角色
  // const apiResponse = [
  //   { id: 2, perem: 'permissionMgt' },
  //   { id: 1, perem: 'autoApprovedMgt' },
  //   { id: 3, perem: 'licenseMgt' },
  //   { id: 4, perem: 'licenseApply' },
  // ];