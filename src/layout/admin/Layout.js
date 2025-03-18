import React, { useEffect } from "react";
import { connect } from "react-redux";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import Footer from "./Footer";
import {
  UserProfile,
  LoadingBackdrop,
  AlertModal,
} from "src/Components/common";
import { Actions } from "src/constants/common";

const Layout = ({
  isLoading,
  permissions,
  showProfileModal,
  setUserProfileShow,
}) => {
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
        <Sidebar permissions={permissions} />
        <div className="admin-body">
          <Content />
        </div>
        <Footer />
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

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
