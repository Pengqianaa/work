import React from 'react'

const Profile = React.lazy(() => import('../../pages/user/Profile'))
// const MyApp = React.lazy(() => import('../pages/user/MyApp'))
// const MyRequest = React.lazy(() => import('../pages/user/MyRequest'))
// const SoftwareInfo = React.lazy(() => import('../pages/user/SoftwareInfo'))

const userRoutes = [
  { path: '/', exact: true, name: 'Profile', component: Profile },
  // { path: '/myapp', name: 'My App', component: MyApp },
  // { path: '/myrequest', name: 'My Request', component: MyRequest },
  // { path: '/software/:id', name: 'Software Info', component: SoftwareInfo }
]

export default userRoutes 