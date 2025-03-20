import { CContainer, CRow } from "@coreui/react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { TabContainer } from "../uiComponents/AdminCommonUis";
import InstallationPathTab from "../uiComponents/InstallationPathTab";
import TrialwareInfoTab from "../uiComponents/TrialwareInfoTab";
import LicenseInfoTab from "../uiComponents/LicenseInfoTab";
import SCCMInfoTab from "../uiComponents/SCCMInfoTab";
import SoftwareInfoTab from "../uiComponents/SoftwareInfoTab";

const SoftwareInfo = () => {
  const intl = useIntl();
  const [currentTab, setCurrentTab] = useState("2");

  const handleClickTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <CContainer>
      <CRow style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id="softwareinfomgt.title" />
        </h1>
      </CRow>
      <CRow>
        <TabContainer>
          <Tabs
            value={currentTab}
            onChange={handleClickTab}
            aria-label="simple tabs example"
          >
            {/* <Tab
              value={"1"}
              label={intl.formatMessage({ id: "softwareinfomgt.tab1" })}
            /> */}
            <Tab
              value={"2"}
              label={intl.formatMessage({ id: "softwareinfomgt.tab2" })}
            />
            <Tab
              value={"3"}
              label={intl.formatMessage({ id: "softwareinfomgt.tab3" })}
            />
            <Tab
              value={"4"}
              label={intl.formatMessage({ id: "softwareinfomgt.tab4" })}
            />
            <Tab
              value={"5"}
              label={intl.formatMessage({ id: "softwareinfomgt.tab5" })}
            />
          </Tabs>
        </TabContainer>
        {currentTab === "1" && <SoftwareInfoTab />}
        {currentTab === "2" && <SCCMInfoTab />}
        {currentTab === "3" && <LicenseInfoTab />}
        {currentTab === "4" && <InstallationPathTab />}
        {currentTab === "5" && <TrialwareInfoTab />}
      </CRow>
    </CContainer>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SoftwareInfo);
