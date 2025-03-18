import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import "src/CSS/common.scss";
import { SCREEN } from "src/constants/common";
import language from "src/assets/icons/icon_language.png";
import styled from "styled-components";

const DropdownItem = styled(CDropdownItem)`
  min-width: 4rem !important;
  cursor: pointer;
`;
const HeaderText = styled.span`
  margin-left: 4px;
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    display: none;
  }
`;

const LocaleDropdown = ({ locale, setLocale }) => {
  const currentId = `locales.${locale.includes("zh") ? "zh-TW" : "en-US"}`;

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
      style={{ height: "100%" }}
    >
      <CDropdownToggle className="nav-hover c-header-nav-link">
        <CIcon src={language} width="16" height="16" className="mfe-2" />
        <HeaderText>
          <FormattedMessage id={currentId} />
        </HeaderText>
      </CDropdownToggle>
      <CDropdownMenu>
        <DropdownItem
          tag="div"
          className="bg-white text-primary text-dark"
          onClick={() => {
            setLocale("zh-TW");
          }}
        >
          <span>
            <FormattedMessage id="locales.zh-TW" />
          </span>
        </DropdownItem>
        <DropdownItem
          tag="div"
          className="bg-white text-primary text-dark"
          onClick={() => {
            setLocale("en-US");
          }}
        >
          <span>
            <FormattedMessage id="locales.en-US" />
          </span>
        </DropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

const mapStateToProps = (state) => ({
  locale: state.view.currentLocale,
});

const mapDispatchToProps = (dispatch) => ({
  setLocale: (locale) =>
    dispatch({
      type: "SET_LOCALE",
      payload: locale,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LocaleDropdown);
