import React from "react";
import { connect } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";


const Sidebar = (props) => {
  return (
    <CSidebar id="admin-sidebar" show={true} minimize={false}>
      <CSidebarNav>
        <CCreateElement
          items={props.sidebarList}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
    </CSidebar>
  );
};

const mapStateToProps = (state) => ({
  sidebarList: state.permission.sideBarList,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
