import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import "../../CSS/common.scss";
import { connect, useSelector } from "react-redux";
import styled from "styled-components";
import { SCREEN } from "../../Common/constants";

import userAccount from "../../assets/icons/icon_user_account.png";

const DropdownItem = styled(CDropdownItem)`
  min-width: 7rem !important;
  cursor: pointer;
`;
const HeaderText = styled.span`
  margin-left: 4px;
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    display: none;
  }
`;

const UserDropdown = (props) => {
  const { permissions, goToAdminPage, isTestingEnv, setToggleTokenModal, goToDashboard } = props;
  let user = useSelector((state) => state.user.user);
  const { home, userProfile, management } = useSelector(
    (state) => state.functions.map
  );
  const childs = userProfile?.childs;
  const homeEnable = home?.userEnable;
  const userProfileEnable = userProfile?.userEnable;
  const aboutSAMEnable = childs?.aboutSAM?.userEnable;
  const adminConsolEnable = management?.userEnable;
  const isAdmin = window.location.href.match("admin");
  const [isNotClickable, setIsNotClickable] = useState(false);

  // 从 reducer 中获取 showDashboard 的值
  const showDashboard = useSelector((state) => state.permission.showDashboard);

  useEffect(() => {
    setIsNotClickable(
      !isTestingEnv &&
      !userProfileEnable &&
      !aboutSAMEnable &&
      !adminConsolEnable
    );

    // 页面初始化时发起请求
    if (user && user.userId) {
      goToDashboard(user.userId);
    }
  }, [userProfileEnable, aboutSAMEnable, adminConsolEnable, user]);

  const openUserProfile = () => {
    props.setUserProfileShow(true);
  };
  const goToAdmin = () => {
    goToAdminPage((page) => props.history.push(page));
  };

  return (
    <>
      <CDropdown
        inNav
        className="c-header-nav-items mx-2"
        direction="down"
        style={{ height: "100%" }}
      >
        <CDropdownToggle
          className="nav-hover c-header-nav-link"
          disabled={isNotClickable}
        >
          <CIcon src={userAccount} width="16" height="16" className="mfe-2" />
          <HeaderText>{user.userId}</HeaderText>
        </CDropdownToggle>

        <CDropdownMenu>
          {userProfileEnable && (
            <DropdownItem
              tag="div"
              className="bg-white text-primary text-dark"
              {...(!isNotClickable && { onClick: openUserProfile })}
            >
              <span>
                <FormattedMessage id={"common.userProfile"} />
              </span>
            </DropdownItem>
          )}
          {adminConsolEnable && permissions.length > 0 && !isAdmin && (
            <DropdownItem
              tag="div"
              className="bg-white text-primary text-dark"
              onClick={goToAdmin}
            >
              <span>
                <FormattedMessage id={"common.goToAdmin"} />
              </span>
            </DropdownItem>
          )}
          {homeEnable && isAdmin && (
            <DropdownItem
              tag="div"
              className="bg-white text-primary text-dark"
              onClick={() => {
                props.history.push("/");
              }}
            >
              <span>
                <FormattedMessage id={"common.goHome"} />
              </span>
            </DropdownItem>
          )}
          {aboutSAMEnable && (
            <DropdownItem tag="div" className="bg-white text-primary text-dark">
              <span>
                <FormattedMessage id={"common.aboutSam"} />
              </span>
            </DropdownItem>
          )}
          {isTestingEnv && (
            <DropdownItem
              tag="div"
              className="bg-white text-primary text-dark"
              onClick={() => setToggleTokenModal(true)}
            >
              <span>Switch User</span>
            </DropdownItem>
          )}
          {showDashboard && (
            <DropdownItem
              tag="div"
              className="bg-white text-primary text-dark"
              onClick={() => {
                window.open(process.env.REACT_APP_SAM_DASHBOARD, "_blank")
              }}
            >
              <span>Dashboard</span>
            </DropdownItem>
          )}
        </CDropdownMenu>
      </CDropdown>
    </>
  );
};

const mapStateToProps = (state) => ({
  permissions: state.permission.permissions,
  isTestingEnv: state.view.isTestingEnv,
});
const mapDispatchToProps = (dispatch) => ({
  setUserProfileShow: (show) =>
    dispatch({
      type: "SET_SHOW_PROFILE_MODAL",
      payload: show,
    }),
  setToggleTokenModal: (show) => {
    dispatch({ type: "SET_TOGGLE_TOKEN_MODAL", payload: show });
  },
  goToAdminPage: (goToPage) =>
    dispatch({
      type: "goToAdminPage",
      payload: goToPage,
    }),
  goToDashboard: (userId) =>
    dispatch({
      type: "goToDashboard",
      payload: userId,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDropdown);