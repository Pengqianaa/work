import React from "react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { ADMIN_ROLES } from "../../Common/constants";

let tagList = [{
        _tag: "CSidebarNavItem",
        name: "SW Application Status",
        to: "/admin/eformquery",
        icon: ( <
            CIcon className = "c-sidebar-nav-icon"
            content = { freeSet.cilDescription }
            />
        ),
        page: "eformquery",
        permission: [ADMIN_ROLES.E_FORM_QUERY],
    },
    {
        _tag: "CSidebarNavItem",
        name: "SW Collection",
        to: "/admin/swcollection",
        icon: ( <
            CIcon className = "c-sidebar-nav-icon"
            content = { freeSet.cilDescription }
            />
        ),
        page: "swcollection",
        permission: [ADMIN_ROLES.SERVER_TEAM, ADMIN_ROLES.SO_TEAM],
    },
    {
        _tag: "CSidebarNavItem",
        name: "Software info",
        to: "/admin/softwareinfo",
        icon: < CIcon className = "c-sidebar-nav-icon"
        content = { freeSet.cilInfo }
        />,
        page: "softwareinfo",
        permission: [ADMIN_ROLES.VENDOR],
    },
    {
        _tag: "CSidebarNavItem",
        name: "Freeware Review",
        to: "/admin/freewarereview",
        icon: ( <
            CIcon className = "c-sidebar-nav-icon"
            content = { freeSet.cilDescription }
            />
        ),
        page: "freewarereview",
        permission: [ADMIN_ROLES.FREEWARE_REVIEW],
    },
    {
        _tag: "CSidebarNavDivider",
    },
    {
        _tag: "CSidebarNavItem",
        name: "Permission Mgt",
        to: "/admin/permissionmgt",
        icon: ( <
            CIcon className = "c-sidebar-nav-icon"
            content = { freeSet.cilSettings }
            />
        ),
        page: "permissionmgt",
        permission: [ADMIN_ROLES.IT_ADMIN],
    },
    {
        _tag: "CSidebarNavItem",
        name: "Authorization Mgt",
        to: "/admin/eformauth",
        icon: ( <
            CIcon className = "c-sidebar-nav-icon"
            content = { freeSet.cilDescription }
            />
        ),
        page: "eformauth",
        permission: [ADMIN_ROLES.SO_TEAM],
    },
    {
        _tag: "CSidebarNavItem",
        name: "Software SDP Mgt",
        to: "/admin/softwaresdpmgt",
        icon: < CIcon className = "c-sidebar-nav-icon"
        content = { freeSet.cilList }
        />,
        page: "softwaresdpmgt",
        permission: [ADMIN_ROLES.CLIENT_TEAM],
    },
    {
        _tag: "CSidebarNavItem",
        name: "People Control Settings",
        to: "/admin/viplistmgt",
        icon: < CIcon className = "c-sidebar-nav-icon"
        content = { freeSet.cilGroup }
        />,
        page: "viplistmgt",
        permission: [ADMIN_ROLES.CLIENT_TEAM],
    },
    {
        _tag: "CSidebarNavItem",
        name: "Software info Mgt",
        to: "/admin/softwareinfomgt",
        icon: < CIcon className = "c-sidebar-nav-icon"
        content = { freeSet.cilInfo }
        />,
        page: "softwareinfomgt",
        permission: [ADMIN_ROLES.SERVER_TEAM, ADMIN_ROLES.SO_TEAM],
    },
    {
        _tag: "CSidebarNavItem",
        name: "SW Collection Mgt",
        to: "/admin/swcollectionmgt",
        icon: ( <
            CIcon className = "c-sidebar-nav-icon"
            content = { freeSet.cilDescription }
            />
        ),
        page: "swcollectionmgt",
        permission: [ADMIN_ROLES.SO_TEAM],
    },
    {
        _tag: "CSidebarNavItem",
        name: "SAM Function Mgt",
        to: "/admin/samfunctionmgt",
        icon: ( <
            CIcon className = "c-sidebar-nav-icon"
            content = { freeSet.cilSettings }
            />
        ),
        page: "samfunctionmgt",
        permission: [ADMIN_ROLES.IT_ADMIN],
    },
    {
        _tag: "CSidebarNavItem",
        name: "SW Asset Mgt",
        to: "/admin/swassetmgt",
        icon: ( <
            CIcon className = "c-sidebar-nav-icon"
            content = { freeSet.cilSettings }
            />
        ),
        page: "swassetmgt",
        permission: [ADMIN_ROLES.IT_ADMIN],
    },
    {
        _tag: "CSidebarNavItem",
        name: "E-Form Error Mgt",
        to: "/admin/eformerrormgt",
        icon: < CIcon className = "c-sidebar-nav-icon"
        content = { freeSet.cilList }
        />,
        page: "eformerrormgt",
        permission: [ADMIN_ROLES.IT_ADMIN],
    },
];

export default tagList;