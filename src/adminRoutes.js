import React from "react";

const Landing = React.lazy(() =>
    import ("./Components/AdminComponents/pages/Landing")
);
const Freeware = React.lazy(() =>
    import ("./Components/AdminComponents/pages/Freeware")
);
const EFormQuery = React.lazy(() =>
    import ("./Components/AdminComponents/pages/EFormQuery")
);
const SWCollection = React.lazy(() =>
    import ("./Components/AdminComponents/pages/SWCollection")
);
const SoftwareInfo = React.lazy(() =>
    import ("./Components/AdminComponents/pages/SoftwareInfo")
);
const PermissionMgt = React.lazy(() =>
    import ("./Components/AdminComponents/pages/PermissionMgt")
);

const SoftwareSdpMgt = React.lazy(() =>
    import ("./Components/AdminComponents/pages/SoftwareSdpMgt")
);
const VipListMgt = React.lazy(() =>
    import ("./Components/AdminComponents/pages/VipListMgt")
);
const SoftwareInfoMgt = React.lazy(() =>
    import ("./Components/AdminComponents/pages/SoftwareInfoMgt")
);
const SWCollectionMgt = React.lazy(() =>
    import ("./Components/AdminComponents/pages/SwCollectionMgt")
);
const SamFunctionMgt = React.lazy(() =>
    import ("./Pages/admin/SamFunctionMgt"));
const SWAssetMgt = React.lazy(() =>
    import ("./Components/AdminComponents/pages/SWAssetMgt")
);
const EFormErrorMgt = React.lazy(() =>
    import ("./Components/AdminComponents/pages/EFormErrorMgt")
);
const AuthorizationMgt = React.lazy(() =>
    import ("./Pages/admin/AuthorizationMgt")
);

const adminRoutes = [
    { path: "/admin/", exact: true, name: "Landing", component: Landing },
    {
        path: "/admin/freewarereview",
        name: "Freeware Review",
        component: Freeware,
    },
    { path: "/admin/eformquery", name: "E-Form Query", component: EFormQuery },
    {
        path: "/admin/swcollection",
        name: "SW Collection",
        component: SWCollection,
    },
    {
        path: "/admin/softwareinfo",
        name: "Software Info",
        component: SoftwareInfo,
    },
    {
        path: "/admin/permissionmgt",
        name: "Permission Mgt",
        component: PermissionMgt,
    },
    {
        path: "/admin/eformauth",
        name: "E-Form Authentication",
        component: AuthorizationMgt,
    },
    {
        path: "/admin/softwaresdpmgt",
        name: "Software SDP Mgt",
        component: SoftwareSdpMgt,
    },
    { path: "/admin/viplistmgt", name: "VIP List Mgt", component: VipListMgt },
    {
        path: "/admin/softwareinfomgt",
        name: "Software Info Mgt",
        component: SoftwareInfoMgt,
    },
    {
        path: "/admin/swcollectionmgt",
        name: "SW Collection Mgt",
        component: SWCollectionMgt,
    },
    {
        path: "/admin/samfunctionmgt",
        name: "Region Access Permission",
        component: SamFunctionMgt,
    },
    {
        path: "/admin/swassetmgt",
        name: "Region Access Permission",
        component: SWAssetMgt,
    },
    {
        path: "/admin/eformerrormgt",
        name: "EForm Error Mgt",
        component: EFormErrorMgt,
    },
];
export default adminRoutes;