import React from "react";
import { Tabs, Tab } from "@mui/material/index";
import { CContainer, CRow } from "@coreui/react";
import { FormattedMessage, useIntl } from "react-intl";

import styled from "styled-components";

const Title = styled(CRow)`
  margin-bottom: 20px;
`;

const TabsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const Container = ({
  children,
  title = "",
  currentTab = 1,
  tabs = [],
  handleClickTab,
}) => {
  const intl = useIntl();

  return (
    <CContainer>
      <Title style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id={`${title}.title`} />
        </h1>
      </Title>
      <CRow>
        {tabs.length > 0 && (
          <TabsRow>
            <Tabs
              value={currentTab}
              aria-label="simple tabs example"
              {...(handleClickTab && { onChange: handleClickTab })}
            >
              {tabs.map((tab) => {
                return (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={intl.formatMessage({ id: tab.label })}
                  />
                );
              })}
            </Tabs>
          </TabsRow>
        )}
        {children}
      </CRow>
    </CContainer>
  );
};

export default React.memo(Container);
