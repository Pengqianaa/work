import React from 'react'

const Dashboard = React.lazy(() => import('../pages/admin/Dashboard'))
const Freeware = React.lazy(() => import('../pages/admin/Freeware'))
const EFormQuery = React.lazy(() => import('../pages/admin/EFormQuery'))
const SWCollection = React.lazy(() => import('../pages/admin/SWCollection'))
const SoftwareInfo = React.lazy(() => import('../pages/admin/SoftwareInfo'))

const adminRoutes = [
  { 
    path: '/admin/', 
    exact: true, 
    name: 'Dashboard', 
    component: Dashboard,
    icon: 'Dashboard'
  },
  { 
    path: '/admin/freewarereview', 
    name: 'Freeware Review', 
    component: Freeware,
    icon: 'Assignment'
  },
  { 
    path: '/admin/eformquery', 
    name: 'E-Form Query', 
    component: EFormQuery,
    icon: 'Description'
  },
  { 
    path: '/admin/swcollection', 
    name: 'SW Collection', 
    component: SWCollection,
    icon: 'Folder'
  },
  { 
    path: '/admin/softwareinfo', 
    name: 'Software Info', 
    component: SoftwareInfo,
    icon: 'Info'
  }
]

export default adminRoutes 