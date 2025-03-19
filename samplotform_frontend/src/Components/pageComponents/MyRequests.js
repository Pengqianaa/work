import React, { useEffect } from "react";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import {
  CContainer,
  CRow,
  CBreadcrumb,
  CBreadcrumbItem,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Paper } from "@mui/material";
import styled from "styled-components";
import { MyRequestsTable } from "../uiComponents/index";

import maApp from "../../assets/icons/myRequestblue.svg";
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

const MyAppsContainer = styled(CContainer)``;

const MyRequests = (props) => {
  const { userId, requests, getRequests, total, pageNum, pageSize } = props;
  const intl = useIntl();
  const isEn = props.locale === "en-US";

  useEffect(() => {
    getRequests(1, pageSize, userId);
  }, []);

  return (
    <MyAppsContainer>
      <BreadcrumbContainer>
        <Title>
          <CIcon src={maApp} width="16" height="16" />
          <FormattedMessage id="myRequest.title" />
        </Title>
        <Breadcrumb>
          <CBreadcrumbItem>
            <CLink to={{ pathname: `/` }}>
              <CIcon src={homeIcon} width="16" height="16" />
            </CLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>
            <FormattedMessage id="myRequest.breadcrumb" />
          </CBreadcrumbItem>
        </Breadcrumb>
      </BreadcrumbContainer>

      <Paper className="myapp-table">
        <CartItemsContainer fluid>
          <MyRequestsTable
            userId={userId}
            requests={requests}
            getRequests={getRequests}
            total={total}
            pageNum={pageNum}
            pageSize={pageSize}
            intl={intl}
            isEn={isEn}
          />
        </CartItemsContainer>
      </Paper>
    </MyAppsContainer>
  );
};

const mapStateToProps = (state) => ({
  locale: state.view.currentLocale,
  userId: state.user.user.userId,
  requests: state.user.request,
  total: state.user.rTotal,
  pageNum: state.user.rPageNum,
  pageSize: state.user.rPageSize,
});
const mapDispatchToProps = (dispatch) => ({
  getRequests: (pageNum, pageSize, applicant, formStatus, formType) =>
    dispatch({
      type: "getRequestList",
      payload: { pageNum, pageSize, applicant, formStatus, formType },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyRequests);
