import React, { useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { Tabs, Tab } from "@mui/material";
import { TabContainer } from "../uiComponents/AdminCommonUis";
import FreewareTab from "../uiComponents/FreewareTab";
import SoftwareInfoTab from "../uiComponents/SoftwareInfoTab";
import { CContainer, CRow } from "@coreui/react";

const SWAssetMgt = (props) => {
  const intl = useIntl();
  const [currentTab, setCurrentTab] = useState("1");

  const handleClickTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <CContainer>
      <CRow style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id="swassetmgt.title" />
        </h1>
      </CRow>
      <CRow>
        <TabContainer>
          <Tabs
            value={currentTab}
            onChange={handleClickTab}
            aria-label="simple tabs example"
          >
            <Tab
              value={"1"}
              label={intl.formatMessage({ id: "softwareinfomgt.tab1" })}
            />
            <Tab
              value={"2"}
              label={intl.formatMessage({ id: "swassetmgt.tab2" })}
            />
          </Tabs>
        </TabContainer>
        {currentTab === "1" && <SoftwareInfoTab />}
        {currentTab === "2" && <FreewareTab />}
      </CRow>
    </CContainer>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SWAssetMgt);
