import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import {
  CContainer,
  CRow,
  CTabs,
  CTabContent,
  CTabPane,
  CNav,
  CNavItem,
  CNavLink,
  CBreadcrumb,
  CBreadcrumbItem,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Paper } from "@mui/material";
import styled from "styled-components";
import { SOURCE_SYSTEM } from "../../Common/constants";

import { MyAppsTable, SendDialog } from "../uiComponents/index";

import maApp from "../../assets/icons/myappblue.svg";
import homeIcon from "../../assets/icons/home.svg";

const BreadcrumbContainer = styled(CRow)`
  margin-top: 20px;
  margin-bottom: 20px;
  justify-content: space-between;
  padding: 0;
  border-color: #666;
`;
const Breadcrumb = styled(CBreadcrumb)`
  padding-top: 0;
  border-bottom: 0;
  border-color: transparent;
`;
const CartItemsContainer = styled(CContainer)`
  padding-right: 0;
  padding-left: 0;
  margin-bottom: 70px;
`;

const Title = styled.div`
  white-space: pre;
  font-size: 16px;
  font-weight: bold;
`;

const LargerTab = styled(CNavLink)`
  padding: 1rem 1.5rem;
`;

const MyAppsContainer = styled(CContainer)``;

const MyApps = (props) => {
  let {
    myApp,
    installed,
    total,
    pageNum,
    pageSize,
    getAppList,
    sendUninstallApplication,
  } = props;
  const intl = useIntl();
  let [selected, setSelected] = useState([]);
  let [showSend, setShowSend] = useState(false);
  // TODO: when there's more than one tab
  const { uninstall } = myApp?.childs;
  const uninstallEnable = uninstall?.userEnable;

  let handleDelete = () => {
    setShowSend(true);
  };

  let handleSend = (reasons) => {
    sendUninstallApplication(reasons, selected);
  };
  useEffect(() => {
    getAppList(1, pageSize, SOURCE_SYSTEM.SPR);
  }, []);

  return (
    <MyAppsContainer>
      <BreadcrumbContainer>
        <Title>
          <CIcon
            src={maApp}
            style={{ color: "#0087DC" }}
            width="16"
            height="16"
          />{" "}
          <FormattedMessage id="myApp.title" />
        </Title>
        <Breadcrumb>
          <CBreadcrumbItem>
            <CLink to={{ pathname: `/` }}>
              <CIcon src={homeIcon} width="16" height="16" />
            </CLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>
            <FormattedMessage id="myApp.breadcrumb" />
          </CBreadcrumbItem>
        </Breadcrumb>
      </BreadcrumbContainer>

      <Paper className="myapp-table">
        <CartItemsContainer fluid>
          <CTabs activeTab="t1">
            <CNav variant="tabs">
              <CNavItem>
                <LargerTab data-tab={`t1`}>
                  <FormattedMessage id="main.commercial" /> ({total})
                </LargerTab>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab={`t1`}>
                <MyAppsTable
                  uninstallEnable={uninstallEnable}
                  installed={installed}
                  selected={selected}
                  onCheck={setSelected}
                  onDelete={handleDelete}
                  total={total}
                  pageNum={pageNum}
                  pageSize={pageSize}
                  getAppList={getAppList}
                  intl={intl}
                ></MyAppsTable>
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CartItemsContainer>
      </Paper>
      <SendDialog
        show={showSend}
        toggle={setShowSend}
        title={intl.formatMessage({ id: `myApp.sendTitle` })}
        label={intl.formatMessage({ id: `myApp.reasons` })}
        save={handleSend}
        intl={intl}
      ></SendDialog>
    </MyAppsContainer>
  );
};

const mapStateToProps = (state) => ({
  myApp: state.functions.map.myApp,
  installed: state.user.installed,
  total: state.user.total,
  pageNum: state.user.pageNum,
  pageSize: state.user.pageSize,
});
const mapDispatchToProps = (dispatch) => ({
  getAppList: (pageNum, pageSize, sourceSystem) =>
    dispatch({
      type: "getAppList",
      payload: { pageNum, pageSize, sourceSystem },
    }),
  sendUninstallApplication: (reasons, selected) =>
    dispatch({
      type: "sendUninstallApplication",
      payload: { reasons, selected },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyApps);
