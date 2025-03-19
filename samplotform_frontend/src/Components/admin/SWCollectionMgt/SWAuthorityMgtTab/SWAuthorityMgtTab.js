import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "../../common";
import SearchQueries from "./SearchQueries";
import HeaderColumns from "./HeaderColumns";
import BodyColumns from "./BodyColumns";
import { ALL } from "src/constants/common";

const SWAuthorityMgtTab = () => {
  const dispatch = useDispatch();
  const total = useSelector((state) => state.swCollection.total);
  const pageSize = useSelector((state) => state.swCollection.pageSize);
  const totalPages = useSelector((state) => state.swCollection.totalPages);
  const swAuthorityMgtList = useSelector(
    (state) => state.swCollection.swAuthorityMgtList
  );
  const [isASC, setIsASC] = useState(true);
  const [sortingColumn, setSortingColumn] = useState("costCenter");

  const [params, setParams] = useState({
    bg: ALL,
    bu: ALL,
    costCenter: "",
    role: ALL,
    pageNum: 0,
    pageSize,
    sort: "costCenter,asc",
    keyword: "",
  });

  useEffect(() => {
    getSwAuthorityMgtList();
  }, []);

  // useEffect(() => {
  //     getSwAuthorityMgtList();
  // }, [params.pageNum]);

  useEffect(() => {
      getSwAuthorityMgtList();
  }, [params.pageNum, params.pageSize]);

  // 下面做法會有問題。所以不採用keyword馬上調API
  // useEffect(() => {
  //   getSwAuthorityMgtList();
  // }, [params.keyword]);

  const getSwAuthorityMgtList = () => {
    const _params = {
      ...params
    };
    dispatch({
      type: "getAuthorityNewList",
      payload: _params,
    });
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
        searchQueries={
          <SearchQueries
            params={params}
            setParams={setParams}
            onSearch={getSwAuthorityMgtList}
          />
        }
        headerColumns={
            <HeaderColumns
              sortingColumn={sortingColumn}
              direction={isASC ? "asc" : "desc"}
              onClick={sortHandler}
            />
        }
        bodyColumns={<BodyColumns />}
        queryResults={{ totalPages: totalPages, total: total }}
        showPagination={true}
        page={params.pageNum}
        rowsPerPage={params.pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default SWAuthorityMgtTab;
