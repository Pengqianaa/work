import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { ADMIN_ROLES } from "../../Common/constants";

let tagList = [
  {
    component: "ListItem", // 使用 MUI 的 ListItem 替代
    name: "Permission Mgt",
    to: "/home",
    icon: '<SettingsIcon className="sidebar-nav-icon"></SettingsIcon>', // 使用 MUI 的 SettingsIcon
    page: "permissionmgt",
    permission: [ADMIN_ROLES.IT_ADMIN],
  },
];

export default tagList;
