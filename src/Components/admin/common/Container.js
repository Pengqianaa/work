import React, { memo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Container as MuiContainer, Grid, Tabs, Tab } from "@mui/material";
import styled from "styled-components";

const Title = styled(Grid)`
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
    <MuiContainer maxWidth={false}>
      <Title style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id={`${title}.title`} />
        </h1>
      </Title>
      <Grid container>
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
      </Grid>
    </MuiContainer>
  );
};

export default memo(Container);
