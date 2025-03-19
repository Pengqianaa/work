import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CContainer, CRow } from "@coreui/react";
import { Tabs, Tab } from "@mui/material";
import { TabContainer } from "../uiComponents/AdminCommonUis";
import FreewareReviewTab from "../uiComponents/FreewareReviewTab";
import { connect } from "react-redux";

// Freeware 组件，用于展示免费软件审核相关内容
const Freeware = () => {
  const intl = useIntl();
  // 管理当前选中的标签页，初始值为 "1"
  const [currentTab, setCurrentTab] = useState("1");

  // 处理标签页点击事件
  const handleClickTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <CContainer>
      {/* 显示页面标题 */}
      <CRow style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id="freewarereview.title" />
        </h1>
      </CRow>
      {/* 包含标签页和对应内容 */}
      <CRow>
        <TabContainer>
          <Tabs
            value={currentTab}
            onChange={handleClickTab}
            aria-label="simple tabs example"
          >
            <Tab value={"1"} label={intl.formatMessage({ id: "freewarereview.tab1" })} />
          </Tabs>
        </TabContainer>
        {/* 根据当前标签页渲染组件 */}
        {currentTab === "1" && <FreewareReviewTab />}
      </CRow>
    </CContainer>
  );
};

// 使用 connect 函数将组件与 Redux 连接
export default Freeware;
