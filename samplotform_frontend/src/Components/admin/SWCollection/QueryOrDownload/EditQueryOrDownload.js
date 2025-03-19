import React, { useEffect, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TextField,
} from "@mui/material";
import { SWCollectionReportSubCols } from "src/constants/admin/SWCollection";
import {
  CostCenterBgSelector,
  CostCenterBuSelector,
  CostCenterQuery,
  TableHeadContainer,
  FilterGroup,
  FilterContainer,
  ProductNameSelector,
  BrandSelector,
} from "src/Components/admin/common";
import { Buttons, BUTTON_TYPES, ModalContainer } from "src/Components/common";
import { Actions, LATEST } from "src/constants/common";
import { ACTIONS } from "src/Reducers/admin/SWCollection/SWReportReducer";
import Api from "src/api/admin/CostCenterApi";
import FormHelperText from '@mui/material/FormHelperText'; 
import { FormattedMessage } from 'react-intl'

const EditQueryOrDownload = (props) => {
  const dispatch = useDispatch();

  const {
    show,
    toggle,
    intl,
    handleSave,
    focusUser,
    getYearSwCollectionDetail,
    yearSwCollectionDetailList,
    getYearPlanList,
    swYearPlanList,
    getCostcenterAndBgBu,
  } = props;
  const [bg, setBg] = useState("");
  const [bu, setBu] = useState("");
  const [costDept, setCostDept] = useState("");
  const [brand, setBrand] = useState("");
  const [productName, setProductName] = useState("");
  const [unitPriceTWD, setUnitPriceTWD] = useState("");
  const [unitPriceUSD, setUnitPriceUSD] = useState("");
  const [installedQty, setInstalledQty] = useState("");
  const [budgetQty, setBudgetQty] = useState("");
  const [planToAddRemoveQty, setPlanToAddRemoveQty] = useState("");
  const [budgetAmountTWD, setBudgetAmountTWD] = useState("");
  const [budgetAmountUSD, setBudgetAmountUSD] = useState("");
  const [planId, setPlanId] = useState("");
  const [open, setOpen] = useState(false);
  const [assetId, setAssetId] = useState("");
  const [swCollectionId, setSwId] = useState(null);
  const [sourceSystemId, setSourceSystemId] = useState("");
  const [swCollectionNewId, setSwNewId] = useState(null);
  const [status, setStatus] = useState(""); // 1:costCenter 2：bg-bu
  const [keyword, setKeyword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [tips, setTips] = useState("*message need to complete");
  const [isMainFlag, setIsMainFlag] = useState(1);
  const swProductNameList = useSelector(
    (state) => state.swCollection.swProductNameList
  );

  useEffect(() => {
    getYearPlanList();
  }, []);
  useEffect(() => {
    if (show) {
      // getCostcenterAndBgBu(keyword);
      if (focusUser && Object.keys(focusUser).length === 0) {
        setBg("");
        setBu("");
        setPlanId(swYearPlanList);
        setCostDept("");
        setBrand("");
        setProductName("");
        setAssetId("");
        setUnitPriceTWD("");
        setUnitPriceUSD("");
        setInstalledQty("");
        setBudgetQty("");
        setPlanToAddRemoveQty("");
        setBudgetAmountTWD("");
        setBudgetAmountUSD("");
        setSwId(null);
        setSwNewId(null);
        setSourceSystemId("");
        dispatch({
          type: ACTIONS.SET_SW_COST_CENTER,
          payload: "",
        });
      } else {
        let {
          swCollectionId,
          bg,
          bu,
          costCenter,
          planId,
          productName,
          brandId,
          assetId,
          unitPriceTWD,
          unitPriceUSD,
          installedQty,
          budgetQty,
          totalQty,
          planToAddRemoveQty,
          sourceSystemId,
          newId,
        } = focusUser;
        setBg(bg);
        setBu(bu);
        setSwId(swCollectionId);
        setCostDept(costCenter);
        setPlanId(planId);
        setBrand(brandId);
        setAssetId(assetId || "");
        setProductName(productName || "");
        setUnitPriceTWD(unitPriceTWD);
        setUnitPriceUSD(unitPriceUSD);
        setInstalledQty(installedQty);
        setBudgetQty(budgetQty);
        setSwNewId(newId);
        setPlanToAddRemoveQty(planToAddRemoveQty);
        setSourceSystemId(sourceSystemId);
        dispatch({
          type: ACTIONS.SET_SW_COST_CENTER,
          payload: costCenter,
        });
      }
    }
  }, [show]);

  // useEffect(() => {
  //   debugger;
  //   getCostcenterAndBgBu(keyword);
  //   if (keyword === "") {
  //     setBg("");
  //     setBu("");
  //   }
  //   console.log(keyword);
  //   // }
  // }, [keyword]);

  const getBgBuByCostCenter = async (costDept) => {
    let data = null;

    try {
      const { status, data: _data } = await Api.getBgBuByCostCenter(costDept);

      data = status !== 200 || _data?.code !== 0 ? null : _data.data;
    } catch (error) {
      data = null;
      console.error(error);
    } finally {
      setBg(data?.bg ?? "");
      setBu(data?.bu ?? "");
    }
  };

  useEffect(() => {
    if (!costDept) {
      return;
    }

    getBgBuByCostCenter(costDept);
  }, [costDept]);

  let handleKeyUp = (e, v) => {
    setKeyword(v);
  };
  let onCostDeptChange = (v) => {
    setCostDept(v);
  };
  useEffect(() => {
    if (
      costDept !== "" &&
      costDept !== null &&
      brand !== "" &&
      brand !== null &&
      productName !== "" &&
      productName !== null &&
      planId !== "" &&
      planId !== null &&
      assetId !== "" &&
      assetId !== null
    ) {
      if (costDept === "" || costDept === null) {
        setCostDept(null);
      }
      if (bg === "" || bg === null) {
        setBg(null);
      }
      if (bu === "" || bu === null) {
        setBu(null);
      }
      getYearSwCollectionDetail(
        brand,
        planId,
        swCollectionNewId,
        costDept,
        assetId
      );
    }
  }, [brand, productName, costDept, assetId]);
  useEffect(() => {
    if (installedQty !== "" && budgetQty !== "") {
      setPlanToAddRemoveQty(Number(budgetQty) - Number(installedQty));
    }
  }, [installedQty, budgetQty]);
  useEffect(() => {
    if (swCollectionId === "") {
      setSwId(null);
    }
  }, [swCollectionId]);
  useEffect(() => {
    if (unitPriceTWD !== "" && budgetQty !== "") {
      setBudgetAmountTWD((unitPriceTWD * budgetQty).toFixed(3));
    }
  }, [unitPriceTWD, budgetQty]);
  useEffect(() => {
    // setInstalledQty(3);
    setInstalledQty(yearSwCollectionDetailList.length);
  }, [yearSwCollectionDetailList]);
  useEffect(() => {
    if (unitPriceUSD !== "" && budgetQty !== "") {
      setBudgetAmountUSD((unitPriceUSD * budgetQty).toFixed(3));
    }
  }, [unitPriceUSD, budgetQty]);
  useEffect(() => {
    if (swProductNameList.length > 0) {
      swProductNameList.forEach((el) => {
        if (el.assetId === assetId) {
          setUnitPriceTWD(el.referencePriceTWD || 0);
          setUnitPriceUSD(el.referencePriceUSD || 0);
          setSourceSystemId(el.sourceSystemId);
          setProductName(el.productName);
        }
      });
    }
  }, [assetId, swProductNameList]);
  useEffect(() => {
    if (
      bg === "" ||
      bg === null ||
      bu === "" ||
      bu === null ||
      assetId === "" ||
      assetId === null ||
      budgetQty === "" ||
      budgetQty === null ||
      installedQty === "" ||
      installedQty === null ||
      costDept === "" ||
      costDept === null
    ) {
      setTips("*message need to complete");
      setIsSubmit(false);
    } else {
      setIsSubmit(true);
    }
  }, [bg, bu, assetId, brand, budgetQty, installedQty, costDept]);
  const handleBgChange = (event, value) => {
    if (!event) {
      return;
    }
    let bgName = event.target.value;
    setBg(bgName);
  };
  const handleBuChange = (event) => {
    if (!event) {
      return;
    }
    let buName = event.target.value;
    setBu(buName);
  };
  const handleBrandChange = (event) => {
    if (!event) {
      return;
    }
    let brandId = event.target.value;
    setBrand(brandId);
    setAssetId("");
    setProductName("");
  };
  const handleProductName = (event) => {
    if (!event) {
      return;
    }
    let swPlist = swProductNameList.filter((item) => {
      return item.assetId === event.target.value;
    });
    if (swPlist.length > 0) {
      setProductName(swPlist[0].productName);
      // 會存在null的情況
      if(swPlist[0].mainFlag !== null){
        setIsMainFlag(swPlist[0].mainFlag)
      }else{
        setIsMainFlag(1)
      }
    }
    setAssetId(event.target.value);
  };
  const handleBudgetQty = (e) => {
    setBudgetQty(e.target.value);
  };

  const handleSubmit = () => {
    // {"assetId":20230005,"brandId":4,"budgetCount":"12","costCenterCode":"00000000","installedCount":2,"sourceSystemId":1,"swCollectionId":null,"differenceCount":10}
    let brandId = brand,
      budgetCount = budgetQty,
      costCenterCode = costDept,
      installedCount = installedQty,
      differenceCount = planToAddRemoveQty,
      sourceSId = sourceSystemId === "" ? 1 : sourceSystemId;
    let params = {
      assetId,
      bg,
      bu,
      brandId,
      budgetCount,
      costCenterCode,
      installedCount,
      sourceSystemId: sourceSId,
      swCollectionId,
      differenceCount,
    };
    handleSave(params);
    toggle(false);
  };

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <ModalContainer
      open={show}
      maxWidth="md"
      setOpen={() => {
        toggle(false);
      }}
      title={
        focusUser && Object.keys(focusUser).length === 0
          ? "Add SW Data"
          : intl.formatMessage({ id: "swCollection.SWYear.editTile" })
      }
      buttons={
        <>
          {isSubmit ? (
            ""
          ) : (
            <span style={{ color: "#FF0000", fontSize: "10px" }}>{tips}</span>
          )}
          <Buttons
            type={BUTTON_TYPES.SAVE}
            disabled={!isSubmit}
            onClick={handleSubmit}
          />
        </>
      }
    >
      <TableContainer>
        <TableHeadContainer>
          <FilterContainer>
            <CostCenterQuery
              setInfo={onCostDeptChange}
              intl={intl}
              label={intl.formatMessage({
                id: "ADMIN.COMMON.FORM_CONTROL_LABEL.COST_CENTER",
              })}
              value={costDept ?? ""}
            />
          </FilterContainer>
          <FilterContainer>
            <CostCenterBgSelector
              year={LATEST}
              showCheckbox={false}
              value={bg ?? ""}
              onChange={(event) => handleBgChange(event, bg)}
            />
          </FilterContainer>

          <FilterContainer>
            <CostCenterBuSelector
              year={LATEST}
              showCheckbox={false}
              value={bu ?? ""}
              selectedBgName={bg ?? ""}
              onChange={(event) => handleBuChange(event, bu)}
            />
          </FilterContainer>
        </TableHeadContainer>
        <TableHeadContainer>
          <FilterGroup>
            <FilterContainer>
              <BrandSelector
                showCheckbox={false}
                value={brand ?? ""}
                onChange={(event) => handleBrandChange(event, brand)}
              />
            </FilterContainer>
            <FilterContainer>
              <ProductNameSelector
                style={{width:'15%'}}
                showCheckbox={false}
                value={assetId ?? ""}
                selectedBrandId={brand}
                onChange={(event) => handleProductName(event, assetId)}
              />
              {!isMainFlag && (  
                  <FormHelperText style={{ color: 'red',marginLeft: 0 }}><FormattedMessage id="swCollection.SWYear.mainProductTips" /></FormHelperText>
               )}
            </FilterContainer>
          </FilterGroup>
          <FilterGroup>
            <FilterContainer>
              <TextField
                variant="standard"
                required
                style={{ width: "100%" }}
                disabled
                value={unitPriceTWD}
                label={intl.formatMessage({
                  id: "swCollection.SWYear.unitPriceTWD",
                })}
              />
            </FilterContainer>
            <FilterContainer>
              <TextField
                variant="standard"
                required
                style={{ width: "100%" }}
                disabled
                value={unitPriceUSD}
                label={intl.formatMessage({
                  id: "swCollection.SWYear.unitPriceUSD",
                })}
              />
            </FilterContainer>
          </FilterGroup>
        </TableHeadContainer>
        <TableHeadContainer>
          <FilterGroup
            style={{
              width: "10%",
              display: "flex",
              alignItems: "flex-end",
              padding: "0px",
            }}
          >
            <FilterContainer>
              <TextField
                variant="standard"
                required
                disabled
                value={installedQty}
                label={intl.formatMessage({
                  id: "swCollection.SWYear.installedQty",
                })}
              />
            </FilterContainer>
            <FilterContainer>
              <a
                href="#"
                onClick={handleClick}
                style={{ color: "#1890DC", textDecoration: "underline" }}
              >
                detail
              </a>
            </FilterContainer>
          </FilterGroup>
          <FilterGroup>
            <FilterContainer>
              <TextField
                variant="standard"
                required
                style={{ width: "100%" }}
                onChange={handleBudgetQty}
                value={budgetQty}
                label={intl.formatMessage({
                  id: "swCollection.SWYear.budgetQty",
                })}
              />
            </FilterContainer>
            <FilterContainer>
              <TextField
                variant="standard"
                required
                style={{ width: "100%" }}
                disabled
                value={planToAddRemoveQty}
                label={intl.formatMessage({
                  id: "swCollection.SWYear.planToAddRemoveQty",
                })}
              />
            </FilterContainer>
          </FilterGroup>
        </TableHeadContainer>
        <TableHeadContainer>
          <FilterGroup>
            {open ? (
              <FilterContainer>
                <div
                  style={{
                    padding: "16px 20px",
                    background: "#C8E6C9",
                    borderColor: "#909B90",
                  }}
                >
                  <h6>Installed Count Details:</h6>
                  <SWReportSubTable
                    yearSwCollectionDetailList={yearSwCollectionDetailList}
                  />
                </div>
              </FilterContainer>
            ) : (
              <FilterContainer />
            )}
          </FilterGroup>
          <FilterGroup>
            <FilterContainer>
              <TextField
                variant="standard"
                required
                style={{ width: "100%" }}
                disabled
                value={budgetAmountTWD}
                label={intl.formatMessage({
                  id: "swCollection.SWYear.budgetAmountTwd",
                })}
              />
            </FilterContainer>
            <FilterContainer>
              <TextField
                variant="standard"
                required
                style={{ width: "100%" }}
                disabled
                value={budgetAmountUSD}
                label={intl.formatMessage({
                  id: "swCollection.SWYear.budgetAmountUsd",
                })}
              />
            </FilterContainer>
          </FilterGroup>
        </TableHeadContainer>
      </TableContainer>
    </ModalContainer>
  );
};
const SWReportSubTable = (props) => {
  const { yearSwCollectionDetailList } = props;

  const subColumns = [...SWCollectionReportSubCols]
  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  background: "#B0B6BA",
                  padding: "5px",
                  textAlign: "center",
                }}
                key={0}
              >
                No
              </TableCell>
              {subColumns.map((column) => {
                return (
                  <TableCell
                    style={{
                      background: "#B0B6BA",
                      padding: "5px",
                      textAlign: "center",
                    }}
                    key={column.id}
                  >
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {yearSwCollectionDetailList.map((result, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    style={{ padding: "5px", textAlign: "center" }}
                    key={index}
                  >
                    {index + 1}{" "}
                  </TableCell>
                  {subColumns.map((column) => {
                    let value = result[column.id];
                    return (
                      <TableCell
                        style={{ padding: "5px", textAlign: "center" }}
                        key={column.id}
                      >
                        {column.viewCallback(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  yearSwCollectionDetailList: state.swCollection.yearSwCollectionDetailList,
  swYearPlanList: state.swCollection.swYearPlanList,
  costcenterAndBgbu: state.swCollection.costcenterAndBgbu,
});
const mapDispatchToProps = (dispatch) => ({
  getYearSwCollectionDetail: (
    brandId,
    planId,
    swCollectionNewSWId,
    costCenterCode,
    assetId
  ) =>
    dispatch({
      type: "getYearSwCollectionDetail",
      payload: {
        brandId,
        planId,
        swCollectionNewSWId,
        costCenterCode,
        assetId,
      },
    }),
  getYearPlanList: () =>
    dispatch({
      type: "getYearPlanList",
    }),
  setShowAlert: (props) =>
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    }),
  getCostcenterAndBgBu: (keyword) =>
    dispatch({
      type: "getCostcenterAndBgBu",
      payload: { keyword },
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditQueryOrDownload);
