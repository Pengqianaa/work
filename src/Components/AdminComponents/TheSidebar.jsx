import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemLink from './ListItemLink'; // 确保ListItemLink在同一目录下或正确路径
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
const drawerWidth = 240;

export default function TheSideBar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {['/task-info', '/license-apply'].map((to, index) => (
            <ListItemLink
              key={to}
              to={to}
              icon={index % 2 === 0 ? <InfoIcon /> : <FeaturedPlayListIcon />}
              primary={to === '/task-info' ? 'Task Info' : 'License Apply'}
            />
          ))}
        </List>
        <Divider />
        <List>
          {['/auto-approved', '/permission-mgt', '/license-mgt'].map((to, index) => (
            <ListItemLink
              key={to}
              to={to}
              icon={<SettingsIcon />}
              primary={to.replace('-', ' ').split('/').pop()}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  );
}