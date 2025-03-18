import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import {
  CContainer,
  CButton,
  CRow,
  CCol,
  CInputGroup,
  CBreadcrumb,
  CBreadcrumbItem,
  CLabel,
  CInputCheckbox,
  CInputRadio,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Chip,
  SwipeableDrawer,
  Box,
  Button,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "styled-components";
import { SCREEN } from "../../Common/constants";
import { isMobile } from "../../Common/commonMethod";
import {
  SearchForm,
  SoftwareInfoModal,
  LogoImage,
  BlockButton,
} from "../uiComponents/index";
import { showWithDefault, backServerIP } from "../../Common/common";

import assetCart from "../../assets/icons/icon_asset_cart.png";
import inventoryStatus from "../../assets/icons/icon_Inventory_status.png";
import homeIcon from "../../assets/icons/home.svg";
import FreewareSoftwareItem from "../uiComponents/FreewareSoftwareItem";

const BreadcrumbContainer = styled(CRow)`
  margin-top: 20px;
  justify-content: flex-end;
  border-top: 1px solid;
  padding: 0;
  border-color: #666;
`;

const Breadcrumb = styled(CBreadcrumb)`
  padding-top: 0;
  border-bottom: 0;
  border-color: transparent;
`;

const CheckBoxContainer = styled(CRow)`
  margin-right: 5px;
  padding-left: 35px;
  width: 100%;
`;

const FilterAccordion = styled(Accordion)`
  box-shadow: none !important;
  background-color: transparent !important;
`;

const SoftwareName = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const SoftwareDesc = styled.div`
  width: 100%;
  overflow-wrap: anywhere;
  flex-grow: 1;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;
const SoftwareTags = styled.div`
  width: 100%;
  overflow-wrap: anywhere;
  margin-bottom: 0.5rem;
  visibility: hidden;
`;

const CartItemWrapper = styled(Paper)`
  padding: 3px;
  margin-bottom: 10px;
  width: 100%;
`;

const CartItem = styled(CRow)`
  margin: 0;
`;

const ItemCol = styled(CCol)`
  padding: 10px;
`;

const ItemInfoCol = styled(CCol)`
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  border-left: 1px solid;
  border-color: #ced2d8;
`;

const InstallCount = styled.p`
  margin-top: 42px;
  white-space: pre;
  font-size: 12px;
  margin: 4px 8px;
  vertical-align: baseline;
  min-width: 100px;
`;

const ItemStatus = styled.p`
  white-space: pre;
  font-size: 12px;
  margin: 4px 8px 16px;
  min-width: 100px;
`;

const ButtonContainer = styled(CRow)`
  height: 32px;
`;

const ItemButton = styled(CButton)`
  border-radius: 0;
  font-size: 12px;
  margin-right: 4px;
  height: 32px;
  padding: 6px 20px;
`;

const CartButton = styled(BlockButton)`
  border-radius: 0;
  height: 32px;
  width: 32px;
  font-size: 12px;
  padding: 4px;
`;

const Puller = styled(Box)`
  width: 4px;
  height: 40px;
  border-radius: 3px;
  position: absolute;
  left: 4px;
  background-color: #fff;
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    display: none;
  }
`;
const RightContainer = (props) => {
  let { width, show, setshow, xs, sm, xl } = props;
  let md = width && width < 992;
  let mobile = isMobile();

  if (!md || !mobile) {
    return (
      <RContainer xs={xs} sm={sm} xl={xl}>
        {props.children}
      </RContainer>
    );
  } else {
    return (
      <SwipeableDrawer
        sx={{ width: 250 }}
        open={show}
        anchor="left"
        onOpen={() => {
          setshow(true);
        }}
        onClose={() => {
          setshow(false);
        }}
      >
        {props.children}
      </SwipeableDrawer>
    );
  }
};

const RContainer = styled(CCol)`
  padding-bottom: 60px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const LeftContainer = styled(CCol)``;

const FilterWrapper = styled(AccordionDetails)`
  min-width: 203px;
`;

const SearchResultWrapper = styled(CRow)`
  margin-bottom: 8px;
`;

const SearchResultContainer = styled(CRow)`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const PaginationContainer = styled(CRow)`
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 60px;
`;

const SearchResult = styled.p`
  white-space: pre;
  padding-left: 15px;
  font-weight: bolder;
  font-size: 16px;
`;

const FilterActive = styled(Chip)`
  margin: 0 3px;
`;

const ClearAll = styled.a`
  display: block;
  margin-left: 8px;
  text-decoration: underline !important;
  font-weight: bolder;
  font-size: 16px;
  cursor: pointer;
`;
const InventoryStatus = styled.span`
  color: green;
  text-align: center;
  vertical-align: bottom;
`;

const sprUrl = process.env.REACT_APP_SAM_SOFTWARE_APPLICATION;

const FilterCheckbox = (props) => {
  let { name, count, id, checked, onClick } = props;
  let handleOnClick = () => {
    onClick(id);
  };
  let level = props.level ? props.level : 0;

  return (
    <CInputGroup style={{ marginLeft: `${level * 15}px`, minWidth: "100%" }}>
      <CInputCheckbox checked={checked} onChange={handleOnClick} />
      <CLabel style={{ cursor: "pointer" }} onClick={handleOnClick}>
        {name}
      </CLabel>
      <CLabel
        style={{ cursor: "pointer", textAlign: "right", flexGrow: "5" }}
        onClick={handleOnClick}
      >
        {showWithDefault(count, 0)}
      </CLabel>
    </CInputGroup>
  );
};

const FilterRadio = (props) => {
  let { name, count, id, checked, onClick, disabled } = props;
  let handleOnClick = () => {
    if (disabled) {
      return;
    }
    onClick(id);
  };
  let level = props.level ? props.level : 0;

  return (
    <CInputGroup style={{ marginLeft: `${level * 15}px`, minWidth: "100%" }}>
      <CInputRadio
        disabled={disabled}
        checked={checked}
        onClick={handleOnClick}
        onChange={() => {}}
      />
      <CLabel
        style={{ cursor: "pointer", color: disabled ? "#8a93a2" : "" }}
        onClick={handleOnClick}
      >
        {name}
      </CLabel>
      <CLabel
        style={{
          cursor: "pointer",
          color: disabled ? "#8a93a2" : "",
          textAlign: "right",
          flexGrow: "5",
        }}
        onClick={handleOnClick}
      >
        {showWithDefault(count, 0)}
      </CLabel>
    </CInputGroup>
  );
};

const ActiveFilter = (props) => {
  let { name, id, onDelete } = props;
  let handleOnDelete = () => {
    onDelete(id);
  };
  return (
    <FilterActive
      label={name}
      variant="outlined"
      size="small"
      onDelete={handleOnDelete}
    />
  );
};

const SoftwareItem = (props) => {
  let {
    item,
    addToCartFunc,
    showInfoFunc,
    inCart,
    isEn,
    deltaLibraryId,
    enableCategory,
  } = props;
  let isDeltaLibrary = item.secondCategoryId === deltaLibraryId;
  let isAvailable = item.isValid === 1;
  let intl = useIntl();
  const isEnable = !!enableCategory[item.secondCategoryId]?.addToAssetCart;

  let handleClickAdd = () => {
    addToCartFunc(item);
  };
  let handleClickInfo = () => {
    if (isDeltaLibrary && item.assetRefUrlEN) {
      window.open(isEn ? item.assetRefUrlEN : item.assetRefUrlTC);
    } else {
      showInfoFunc(item);
    }
  };
  let assetImage = `${backServerIP}/image/show/${item.graph}`;
  return (
    <CartItemWrapper>
      <CartItem>
        <ItemCol xs="4" sm="2" md="2" xl="2">
          <LogoImage
            style={{ width: "90%", height: "auto" }}
            src={assetImage}
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
          <SoftwareName>{item.assetName}</SoftwareName>
          <SoftwareDesc>
            {isEn ? item.assetDescEN : item.assetDescTC}
          </SoftwareDesc>
          <SoftwareTags>
            <span>{isEn ? item.categoryNameEN : item.categoryNameTC}</span>
          </SoftwareTags>
        </ItemCol>
        <ItemInfoCol xs="12" sm="5" md="4" xl="3">
          <ItemStatus>
            <CIcon src={inventoryStatus} width="16" height="16" />
            <InventoryStatus style={{ color: isAvailable ? "green" : "red" }}>
              {`   ${
                isAvailable
                  ? intl.formatMessage({ id: "search.available" })
                  : intl.formatMessage({ id: "search.notAvailable" })
              }`}
            </InventoryStatus>
          </ItemStatus>
          <ButtonContainer>
            <ItemButton
              color="dark"
              variant="outline"
              disabled={isDeltaLibrary && !item.assetRefUrlEN}
              onClick={handleClickInfo}
            >
              <FormattedMessage id="search.assetDetail" />
            </ItemButton>
            {!isDeltaLibrary && isEnable && (
              <CartButton
                color="info"
                disabled={inCart || !isAvailable}
                onClick={handleClickAdd}
              >
                <CIcon src={assetCart} width="16" height="16" />
              </CartButton>
            )}
          </ButtonContainer>
        </ItemInfoCol>
      </CartItem>
    </CartItemWrapper>
  );
};

const checkLogic = (id, currentList) => {
  if (typeof id === "undefined" || id === null) {
    return [""];
  }
  if (!currentList || currentList.length === 0) {
    return [id];
  }
  let idx = currentList.indexOf(id);
  let newArr = currentList;
  if (idx >= 0) {
    newArr.splice(idx, 1);
    return newArr;
  }
  newArr.push(id);
  return newArr;
};

const checkLogicCategory = (id, currentList) => {
  if (typeof id === "undefined" || id === null) {
    return [""];
  }
  if (!currentList || currentList.length === 0) {
    return [id];
  }
  let idx = currentList.indexOf(id);
  let newArr = currentList;
  if (idx >= 0) {
    newArr.splice(idx, 1);
    return newArr;
  }
  return [id];
};
const SearchPage = (props) => {
  let {
    pageNum,
    pageSize,

    categoryFilterList,
    searchCount,
    keyword,
    categoriesSelected,
    functionsSelected,
    brandsSelected,
    searchSoftware,
    addToCart,
    cart,
    width,
    functions,
    categoryListAndSubCategory,
    userFunctions,
    openOverlay,
  } = props;
  let functionFilterList = [];
  let brandFilterList = [];
  let itemFilterList = [];
  let softwareItems = [];
  let functionLabel = "";
  let brandLabel = "";
  const intl = useIntl();
  let [show, setShow] = useState(false);
  let [showInfo, setShowInfo] = useState(false);
  let [softwareInfo, setSoftwareInfo] = useState({});
  const [enableCategory, setEnableCategory] = useState({});
  let isEn = props.locale === "en-US";
  let hasFilter = categoriesSelected.length > 0 || brandsSelected.length > 0;
  let CategoryObject = userFunctions["home"].childs;
  let deltaLibraryId = CategoryObject["deltaLibrary"].categoryId;
  if (categoriesSelected.length > 0) {
    let categoryId = categoriesSelected[0];
    let subCategories = categoryFilterList.filter(
      (el) => el.id === categoryId
    )[0].categoryList;
    if (subCategories && subCategories.length > 0) {
      subCategories.sort((a, b) => {
        if (a.id > b.id) {
          return 1;
        }
        if (b.id > a.id) {
          return -1;
        }
        return 0;
      });
      functionFilterList = [...subCategories[0].categoryList];
      functionLabel = isEn
        ? subCategories[0].categoryNameEN
        : subCategories[0].categoryNameTC;

      if (subCategories[1]) {
        brandFilterList = [...subCategories[1].categoryList];
        brandLabel = isEn
          ? subCategories[1].categoryNameEN
          : subCategories[1].categoryNameTC;
      }
      if (subCategories[2]) {
        itemFilterList = [...subCategories[2].categoryList];
        brandLabel = isEn
          ? subCategories[2].categoryNameEN
          : subCategories[2].categoryNameTC;
      }
    }
  }

  if (props.softwareDetail && props.softwareDetail.code !== -1) {
    softwareItems = props.softwareDetail.data.list;
  }

  useEffect(() => {
    if (!keyword) {
      searchSoftware(
        "",
        categoriesSelected,
        functionsSelected,
        brandsSelected,
        1,
        pageSize
      );
    }
  }, []);

  useEffect(() => {
    const { childs } = functions?.home;
    const enableCategories = Object.values(childs).reduce((prev, curr) => {
      const { categoryId, userEnable, childs: cChild } = curr;
      const cChildArr = Object.entries(cChild);
      const childItems = cChildArr.length
        ? cChildArr?.reduce(
            (cPrev, cCurr) => ({ ...cPrev, [cCurr[0]]: cCurr[1].userEnable }),
            {}
          )
        : {};
      return {
        ...prev,
        [categoryId]: { enable: userEnable, ...childItems },
      };
    }, {});
    setEnableCategory(enableCategories);
  }, [functions]);
  const [CateId, setCateId] = useState(categoriesSelected[0]);
  
  let handleClickCategory = (id) => {
    // 使用console.log來調試id的值
    setCateId(id);
    // 確認state更新後的值
    let newCategories = checkLogicCategory(id, categoriesSelected);
    searchSoftware(keyword, newCategories, [], [], 1, pageSize);
  };
  let handleClickFunction = (id) => {
    let newFunctions = checkLogic(id, functionsSelected);
    searchSoftware(
      keyword,
      categoriesSelected,
      newFunctions,
      brandsSelected,
      1,
      pageSize
    );
  };
  let handleClickBrand = (id) => {
    let nextBrand = checkLogic(id, brandsSelected);
    searchSoftware(
      keyword,
      categoriesSelected,
      functionsSelected,
      nextBrand,
      1,
      pageSize
    );
  };
  let handlePageChange = (event, page) => {
    searchSoftware(
      keyword,
      categoriesSelected,
      functionsSelected,
      brandsSelected,
      page,
      pageSize
    );
  };
  let clearAll = () => {
    searchSoftware(keyword, [], [], [], 1, pageSize);
  };

  // 判斷是否在最後一頁
  const isLastPage = pageNum === props.softwareDetail.data.pages;

  let hasFreewareItem = (CateId === 3);
  
  const isSearchNull =
    (isLastPage ||
    softwareItems.length === 0 ||
    props.softwareDetail.data.total === 0) &&
    hasFreewareItem;
    
  return (
    <CContainer style={{ maxWidth: "100%" }}>
      <CRow>
        <CInputGroup>
          <SearchForm></SearchForm>
        </CInputGroup>
      </CRow>
      <BreadcrumbContainer>
        <Breadcrumb style={{ marginBottom: "0px" }}>
          <CBreadcrumbItem>
            <CLink to={{ pathname: `/` }}>
              <CIcon src={homeIcon} width="16" height="16" />
            </CLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>
            <FormattedMessage id="search.breadcrumb" />
          </CBreadcrumbItem>
        </Breadcrumb>
      </BreadcrumbContainer>
      <Puller
        onClick={() => {
          setShow(true);
        }}
      />
      <CRow>
        <RightContainer
          sm="5"
          md="4"
          xl="3"
          show={show}
          setshow={setShow}
          width={width}
        >
          <FilterAccordion defaultExpanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                <FormattedMessage id="search.category" />
              </Typography>
            </AccordionSummary>
            <FilterWrapper>
              <CheckBoxContainer>
                {categoryFilterList.map((elem, index) => (
                  <FilterRadio
                    key={`c${index}`}
                    name={isEn ? elem.categoryNameEN : elem.categoryNameTC}
                    checked={categoriesSelected.includes(elem.id)}
                    id={elem.id}
                    disabled={
                      elem.isValid === 0 || !enableCategory[elem.id]?.enable
                    }
                    count={elem.count}
                    onClick={handleClickCategory}
                  ></FilterRadio>
                ))}
              </CheckBoxContainer>
            </FilterWrapper>
          </FilterAccordion>
          {categoryListAndSubCategory?.largeCategory?.map((elem, ind) => {
            return (
              <FilterAccordion defaultExpanded={true} key={`faa${ind}`}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  key={`fa${ind}`}
                >
                  <Typography key={`ft${ind}`}>
                    {isEn ? elem.categoryNameEN : elem.categoryNameTC}
                  </Typography>
                </AccordionSummary>
                <FilterWrapper>
                  <CheckBoxContainer>
                    {elem.subCategory.map((el, index) => {
                      return (
                        <FilterCheckbox
                          key={`f${index}`}
                          name={isEn ? el.categoryNameEN : el.categoryNameTC}
                          checked={functionsSelected.includes(el.id)}
                          id={el.id}
                          disabled={el.isValid === 0 || !enableCategory[el.id]}
                          onClick={handleClickFunction}
                          count={el.count}
                          level={el.level}
                        ></FilterCheckbox>
                      );
                    })}
                  </CheckBoxContainer>
                </FilterWrapper>
              </FilterAccordion>
            );
          })}
        </RightContainer>
        <LeftContainer sm="7" md="8" xl="9">
          <SearchResultWrapper>
            <SearchResult>
              {`${showWithDefault(searchCount, 0)} ${intl.formatMessage({
                id: "search.total",
              })}`}
              {hasFilter && " / "}
            </SearchResult>
            {categoriesSelected &&
              categoriesSelected.map((elem, index) => {
                let item = categoryFilterList.filter((e) => e.id === elem)[0];
                if (!item) {
                  return null;
                }
                return (
                  <ActiveFilter
                    key={`ac${index}`}
                    name={isEn ? item?.categoryNameEN : item?.categoryNameTC}
                    id={elem}
                    onDelete={handleClickCategory}
                  />
                );
              })}
            {functionsSelected.map((elem, index) => {
              let item = functionFilterList.filter((e) => e.id === elem)[0];
              let item2 = brandFilterList.filter((e) => e.id === elem)[0];
              let item3 = itemFilterList.filter((e) => e.id === elem)[0];
              if (!item && !item2 && !item3) {
                return null;
              }
              return (
                <ActiveFilter
                  key={`af${index}`}
                  name={
                    isEn
                      ? item?.categoryNameEN ??
                        item2?.categoryNameEN ??
                        item3?.categoryNameEN
                      : item?.categoryNameTC ??
                        item2?.categoryNameTC ??
                        item3?.categoryNameTC
                  }
                  id={elem}
                  onDelete={handleClickFunction}
                />
              );
            })}
            {brandsSelected &&
              brandsSelected.map((elem, index) => {
                let item = brandFilterList.filter((e) => e.id === elem)[0];
                // if (!item) {
                //   return null;
                // }
                return (
                  <ActiveFilter
                    key={`br${index}`}
                    name={isEn ? item?.categoryNameEN : item?.categoryNameTC}
                    id={elem}
                    onDelete={handleClickBrand}
                  />
                );
              })}
            {hasFilter && (
              <ClearAll onClick={clearAll}>
                <FormattedMessage id="search.clear" />
              </ClearAll>
            )}
          </SearchResultWrapper>
          <SearchResultContainer>
            {softwareItems?.map((item, index) => {
              switch (item.secondCategoryId) {
                case CategoryObject["freeware"].categoryId:
                  return (
                    <FreewareSoftwareItem
                      key={`si${index}-${pageNum}`}
                      openOverlay={openOverlay}
                      item={item}
                      inCart={
                        cart.filter((e) => e.assetId === item.assetId).length >
                        0
                      }
                    />
                  );
                default:
                  return (
                    <SoftwareItem
                      key={`si${index}`}
                      item={item}
                      addToCartFunc={addToCart}
                      showInfoFunc={(item) => {
                        setShowInfo(true);
                        setSoftwareInfo(item);
                      }}
                      inCart={
                        cart.filter((e) => e.assetId === item.assetId).length >
                        0
                      }
                      isEn={isEn}
                      deltaLibraryId={deltaLibraryId}
                      enableCategory={enableCategory}
                    ></SoftwareItem>
                  );
              }
            })}
          </SearchResultContainer>
          {isSearchNull ? (
            <PaginationContainer>
              <FormattedMessage id="search.installationReviewTip" />
              <CButton
                color="info"
                style={{ marginBottom: "10px" }}
                onClick={() => {
                  window.open(`${sprUrl}#/?Type=OTH&SubType=FW`, "_blank");
                }}
              >
                <FormattedMessage id="search.installationReviewBtn" />
              </CButton>
            </PaginationContainer>
          ) : (
            props.softwareDetail &&
            props.softwareDetail.data.pages > 1 && (
              <PaginationContainer>
                {/* 在最後一頁且包含 FreewareSoftwareItem 時顯示按鈕 */}
                {isLastPage && hasFreewareItem && (
                  <>
                    <FormattedMessage id="search.installationReviewTip" />
                    <CButton
                      color="info"
                      style={{ marginBottom: "10px" }}
                      onClick={() => {
                        window.open(
                          `${sprUrl}#/?Type=OTH&SubType=FW`,
                          "_blank"
                        );
                      }}
                    >
                      <FormattedMessage id="search.installationReviewBtn" />
                    </CButton>
                  </>
                )}
                <Pagination
                  page={pageNum}
                  count={props.softwareDetail.data.pages}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                />
              </PaginationContainer>
            )
          )}
        </LeftContainer>
      </CRow>
      <SoftwareInfoModal
        i18nRef={categoriesSelected}
        show={showInfo}
        item={softwareInfo}
        toggleFunc={setShowInfo}
        deltaLibraryId={deltaLibraryId}
      ></SoftwareInfoModal>
    </CContainer>
  );
};

const mapStateToProps = (state) => ({
  locale: state.view.currentLocale,
  cart: state.cart.cart,
  categoryFilterList: state.search.categoryFilterList,
  softwareDetail: state.search.softwareDetail,
  keyword: state.search.keyword,
  categoriesSelected: state.search.categoriesSelected,
  functionsSelected: state.search.functionsSelected,
  brandsSelected: state.search.brandsSelected,
  searchCount: state.search.searchCount,
  categories: state.search.categoryList,
  pageNum: state.search.softwareDetail.data.pageNum,
  pageSize: state.search.softwareDetail.data.pageSize,
  categoryListAndSubCategory: state.search.categoryListAndSubCategory,
  userFunctions: state.functions.map,
});
const mapDispatchToProps = (dispatch) => ({
  searchSoftware: (
    q,
    categoriesSelected,
    functionsSelected,
    brandsSelected,
    pageNum,
    pageSize
  ) =>
    dispatch({
      type: "searchSoftware",
      payload: {
        q,
        categoriesSelected,
        functionsSelected,
        brandsSelected,
        pageNum,
        pageSize,
      },
    }),
  addToCart: (item) =>
    dispatch({
      type: "addIntoCart",
      payload: item,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
