import * as React from 'react';
import { useSelector } from 'react-redux'; // 引入 useSelector
import { useLocation } from 'react-router-dom'; // 引入 useLocation
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import { styled } from '@mui/system';

const drawerWidth = 240;

const CustomListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgb(129,146,161)',
  },
}));

const CustomListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
    fontSize: '13px',
    color: 'white',
  },
}));

const WhiteListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: 'white',
}));

const WrapperLink = React.forwardRef((props, ref) => (
  <RouterLink ref={ref} {...props} />
));

function ListItemLink({ to, icon, primary, isActive, ...rest }) {
  return (
    <CustomListItem
      component={WrapperLink}
      to={to}
      sx={{
        backgroundColor: isActive ? 'rgb(129,146,161)' : 'transparent',
      }}
      {...rest}
    >
      <WhiteListItemIcon>{icon}</WhiteListItemIcon>
      <CustomListItemText primary={primary} />
    </CustomListItem>
  );
}

// 定义菜单映射
const menuMapping = {
  autoApprovedMgt: { to: '/admin/auto-approved', icon: <SettingsIcon />, primary: 'Auto Approved Mgt' },
  permissionMgt: { to: '/admin/permission-mgt', icon: <SettingsIcon />, primary: 'Permission Mgt' },
  licenseApply: { to: '/admin/license-apply', icon: <FeaturedPlayListIcon />, primary: 'License Apply' },
  licenseMgt: { to: '/admin/license-mgt', icon: <SettingsIcon />, primary: 'License Mgt' },
};

export default function ClippedDrawer(props) {
  // const apiResponse = useSelector((state) => state.permission.menuList); // 從 Redux 獲取角色
  const apiResponse = [
    { id: 2, perem: 'permissionMgt' },
    { id: 1, perem: 'autoApprovedMgt' },
    { id: 3, perem: 'licenseMgt' },
    { id: 4, perem: 'licenseApply' },
  ];

  const location = useLocation();

  // 筛选出 License Apply 菜单项
  const licenseApplyItem = apiResponse.find(item => item.perem === 'licenseApply');
  const licenseApplyMenu = licenseApplyItem ? menuMapping[licenseApplyItem.perem] : null;

  // 筛选出除 License Apply 之外的其他菜单项，并按 id 排序
  const otherItems = apiResponse.filter(item => item.perem !== 'licenseApply').sort((a, b) => a.id - b.id);
  const otherMenus = otherItems.map(item => menuMapping[item.perem]).filter(Boolean);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#4a4848',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {licenseApplyMenu && (
              <ListItemLink
                key="licenseApply"
                to={licenseApplyMenu.to}
                icon={licenseApplyMenu.icon}
                primary={licenseApplyMenu.primary}
                isActive={location.pathname === licenseApplyMenu.to}
              />
            )}
            <Divider style={{ borderColor: 'white' }} />
            {otherMenus.map((item, index) => (
              <ListItemLink
                key={index}
                to={item.to}
                icon={item.icon}
                primary={item.primary}
                isActive={location.pathname === item.to}
              />
            ))}
          </List>
        </Box>
      </Drawer>

      {/* 主内容区域 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}