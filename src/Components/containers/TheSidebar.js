import React from 'react'
import {
    CCreateElement,
    CSidebar,
    CSidebarBrand,
    CSidebarNav,
    CSidebarNavDivider,
    CSidebarNavTitle,
    CSidebarNavDropdown,
    CSidebarNavItem,
    CImg,
} from '@coreui/react'
import logo2 from '../../assets/images/Logo2.png'

// sidebar nav config
import navigation from './_nav'

const TheSidebar = () => {

    return (
        <CSidebar
            show={true} minimize={false}
        >
            <CSidebarBrand className="d-md-down-none" to="/">
                <CImg src={logo2} className="c-sidebar-brand-full" />
                <CImg src={'favicon.ico'} className="c-sidebar-brand-minimized" />
            </CSidebarBrand>
            <CSidebarNav>

                <CCreateElement
                    items={navigation}
                    components={{
                        CSidebarNavDivider,
                        CSidebarNavDropdown,
                        CSidebarNavItem,
                        CSidebarNavTitle
                    }}
                />
            </CSidebarNav>
        </CSidebar>
    )
}

export default React.memo(TheSidebar)
