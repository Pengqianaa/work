import React from 'react'
import CIcon from '@coreui/icons-react'

let tagList = [{
	_tag: 'CSidebarNavItem',
	name: 'Dashboard',
	to: '/', // dashboard
	icon: < CIcon name="cil-speedometer"
		customClasses="c-sidebar-nav-icon" />
},
{
	_tag: 'CSidebarNavTitle',
	_children: ['Tool Chain']
},
{
	_tag: 'CSidebarNavItem',
	name: 'Tool Chain Sample',
	to: '/toolchainflow',
	icon: 'cil-pencil',
	badge: {
		color: 'info',
		text: 'NEW',
	}
},
{
	_tag: 'CSidebarNavItem',
	name: 'Tool Chain Flow',
	to: '/toolchainsecond',
	icon: 'cil-pencil',
	badge: {
		color: 'info',
		text: 'NEW',
	}
},
]

export default tagList