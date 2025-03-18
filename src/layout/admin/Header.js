import React from "react";
import { connect } from "react-redux";
import { CHeader, CHeaderNav, CHeaderNavLink, CImg } from "@coreui/react";
import { UserDropdown, LocaleDropdown } from "src/Components/common";
import { SCREEN } from "src/constants/common";
import deltaLogo from "../../assets/images/logoW.svg";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: nowrap;
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    padding: 0 16px;
    max-width: 100vw;
    flex-wrap: wrap;
  }
`;
const HeaderContainer = styled(CHeader)``;
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

const Header = (props) => {
  return (
    <HeaderContainer id="admin-header" withSubheader>
      <HeaderWrapper>
        <NormalHeader>
          <HeaderTitle className="nav-hover" to="/admin">
            <ImageWrapper>
              <CImg src={deltaLogo} width={80} />
            </ImageWrapper>
            <HeaderText>Software Asset Management</HeaderText>
          </HeaderTitle>
        </NormalHeader>
        <NormalHeader className="px-3">
          <UserDropdown {...props} />
          {/* <LocaleDropdown {...props} /> */}
        </NormalHeader>
      </HeaderWrapper>
    </HeaderContainer>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
