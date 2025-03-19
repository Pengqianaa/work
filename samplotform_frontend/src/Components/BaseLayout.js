import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TheFooter, Header, TheContent } from "./containers/index";
import { AlertModal } from "./common/index";
import {
  UserProfile,
  CartOverlay,
  LoadingBackdrop,
} from "./uiComponents/index";
import SwitchUserModal from "../Components/uiComponents/SwitchUserModal";
import { Actions } from "../Common/constants";

const TheLayout = (props) => {
  const {
    history,
    getAllCategoryInfo,
    getUser,
    initGoToPage,
    functions,
    softwareDetail,
    keyword,
    searchCount,
    showProfileModal,
    setUserProfileShow,
    showCartOverlay,
    isLoading,
    isTestingEnv,
  } = props;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    getUser();
    initGoToPage(history.push);
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (Object.keys(functions).length) {
      getAllCategoryInfo();
    }
  }, [functions]);

  return (
    <div className="c-app c-default-layout">
      <div className="c-wrapper">
        <Header {...props} width={windowWidth} />
        <div className={`c-body${showCartOverlay ? " hide-body-scroll" : ""}`}>
          <TheContent
            {...props}
            width={windowWidth}
            softwareDetail={softwareDetail}
            keyword={keyword}
            searchCount={searchCount}
            overflowShow={showCartOverlay}
            functions={functions}
          />
        </div>
        <TheFooter />
        <UserProfile show={showProfileModal} toggleFunc={setUserProfileShow} />
      </div>
      <CartOverlay />
      <AlertModal />
      {isTestingEnv && <SwitchUserModal />}
      <LoadingBackdrop open={isLoading}></LoadingBackdrop>
    </div>
  );
};

const mapStateToProps = (state) => ({
  softwareDetail: state.search.softwareDetail,
  keyword: state.search.keyword,
  searchCount: state.search.searchCount,
  showProfileModal: state.view.showProfileModal,
  showCartOverlay: state.view.showCartOverlay,
  isLoading: state.view.isLoading,
  functions: state.functions.map,
  isTestingEnv: state.view.isTestingEnv,
});
const mapDispatchToProps = (dispatch) => ({
  getUser: () =>
    dispatch({
      type: "getUser",
    }),
  setUserProfileShow: (show) =>
    dispatch({
      type: Actions.SET_SHOW_PROFILE_MODAL,
      payload: show,
    }),
  initGoToPage: (callback) =>
    dispatch({
      type: Actions.INIT_GO_TO_PAGE,
      payload: callback,
    }),
  getAllCategoryInfo: () =>
    dispatch({
      type: "getAllCategoryInfo",
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TheLayout);
