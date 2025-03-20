import React from 'react'

const PermissionManagement = React.lazy(() => import('../../pages/admin/PermissionMgt/index.jsx'))
// const Freeware = React.lazy(() => import('../pages/admin/Freeware'))
// const EFormQuery = React.lazy(() => import('../pages/admin/EFormQuery'))
// const SWCollection = React.lazy(() => import('../pages/admin/SWCollection'))
const Profile = React.lazy(() => import('../../pages/admin/Profile'))

const adminRoutes = [
  // { 
  //   path: '/admin/', 
  //   exact: true, 
  //   name: 'Dashboard', 
  //   component: Dashboard,
  //   icon: 'Dashboard'
  // },
  // { 
  //   path: '/admin/freewarereview', 
  //   name: 'Freeware Review', 
  //   component: Freeware,
  //   icon: 'Assignment'
  // },
  // { 
  //   path: '/admin/eformquery', 
  //   name: 'E-Form Query', 
  //   component: EFormQuery,
  //   icon: 'Description'
  // },
  { 
    path: '/admin/permissions', 
    name: 'permissions', 
    component: PermissionManagement,
    icon: 'Folder'
  },
  { 
    path: '/admin/Profile', 
    name: 'Software Info', 
    component: Profile,
    icon: 'Info'
  }
]

export default adminRoutes 