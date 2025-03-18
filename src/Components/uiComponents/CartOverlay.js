import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as react from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import { showWithDefault, backServerIP } from "../../Common/common";
import { Actions, SCREEN, SW_ASSET_INFO } from "../../Common/constants";

import LogoImage from "./LogoImage";
import emptyPicEn from "../../assets/images/emptyCartEn.jpg";
import emptyPicZh from "../../assets/images/emptyCartZh.jpg";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { BlueDotTooltip } from "src/Components/admin/common/index";
import { FormDialog, BlockButton, SendDialog } from "./index";

const EmptyImg = styled.img`
  display: block;
  margin: auto;
  width: 447px;
  height: 183px;
  @media screen and (max-width: ${SCREEN.X_SMALL_DEVICE}px) {
    width: 80vw;
    height: auto;
  }
`;
const EmptyWrapper = styled.div`
  height: 30vh;
  @media screen and (max-width: ${SCREEN.X_SMALL_DEVICE}px) {
    height: auto;
  }
`;

const Overlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99995;
  background-color: #fff;
`;
const CartHeaderWrapper = styled.div`
  display: flex;
  margin: auto;
  width: 100%;
  max-width: ${SCREEN.WIDTH_LIMIT}px;
  justify-content: space-between;
  padding-left: 30px;
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    padding: 0 16px;
  }
`;
const CartItemsContainer = styled(react.CContainer)`
  margin-top: 57px;
  padding: 60px;
  max-width: ${SCREEN.WIDTH_LIMIT}px;
  overflow-y: scroll;
  height: 100%;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(200, 200, 200, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 100, 100, 0.5);
  }
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    padding: 10px;
  }
`;

const SoftwareName = styled.p`
  font-weight: bold;
`;

const SoftwareDesc = styled.p`
  width: 100%;
  overflow-wrap: anywhere;
`;

const CartItem = styled(react.CRow)`
  border: 1px solid;
  border-color: #c4c9d0;
  margin: 10px 0;
`;
const ItemCol = styled(react.CCol)`
  padding: 10px;
`;

const ItemInfo = styled.p`
  font-size: 16px;
  margin: 16px 6px 16px 26px;
  width: 100%;
  overflow-wrap: break-word;
  @media screen and (max-width: ${SCREEN.X_SMALL_DEVICE}px) {
    font-size: 14px;
    margin: 10px;
  }
`;

const SendButton = styled(react.CButton)`
  border-radius: 0;
  width: 120px;
  height: 45px;
  margin: 0 0 0 15px;
`;

const SendFooter = styled(react.CCardFooter)`
  padding: 0 15px 0 0;
`;

const FormWrapper = styled(react.CRow)`
  justify-content: flex-start;
  padding: 16px 8px;
`;
const SendWrapper = styled(react.CRow)`
  justify-content: flex-end;
`;

const FooterInfo = styled.p`
  white-space: pre;
  font-size: 16px;
  margin: auto 6px auto 26px;
`;
const allCategory = [
  {
    categoryId: 1,
    categoryName: "Trialware",
    id: "trailware",
    count: 0,
  },
  {
    categoryId: 2,
    categoryName: "Freeware",
    id: "freeware",
    count: 0,
  },
  {
    categoryId: 3,
    categoryName: "Open source (OSS)",
    id: "openSource",
    count: 0,
  },
  {
    categoryId: 4,
    categoryName: "Commercial",
    id: "commercial",
    count: 0,
  },
  {
    categoryId: 5,
    categoryName: "Patch/Driver",
    id: "patchDriver",
    count: 0,
  },
  {
    categoryId: 6,
    categoryName: "Delta Library",
    id: "deltaLibrary",
    count: 0,
  },
  {
    categoryId: 7,
    categoryName: "Commerical Library",
    id: "commercialLibrary",
    count: 0,
  },
  {
    categoryId: 8,
    categoryName: "Delta Software Tool",
    id: "deltaSoftwareTool",
    count: 0,
  },
];

const ItemInCart = (props) => {
  let { item, elem, onDelete, intl, isEn, categoryMap } = props;
  let handleDelete = () => {
    onDelete(item.id);
  };
  let categoryName = "";

  let functionLabel = "";
  let brandLabel = "";

  let mappingObjs = Object.entries(categoryMap).map((el) => el[1]);
  let mappingKeys = Object.keys(categoryMap);
  mappingObjs.forEach((el, index) => {
    if (el.id === item.categoryId) {
      functionLabel = isEn ? el.label1EN : el.label1TC;
      brandLabel = isEn ? el.label2EN : el.label2TC;
      categoryName = mappingKeys[index];
    }
  });
  let functionType = isEn ? item.categoryNameEN : item.categoryNameTC;
  if (props.freewareCategoryId) {
    functionLabel = "Function";
    brandLabel = "Brand";
    functionType = isEn
      ? item.productFamilycategoryNameEN
      : item.productFamilycategoryNameTC;
  }

  let price = showWithDefault(item.referencePrice, "--");
  if (price !== "--") {
    price = item.referencePrice.toLocaleString();
  }
  let currency = item.referenceCurrency ? item.referenceCurrency : "";
  let assetImage = item.graph ? `${backServerIP}/image/show/${item.graph}` : "";

  return (
    <CartItem>
      <ItemCol xs="3" sm="4" md="4" lg="2">
        <LogoImage
          style={{ width: "100%", maxWidth: "140px" }}
          src={assetImage}
        ></LogoImage>
      </ItemCol>
      <ItemCol xs="7" sm="8" md="8" lg="4">
        {/* TODO: 2024-11-18 加入tooltip: 使用共用元件 */}
        <SoftwareName>
          {item.assetName}
          {props.freewareCategoryId && (
            <span style={{ position: "relative" }}>
              <BlueDotTooltip
                content={item.remark}
                placement="top"
                top={3}
                right={-17}
              />
            </span>
          )}
        </SoftwareName>
        <SoftwareDesc>
          {isEn ? elem.assetDescEN : elem.assetDescTC}
        </SoftwareDesc>
      </ItemCol>
      <ItemCol xs="5" sm="6" md="8" lg="3">
        <ItemInfo>{`${brandLabel}: ${item.brandName}`}</ItemInfo>
        {props.freewareCategoryId ? (
          <ItemInfo>{`CategoryName: ${categoryName}`}</ItemInfo>
        ) : (
          <ItemInfo>{`${intl.formatMessage({
            id: "cart.category",
          })}: ${categoryName}`}</ItemInfo>
        )}
        <ItemInfo>{`${functionLabel}: ${functionType}`}</ItemInfo>
      </ItemCol>
      {props.freewareCategoryId ? (
        <ItemCol
          xs="7"
          sm="6"
          md="4"
          lg="3"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <ItemInfo style={{ width: "-webkit-fill-available" }}>
            {`${intl.formatMessage({
              id: "swassetmgt.freewareTab.listType",
            })}: `}
            <span>
              {/* TODO: 2024-11-18 listType */}
              {item.listType
                ? intl.formatMessage({
                    id: `swassetmgt.freewareTab.listType${item.listType}`,
                  })
                : ""}
            </span>
          </ItemInfo>
          <BlockButton
            className="delete-cart-item-button"
            color="danger"
            variant="outline"
            onClick={handleDelete}
          >
            <FormattedMessage id="cart.delete" />
          </BlockButton>
        </ItemCol>
      ) : (
        <ItemCol xs="7" sm="6" md="4" lg="3">
          <ItemInfo>
            {`${intl.formatMessage({ id: "cart.price" })}:   `}
            <span
              style={{ color: "green", fontWeight: "bold" }}
            >{`${currency} ${price}`}</span>
          </ItemInfo>
          <ItemInfo>
            {`${intl.formatMessage({ id: "cart.stock" })}:   `}
            <span
              style={{
                color: item.isValid === 1 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {item.isValid === 1 ? "Available" : "Not Available"}
            </span>
          </ItemInfo>
          <BlockButton
            className="delete-cart-item-button"
            color="danger"
            variant="outline"
            onClick={handleDelete}
          >
            <FormattedMessage id="cart.delete" />
          </BlockButton>
        </ItemCol>
      )}
    </CartItem>
  );
};

const DeleteDetailIcon = (props) => {
  let { onClick, item } = props;
  let handleClick = () => {
    onClick(item);
  };
  return (
    <DeleteIcon
      style={{ marginTop: "8px", color: "#FF5252" }}
      onClick={handleClick}
    />
  );
};
const UpdateDetailIcon = (props) => {
  let { onClick, item } = props;
  let handleClick = () => {
    onClick(item);
  };
  return (
    <EditIcon
      onClick={handleClick}
      style={{ color: "rgb(76, 175, 80)", marginTop: "8px" }}
    />
  );
};

const ItemInList = (props) => {
  let { onEdit, onDelete, computer, assets } = props;
  let [open, setOpen] = useState(false);

  let openSwitch = assets.length > 1;

  return (
    <ListItem
      button
      style={{
        maxHeight: open ? "500px" : "58px",
        overflow: "hidden",
        alignItems: "start",
      }}
    >
      <ListItemIcon>
        <UpdateDetailIcon onClick={onEdit} item={computer} />
      </ListItemIcon>
      <ListItemIcon>
        <DeleteDetailIcon onClick={onDelete} item={computer} />
      </ListItemIcon>
      {openSwitch && (
        <ListItemIcon
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open ? (
            <ExpandLess style={{ marginTop: "8px" }} />
          ) : (
            <ExpandMore style={{ marginTop: "8px" }} />
          )}
        </ListItemIcon>
      )}
      {!openSwitch && (
        <ListItemIcon>
          <ExpandLess
            style={{ marginTop: "8px", color: "transparent", cursor: "auto" }}
          />
        </ListItemIcon>
      )}
      <div style={{ minWidth: "18%", paddingTop: "6px" }}>
        <p style={{ fontSize: "16px", lineHeight: "1.8rem" }}>{computer}</p>
      </div>
      <div style={{ minWidth: "60%", paddingTop: "6px" }}>
        {assets.map((el) => {
          return (
            <p
              key={el.id}
              className={"ellipsis"}
              style={{ width: "100%", fontSize: "16px", lineHeight: "1.8rem" }}
            >
              {el.assetName}
            </p>
          );
        })}
      </div>
    </ListItem>
  );
};

const ItemInCurrentCategory = (props) => {
  const { details = {}, onDelete, onEdit, intl, menuList } = props;

  return (
    <List
      component="nav"
      style={{
        width: "100%",
        border: "1px solid",
        borderColor: "#B0B6BA",
        paddingTop: "0",
        paddingBottom: "0",
      }}
    >
      <ListItem style={{ backgroundColor: "#B0B6BA" }}>
        <ListItemText
          style={{ maxWidth: "165px" }}
          primary={intl.formatMessage({ id: "cart.actions" })}
        />
        <div className="" style={{ minWidth: "18%" }}>
          <div
            className="MuiTypography-body1"
            style={{ fontSize: "16px", lineHeight: "2rem" }}
          >
            {intl.formatMessage({ id: "cart.modal.computerName" })}
          </div>
        </div>
        <div className="MuiListItemText-root" style={{ minWidth: "60%" }}>
          <div className="" style={{ fontSize: "16px", lineHeight: "2rem" }}>
            {intl.formatMessage({ id: "cart.modal.assets" })}
          </div>
        </div>
      </ListItem>
      {Object.keys(details).map((el, index) => {
        return (
          <ItemInList
            key={index}
            computer={el}
            assets={menuList.filter((e) => details[el].includes(e.id))}
            onDelete={onDelete}
            onEdit={onEdit}
          ></ItemInList>
        );
      })}
    </List>
  );
};

const CartOverlay = (props) => {
  let {
    deleteCartItem,
    removeDetails,
    computerNames,
    installationDetails = {},
    sendInstallApplication,
    setShowAlert,
    categories,
    categoryMap,
    userFunctions,
    getUser,
  } = props;
  let isEn = props.locale === "en-US";
  let freewareCategoryId =
    userFunctions["home"]?.childs?.["freeware"]?.categoryId;
  let allCate = [...allCategory];

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [categoryList, setCategoryList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [categoryId, setCategoryId] = useState(5);
  const [menuItems, setMenuItems] = useState([]);
  const [foucsComputer, setFoucsComputer] = useState("");
  const [selectedApplyType, setSelectedApplyType] = useState(2);
  const intl = useIntl();
  let handleClickAdd = () => {
    setFoucsComputer("");
    setShowForm(true);
  };
  let handleClickEdit = (i) => {
    setFoucsComputer(i);
    setShowForm(true);
  };
  let handleSend = (reasons) => {  
        sendInstallApplication(reasons,sendInstallApplicationCategory);
  };
  let handleDeleteCartItem = (id) => {
    setShowAlert({
      title: intl.formatMessage({ id: `common.title` }),
      message: intl.formatMessage({ id: `cart.modal.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        deleteCartItem(id);
      },
    });
  };
  let handleDeleteDetail = (details) => {
    setShowAlert({
      title: intl.formatMessage({ id: `common.title` }),
      message: intl.formatMessage({ id: `cart.modal.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        removeDetails(details);
      },
    });
  };

  useEffect(() => {
    props.getCartList();
  }, []);

  useEffect(() => {
    let newList = [];
    let currId = categoryId;
    if (categories) {
      categories.forEach((outer) => {
        allCate.forEach((inner) => {
          if (outer.categoryNameEN === inner.categoryName) {
            inner.categoryId = outer.id;
          }
        });
      });
    }

    let first = false;
    allCate.forEach((elem, index) => {
      let count = props.cart.filter(
        (item) => item.categoryId === elem.categoryId
      ).length;
      if (count > 0) {
        let newObj = elem;
        newObj.count = count;
        newList.push(newObj);
      }
    });

    setCategoryList([...newList]);
    setMenuItems([...props.cart.filter((item) => item.categoryId === currId)]);
    forceUpdate();
  }, [props.cart, props.show, categoryId]);
  useEffect(() => {
    let els = document.getElementsByClassName("cart-tabs");
    if (els.length > 0) {
      els[0].click();
    }
  }, [categoryList.length]);

  const [sendInstallApplicationCategory,setSendInstallApplicationCategory]=useState("")

  return (
    <Overlay className="cart-overlay" show={props.show}>
      <react.CHeader withSubheader>
        <CartHeaderWrapper>
          <react.CHeaderNav>
            <react.CHeaderNavItem className="px-3">
              <react.CHeaderNavLink
                onClick={props.closeOverlay}
                style={{ fontSize: "24px" }}
              >
                <CIcon size="xl" name="cil-x" />
              </react.CHeaderNavLink>
            </react.CHeaderNavItem>
            <react.CHeaderNavItem className="px-3">
              <react.CHeaderNavLink style={{ fontSize: "24px" }}>
                <FormattedMessage id="cart.title" />
              </react.CHeaderNavLink>
            </react.CHeaderNavItem>
          </react.CHeaderNav>
        </CartHeaderWrapper>
      </react.CHeader>
      <CartItemsContainer fluid>
        {props.cart.length > 0 && (
          <react.CTabs activeTab="home">
            <react.CNav variant="tabs">
              {categoryList
                .sort(function (a, b) {
                  return b.categoryId - a.categoryId;
                })
                .map((elem, index) => {
                  return (
                    <react.CNavItem
                      onClick={() => {
                        setSendInstallApplicationCategory(elem.id)
                        setCategoryId(elem.categoryId);
                      }}
                      active={index === 0 ? "true" : "false"}
                      key={`t${elem.categoryId}`}
                    >
                      <react.CNavLink
                        key={`tt${index}`}
                        active={elem.categoryId === categoryId}
                        className={"cart-tabs"}
                        data-tab={`t${elem.categoryId}`}
                      >
                        {`${intl.formatMessage({ id: `cart.${elem.id}` })} (${
                          elem.count
                        })`}
                      </react.CNavLink>
                    </react.CNavItem>
                  );
                })}
            </react.CNav>
            <react.CTabContent>
              {categoryId !== freewareCategoryId &&
                categoryList.map((elem, ind) => {
                  return (
                    <react.CTabPane
                      key={`tc${ind}`}
                      data-tab={`t${elem.categoryId}`}
                    >
                      {props.cart.map((item, index) => {
                        if (item.categoryId !== elem.categoryId) {
                          return null;
                        }
                        return (
                          <ItemInCart
                            categoryId={categoryId}
                            intl={intl}
                            key={`ci${index}`}
                            elem={elem}
                            item={item}
                            onDelete={handleDeleteCartItem}
                            isEn={isEn}
                            categoryMap={categoryMap}
                          ></ItemInCart>
                        );
                      })}
                    </react.CTabPane>
                  );
                })}
              {categoryId === freewareCategoryId && (
                <react.CNav variant="tabs">
                  {SW_ASSET_INFO.APPLY_TYPE.slice(0, 1).map((applyTypeItem) => {
                    return (
                      <react.CNavLink
                        key={applyTypeItem.id}
                        onClick={() => {
                          setSelectedApplyType(applyTypeItem.id);
                        }}
                        active={selectedApplyType === applyTypeItem.id}
                        className={"cart-tabs"}
                      >
                        {`${
                          isEn
                            ? applyTypeItem.cartValueEN
                            : applyTypeItem.cartValueTC
                        }(${
                          props.cart.filter((el) => {
                            return (
                              el.categoryId === categoryId &&
                              el.applyType === applyTypeItem.id
                            );
                          }).length
                        })`}
                      </react.CNavLink>
                    );
                  })}
                </react.CNav>
              )}
              {categoryId === freewareCategoryId &&
                props.cart.map((item, index) => {
                  if (item.categoryId === categoryId) {
                    return (
                      <ItemInCart
                        categoryId={categoryId}
                        intl={intl}
                        key={index}
                        elem={item}
                        item={item}
                        freewareCategoryId={freewareCategoryId}
                        onDelete={handleDeleteCartItem}
                        isEn={isEn}
                        categoryMap={categoryMap}
                      ></ItemInCart>
                    );
                  }
                  return null;
                })}
            </react.CTabContent>
          </react.CTabs>
        )}
        {props.cart.length === 0 && (
          <EmptyWrapper>
            <EmptyImg src={isEn ? emptyPicEn : emptyPicZh} />
          </EmptyWrapper>
        )}

        {props.cart.length > 0 && (
          <>
            <react.CRow>
              <p
                style={{
                  fontSize: "18px",
                  marginLeft: "15px",
                  marginTop: "30px",
                  fontWeight: "bold",
                }}
              >
                <FormattedMessage id="cart.form" />
              </p>
            </react.CRow>
            <react.CRow>
              <react.CCol sm="12">
                <react.CCard>
                  <react.CCardBody>
                    <FormWrapper>
                      <div style={{ padding: "8px" }}>
                        <div style={{ fontWeight: "1px", marginBottom: "4px" }}>
                          <FormattedMessage id="cart.installationDetail" />
                        </div>
                        <react.CButton
                          disabled={menuItems.length > 0 ? false : true}
                          onClick={handleClickAdd}
                          style={{
                            backgroundColor: "#0087DC",
                            color: "#fff",
                            cursor:
                              menuItems.length > 0 ? "pointer" : "default",
                          }}
                        >
                          <FormattedMessage id="cart.add" />
                        </react.CButton>
                      </div>
                      {Object.keys(installationDetails).length > 0 && (
                        <ItemInCurrentCategory
                          details={installationDetails}
                          onEdit={handleClickEdit}
                          onDelete={handleDeleteDetail}
                          openForm={setShowForm}
                          menuList={menuItems}
                          intl={intl}
                        ></ItemInCurrentCategory>
                      )}
                    </FormWrapper>
                  </react.CCardBody>
                  <SendFooter>
                    <SendWrapper>
                      <SendButton
                        disabled={
                          Object.keys(installationDetails).length > 0
                            ? false
                            : true
                        }
                        style={{
                          cursor:
                            Object.keys(installationDetails).length > 0
                              ? "pointer"
                              : "default",
                        }}
                        onClick={() => setShowSend(true)}
                        color="success"
                      >
                        <FormattedMessage id="cart.send" />
                      </SendButton>
                    </SendWrapper>
                  </SendFooter>
                </react.CCard>
              </react.CCol>
            </react.CRow>
          </>
        )}
        {/* {categoryId === freewareCategoryId && (
          <div
            style={{
              borderRadius: "1px",
              backgroundColor: "#e2e6ea",
              display: "flex",
              flexDirection: "row-reverse",
              marginTop: "20%",
            }}
          >
            <react.CButton
              onClick={() => {
                window.open(
                  "https://dgoa.deltaww.com/SmartFormV2/index.html?Type=INFRA&SubType=070"
                );
              }}
              style={{ width: "100px" }}
              color="success"
            >
              Apply
            </react.CButton>
          </div>
        )} */}
      </CartItemsContainer>
      <FormDialog
        show={showForm}
        toggle={setShowForm}
        computerNames={computerNames}
        assets={menuItems}
        formValue={foucsComputer}
        intl={intl}
      />
      <SendDialog
        show={showSend}
        toggle={setShowSend}
        title={intl.formatMessage({ id: `cart.modal.sendTitle` })}
        label={intl.formatMessage({ id: `cart.modal.reasons` })}
        save={handleSend}
        intl={intl}
      ></SendDialog>
    </Overlay>
  );
};

const mapStateToProps = (state) => ({
  locale: state.view.currentLocale,
  computerNames: state.user.computerNames,
  show: state.view.showCartOverlay,
  cart: state.cart.cart,
  installationDetails: state.cart.installationDetails,
  categories: state.search.categoryList,
  categoryMap: state.search.categoryMap,
  userFunctions: state.functions.map,
});
const mapDispatchToProps = (dispatch) => ({
  closeOverlay: () =>
    dispatch({
      type: "SET_SHOW_CART_OVERLAY",
      payload: false,
    }),
  getCartList: () =>
    dispatch({
      type: "getCartList",
    }),
  deleteCartItem: (id) =>
    dispatch({
      type: "removeItemInCart",
      payload: id,
    }),
  addDetails: (details) =>
    dispatch({
      type: Actions.ADD_INTO_DETAILS,
      payload: details,
    }),
  editDetails: (details) =>
    dispatch({
      type: Actions.EDIT_DETAILS,
      payload: details,
    }),
  removeDetails: (details) =>
    dispatch({
      type: Actions.REMOVE_FROM_DETAILS,
      payload: details,
    }),
  sendInstallApplication: (reasons,sendInstallApplicationCategory) =>
    dispatch({
      type: "sendInstallApplication",
      payload: { reasons,sendInstallApplicationCategory },
    }),
  setShowAlert: (props) =>
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartOverlay);
