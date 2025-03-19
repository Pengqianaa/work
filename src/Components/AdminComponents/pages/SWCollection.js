import { FormattedMessage, useIntl } from "react-intl";
import { connect, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { TabContainer } from "../uiComponents/AdminCommonUis";
import { CContainer, CRow } from "@coreui/react";
import { ADMIN_ROLES } from "../../../Common/constants";
import { QueryOrDownload,SWCollectorReportTab } from "src/Components/admin/SWCollection";
import { ACTIONS } from "src/Reducers/admin/SWCollection/SWReportReducer";

const SWCollection = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("1");
  const [isCollector, setIsCollector] = useState(false);
  const [isDataViewer, setIsDataViewer] = useState(false);
  const { userRoles, getUserRoles } = props;
  const handleClickTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  useEffect(() => {
    setIsCollector(false);
    setIsDataViewer(false);
    getUserRoles();
  }, []);
  useEffect(() => {
    let userFlag = 2;
    for(let i = 0;i<userRoles.length;i++){
      if (
        userRoles[i].roleId === ADMIN_ROLES.IT_ADMIN ||
        userRoles[i].roleId === ADMIN_ROLES.SO_TEAM
      ) {
        setIsCollector(true);
        setIsDataViewer(true);
        userFlag = 0;
        break;
      }else if(
        userRoles[i].roleId === ADMIN_ROLES.SW_COLLECTOR){
          setIsCollector(true);
          setCurrentTab("1");
          userFlag = 1;
      }else if(
        userRoles[i].roleId === ADMIN_ROLES.SW_DATA_VIEWER){
          setIsDataViewer(true)
          setCurrentTab("2");
          userFlag = 2;
      }
    }
    dispatch({ type: ACTIONS.SET_USER_FLAG, payload: userFlag });
  }, [userRoles]);
  return (
    <CContainer>
      <CRow style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id="swCollection.title" />
        </h1>
      </CRow>
      <CRow>
        <TabContainer>
          <Tabs
            value={currentTab}
            onChange={handleClickTab}
            aria-label="simple tabs example"
          >
           {isCollector && (
              <Tab
                value={"1"}
                label={intl.formatMessage({
                  id: "swCollection.queryOrDownload",
                })}
              />
            )}
           {isDataViewer && (
            <Tab
              value={"2"}
              label={intl.formatMessage({
                id: "swCollection.SWCollectionReport",
              })}
            />
            )}
            </Tabs>
        </TabContainer>
        {currentTab === "1" && <QueryOrDownload />}
        {currentTab === "2" && <SWCollectorReportTab />}
      </CRow>
    </CContainer>
  );
};

const mapStateToProps = (state) => ({
  userRoles: state.permission.userRoles,
});
const mapDispatchToProps = (dispatch) => ({
  getUserRoles: () =>
    dispatch({
      type: "getUserRoles",
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SWCollection);
