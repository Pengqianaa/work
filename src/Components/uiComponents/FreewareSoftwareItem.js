import { Paper, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useIntl } from "react-intl";
import { CRow, CCol } from "@coreui/react";
import { LogoImage, BlockButton } from "./index";
import { backServerIP } from "../../Common/common";
import CIcon from "@coreui/icons-react";
import assetCart from "../../assets/icons/icon_asset_cart.png";
import inventoryStatus from "../../assets/icons/icon_Inventory_status.png";
import styled from "styled-components";
import { Actions, SCREEN } from "../../Common/constants";
import { BlueDotTooltip } from "src/Components/admin/common/index";
import Api from "src/api/sam/FreewareApi";

const StyledLink = styled.a`
  font-size: 15px;
  color: #0070c0;
  text-decoration: none;
`;
const CartItemWrapper = styled(Paper)`
  padding: 3px;
  margin-bottom: 10px;
  width: 100%;
`;
const CartItem = styled(CRow)`
  margin: 0;
  min-height: 140px;
`;
const ItemCol = styled(CCol)`
  padding: 10px;
`;
const ItemInfoCol = styled(CCol)`
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-left: 1px solid;
  border-color: #ced2d8;

  > div {
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  &:hover {
    cursor: default;
  }
`;
const SoftwareTags = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ItemStatus = styled.p`
  white-space: pre;
  font-size: 12px;
  margin: 4px 8px 16px;
  min-width: 100px;
`;

const ItemType = styled.p`
  align-items: end;
  color: var(--delta-gray-hover);
  display: flex;
  flex-direction: column;
  font-size: 12px;
  white-space: pre;
  width: 100%;

  &.has-permission > span:hover {
    position: relative;

    &:after {
      bottom: -10px;
      color: var(--delta-red);
      content: ${({ content }) => `"${content}"`};
      font-size: 10px;
      right: 0;
      position: absolute;
    }
  }
`;

const ButtonContainer = styled(CRow)`
  height: 32px;
  text-align: center;
`;
const CartButton = styled(BlockButton)`
  border-radius: 0;
  height: 32px;
  width: 32px;
  font-size: 12px;
  padding: 4px;
  margin-left: 10px;
`;
const InventoryStatus = styled.span`
  margin-left: 10px;
  color: green;
  text-align: center;
  vertical-align: bottom;
`;

const FreewareSoftwareCategory = (props) => {
  const { item, addIntoCart, openOverlay, msg, setMsg } = props;
  const intl = useIntl();
  const [reason, setReason] = useState("");
  const isEn = props.locale === "en-US";
  const type = item.listType;
  const handleClickAdd = () => {
    addIntoCart(item);
  };

  useEffect(() => {
    if (msg?.code === 0) {
      openOverlay() && setMsg(null);
    }
  }, [msg]);

  const getReason = async () => {
    try {
      const { status, data } = await Api.getFreewareReason({
        listTypeCode: item.listType,
        language: props.locale,
        typeCause: item.typeCause,
      });

      if (status !== 200 || data?.code !== 0 || !data?.data?.length) {
        return;
      }

      setReason(data.data.map((d) => d.reason).join("/n"));
    } catch (error) {
      console.error(`[getFreewareReason] ${error}`);
    }
  };

  useEffect(() => {
    if (!item.typeCause || reason) {
      return;
    }
    console.info('yes')
    getReason();
  }, [item.typeCause]);

  return (
    <CartItemWrapper>
      <CartItem>
        <ItemCol xs="4" sm="2" md="2" xl="2">
          <LogoImage
            style={{ width: "90%", height: "auto" }}
            src={`${backServerIP}/image/show/${item.graph}`}
          ></LogoImage>
        </ItemCol>
        <ItemCol
          xs="8"
          sm="5"
          md="6"
          xl="7"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <StyledLink
            target="_blank"
            href={item.sourceUrl ? item.sourceUrl : ""}
          >
            {item.assetName + " " + item.edition + " " + item.version}
            <span style={{ position: "relative" }}>
              <BlueDotTooltip
                content={item.remark}
                placement="top-start"
                top={3}
                right={-17}
              />
            </span>
          </StyledLink>
          <SoftwareTags>
            {isEn ? item.freewareCategoryEN : item.freewareCategoryTC}
          </SoftwareTags>
          <span>{isEn ? item.assetDescEN : item.assetDescTC}</span>
        </ItemCol>
        <ItemInfoCol xs="12" sm="5" md="4" xl="3">
          <ItemType
            content={intl.formatMessage({
              id: "COMMON.TOOLTIP.NEED_PERMISSION",
            })}
            className={type === 4 && "has-permission"}
          >
            <span>
              {type
                ? intl.formatMessage({
                  id: `swassetmgt.freewareTab.listType${type}`,
                })
                : ""}
            </span>
          </ItemType>
          <div>
            <ItemStatus>
              <Tooltip title={reason} placement="top">
                <span>
                  <CIcon src={inventoryStatus} width="16" height="16" />
                </span>
              </Tooltip>
              <InventoryStatus
                style={{ color: type === 2 || type === 4 || type === 5 ? "green" : "red" }}
              >
                {type === 2 || type === 4 || type === 5
                  ? intl.formatMessage({ id: "search.available" })
                  : intl.formatMessage({ id: "search.notAvailable" })}
              </InventoryStatus>
            </ItemStatus>
            {(type === 2 || type === 4 || type === 5) && (
              <ButtonContainer>
                <div
                  style={{ height: 32, display: "flex", alignItems: "center" }}
                >
                  {intl.formatMessage({
                    id: `swassetmgt.freewareTab.applyType${item.applyType}`,
                  })}
                </div>
                <CartButton
                  color="info"
                  onClick={handleClickAdd}
                  disabled={props.inCart || item.applyType === 1}
                >
                  <CIcon src={assetCart} width="16" height="16" />
                </CartButton>
              </ButtonContainer>
            )}
          </div>
        </ItemInfoCol>
      </CartItem>
    </CartItemWrapper>
  );
};

const mapStateToProps = (state) => ({
  locale: state.view.currentLocale,
  msg: state.cart.msg,
});
const mapDispatchToProps = (dispatch) => ({
  addIntoCart: (item) =>
    dispatch({
      type: "addIntoCart",
      payload: { ...item, flag: 1 },
    }),
  openOverlay: () =>
    dispatch({
      type: Actions.SET_SHOW_CART_OVERLAY,
      payload: true,
    }),
  setShowAlert: (props) =>
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    }),
  setMsg: (msg) =>
    dispatch({
      type: "setMsg",
      payload: { msg },
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FreewareSoftwareCategory);
