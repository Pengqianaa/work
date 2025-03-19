import React, { useEffect } from "react";
import { AlertModal } from "./common/index";
import {
  TheFooter,
  Header,
  TheContent,
  TheSidebar,
} from "./AdminComponents/index";
import { UserProfile, LoadingBackdrop } from "./uiComponents/index";
import { connect } from "react-redux";
import { Actions } from "../Common/constants";

const AdminLayout = (props) => {
  const { isLoading, permissions, showProfileModal, setUserProfileShow } =
    props;

  useEffect(() => {
    props.getUser();
    props.checkRole();
    props.initGoToPage(props.history.push);
  }, []);
  useEffect(() => {
    props.checkRole();
  }, [window.location.href]);

  return (
    <div className="c-app c-default-layout">
      <div className="c-wrapper">
        <Header {...props} />
        <TheSidebar permissions={permissions} />
        <div className="admin-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
      <AlertModal />
      <UserProfile
        show={showProfileModal}
        toggleFunc={setUserProfileShow}
      ></UserProfile>
      <LoadingBackdrop open={isLoading}></LoadingBackdrop>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.view.isLoading,
  permissions: state.permission.permissions,
  showProfileModal: state.view.showProfileModal,
});
const mapDispatchToProps = (dispatch) => ({
  getUser: () =>
    dispatch({
      type: "getUser",
    }),
  checkRole: () =>
    dispatch({
      type: "checkRole",
    }),
  initGoToPage: (callback) =>
    dispatch({
      type: Actions.INIT_GO_TO_PAGE,
      payload: callback,
    }),
  setUserProfileShow: (show) =>
    dispatch({
      type: "SET_SHOW_PROFILE_MODAL",
      payload: show,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout);
