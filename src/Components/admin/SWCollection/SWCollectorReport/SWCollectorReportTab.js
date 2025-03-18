import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "../../common";
import SearchQueries from "./SearchQueries";
import HeaderColumns from "./HeaderColumns";
import BodyColumns from "./BodyColumns";
import { ALL } from "src/constants/common";
import { ACTIONS } from "src/Reducers/admin/SWCollection/SWReportReducer";

const SWCollectorReportTab = () => {
  const dispatch = useDispatch();
  const userFlag = useSelector((state) => state.SWReport.userFlag);
  const total = useSelector((state) => state.SWReport.total);
  const pageSize = useSelector((state) => state.SWReport.pageSize);
  const pages = useSelector((state) => state.SWReport.pages);
  

  const BodyRef = useRef(null);
  const [isASC, setIsASC] = useState(true);
  const [sortingColumn, setSortingColumn] = useState("costCenter");
  const [checkAll, setCheckAll] = useState(false);
  const [params, setParams] = useState({
    year: new Date(),
    bg: ALL,
    bu: ALL,
    costCenter: "",
    pageNum: 0,
    pageSize,
    brand: "",
    productName: "",
  });

  const getSwReportList = () => {
    const _params = {
      ...params,
      year: params.year.getFullYear(),
      userFlag: userFlag,
      pageNum: params.pageNum + 1,
    };
    dispatch({
      type: ACTIONS.GET_SW_REPORT_LIST,
      payload: _params,
    });
  };
  
  useEffect(() => {
    getSwReportList();
  }, []);

  useEffect(() => {
    getSwReportList();
  }, [params.pageNum, params.pageSize]);

  const checkAllHandleChange = (event) => { 
    if (BodyRef.current) {
      setCheckAll(event.target.checked);  
      BodyRef.current.handleSelectAll(event.target.checked);  
    }  
  };  

  const sortHandler = (property) => {
    // 判断点击的属性是否被点击过，第一次点击 sortingColumn和property不相同，asc为true，排序方式为升序，再次点击为降序
    const asc = sortingColumn === property ? !isASC : true;
    setIsASC(asc);
    setSortingColumn(property);

    setParams((prev) => ({
      ...prev,
      sort: `${property},${asc ? "asc" : "desc"}`, // 拼接为查询要求格式
      pageNum: 0,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setParams((prev) => ({
      ...prev,
      pageNum: newPage,
    }));
  };

  const handleChangeRowsPerPage = (event) => {

    setParams((prev) => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      pageNum: 0,
    }));
  };

  return (
    <>
      <Table 
        bodyColumns={<BodyColumns 
          checkAll={checkAll}
          setCheckAll={setCheckAll}
          ref={BodyRef}
        />}
        searchQueries={
          <SearchQueries
            params={params}
            setParams={setParams}
            onSearch={getSwReportList}
          />
        }
        headerColumns={
            <HeaderColumns
              sortingColumn={sortingColumn}
              direction={isASC ? "asc" : "desc"}
              onClick={sortHandler}
              checkAll={checkAll}
              setCheckAll={setCheckAll}
              onCheckAllHandleChange={checkAllHandleChange}
            />
        }
        queryResults={{ totalPages: pages, total: total }}
        showPagination={true}
        page={params.pageNum}
        rowsPerPage={params.pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default SWCollectorReportTab;
