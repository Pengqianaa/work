import React from 'react'

const Profile = React.lazy(() => import('../../pages/user/Profile'))
const PermissionManagement = React.lazy(() => import('@/pages/admin/PermissionManagement'))
// const MyRequest = React.lazy(() => import('../pages/user/MyRequest'))
// const SoftwareInfo = React.lazy(() => import('../pages/user/SoftwareInfo'))

const userRoutes = [
  { path: '/', exact: true, name: 'Profile', component: Profile },
  { path: '/permissions', name: 'permissions', component: PermissionManagement },
  // { path: '/myapp', name: 'My App', component: MyApp },
  // { path: '/myrequest', name: 'My Request', component: MyRequest },
  // { path: '/software/:id', name: 'Software Info', component: SoftwareInfo }
]

export default userRoutes 