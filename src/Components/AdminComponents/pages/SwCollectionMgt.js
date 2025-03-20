import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CContainer, CRow } from "@coreui/react";
import { Tabs, Tab } from "@mui/material";
import { TabContainer } from "../uiComponents/AdminCommonUis";
import SWInfoMaintainTab from "../uiComponents/SWInfoMaintainTab";
import {
  RateMgtTab,
  OrgMgtTab,
  SWAuthorityMgtTab,
  SWCollectionPlanTab,
} from "src/Components/admin/SWCollectionMgt";

const SWCollectionMgt = () => {
  const intl = useIntl();
  const [currentTab, setCurrentTab] = useState("1");

  const handleClickTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  return (
    <CContainer>
      <CRow style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id="swCollectionMgt.title" />
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
              label={intl.formatMessage({ id: "swCollectionMgt.rateMgt" })}
            />
            <Tab
              value={"2"}
              label={intl.formatMessage({ id: "swCollectionMgt.orgMgt" })}
            />
            <Tab
              value={"3"}
              label={intl.formatMessage({
                id: "swCollectionMgt.swInfoMaintain",
              })}
            />
            <Tab
              value={"4"}
              label={intl.formatMessage({ id: "swCollectionMgt.authorityMgt" })}
            />
            <Tab
              value={"5"}
              label={intl.formatMessage({
                id: "swCollectionMgt.swCollectionPlan",
              })}
            />
          </Tabs>
        </TabContainer>
        {currentTab === "1" && <RateMgtTab />}
        {currentTab === "2" && <OrgMgtTab />}
        {currentTab === "3" && <SWInfoMaintainTab />}
        {currentTab === "4" && <SWAuthorityMgtTab />}
        {currentTab === "5" && <SWCollectionPlanTab />}
      </CRow>
    </CContainer>
  );
};

export default SWCollectionMgt;
