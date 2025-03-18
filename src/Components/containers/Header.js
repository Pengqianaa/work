import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import CIcon from "@coreui/icons-react";
import { CHeader, CHeaderNav, CHeaderNavLink, CImg } from "@coreui/react";
import { UserDropdown, LocaleDropdown } from "../uiComponents/index";
import { Actions, SCREEN } from "../../Common/constants";
import deltaLogo from "../../assets/images/logoW.svg";
import { myApp, myRequest, assetCart } from "../../assets/icons";

// styles
import styled from "styled-components";

const HeaderWrapper = styled.div`
  display: flex;
  margin: auto;
  width: 100%;
  max-width: ${SCREEN.WIDTH_LIMIT}px;
  justify-content: space-between;
  flex-wrap: nowrap;
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    padding: 0 16px;
    max-width: 100vw;
    flex-wrap: wrap;
  }
`;

const NormalHeader = styled(CHeaderNav)`
  @media screen and (max-width: ${SCREEN.SMALL_DEVICE}px) {
    display: none;
  }
`;

const HeaderLink = styled(CHeaderNavLink)`
  margin: 0 20px 0 0;
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    margin: 0 8px 0 0;
  }
`;

const HeaderTitle = styled(CHeaderNavLink)`
  font-size: 22px;
  margin: 0 20px 0 0;
  @media screen and (max-width: ${SCREEN.WIDTH_LIMIT - 50}px) {
    margin: 0 8px 0 0;
    font-size: 14px;
    font-weight: bold;
  }
`;

const CartLink = styled(CHeaderNavLink)`
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    padding-right: 0 !important;
    padding-left: 0 !important;
    line-height: 6px;
  }
`;

const SmallHeader = styled(CHeaderNav)`
  display: none;
  @media screen and (max-width: ${SCREEN.SMALL_DEVICE}px) {
    display: flex;
    width: 100%;
    min-height: 36px !important;
    justify-content: space-between;
  }
`;

const HeaderText = styled.span`
  white-space: nowrap;
  margin-left: 4px;
  @media screen and (max-width: ${SCREEN.SMALL_DEVICE}px) {
    font-size: 14px;

    &:not(.name) {
      display: none;
    }
  }
`;

const CartText = styled.span`
  margin-left: 4px;
  white-space: nowrap;
`;

const ImageWrapper = styled.div`
  padding-bottom: 12px;
  @media screen and (max-width: ${SCREEN.SMALL_DEVICE}px) {
    padding-bottom: 10px;
  }
`;

const Logo = ({ width, canView }) => (
  <HeaderTitle className="nav-hover" {...(canView && { to: "/" })}>
    <ImageWrapper>
      <CImg src={deltaLogo} width={width} />
    </ImageWrapper>
    <HeaderText className="name">Software Asset Management</HeaderText>
  </HeaderTitle>
);

const MyApp = () => (
  <HeaderLink className="nav-hover" to="/myapp">
    <CIcon src={myApp} width="16" height="16" />
    <HeaderText>
      <FormattedMessage id="common.myApp" />
    </HeaderText>
  </HeaderLink>
);

const MyRequest = () => (
  <HeaderLink className="nav-hover" to="/myrequest">
    <CIcon src={myRequest} width="16" height="16" />
    <HeaderText>
      <FormattedMessage id="common.myRequest" />
    </HeaderText>
  </HeaderLink>
);

const Cart = ({ length, openOverlay }) => (
  <CartLink className="nav-hover" onClick={openOverlay}>
    <CIcon src={assetCart} width="16" height="16" />
    <CartText>{` (${length})`}</CartText>
  </CartLink>
);

const Header = (props) => {
  let { cart, openOverlay, functions } = props;
  const { home, myApp, myRequest, assetCart, lang } = functions ?? {};
  const homeEnable = home?.userEnable;
  const myAppEnable = myApp?.userEnable;
  const myRequestEnable = myRequest?.userEnable;
  const assetCartEnable = assetCart?.userEnable;
  const langEnable = lang?.userEnable;

  return (
    <CHeader withSubheader>
      <HeaderWrapper>
        <NormalHeader>
          <Logo width={80} canView={homeEnable} />
          {myAppEnable && <MyApp />}
          {myRequestEnable && <MyRequest />}
        </NormalHeader>
        <NormalHeader className="px-3">
          {assetCartEnable && (
            <Cart openOverlay={openOverlay} length={cart.length} />
          )}
          <UserDropdown {...props} />
          {langEnable && <LocaleDropdown {...props} />}
        </NormalHeader>
        {/* Mobile Header */}
        <SmallHeader>
          <Logo width={60} canView={homeEnable} />
        </SmallHeader>
        <SmallHeader>
          {myAppEnable && <MyApp />}
          {myRequestEnable && <MyRequest />}
          {assetCartEnable && (
            <Cart openOverlay={openOverlay} length={cart.length} />
          )}
          <UserDropdown {...props} />
          {langEnable && <LocaleDropdown {...props} />}
        </SmallHeader>
      </HeaderWrapper>
    </CHeader>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart.cart,
});

const mapDispatchToProps = (dispatch) => ({
  getUser: () =>
    dispatch({
      type: "getUser",
    }),
  openOverlay: () =>
    dispatch({
      type: Actions.SET_SHOW_CART_OVERLAY,
      payload: true,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
